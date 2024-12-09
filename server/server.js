import express from "express";
import "dotenv/config";
import morgan from "morgan";
import tripsRouter from "./routes/tripsRouter.js";
import kilometerAllowancesRouter from "./routes/kilometerAllowancesRouter.js";
import allowancesRouter from "./routes/allowancesRouter.js";
import reportsRouter from "./routes/reportsRouter.js";
import otherExpensesRouter from "./routes/otherExpensesRouter.js";
import pdfRouter from "./routes/pdfRouter.js";
import attachementsRouter from "./routes/attachementsRouter.js";
import settingsRouter from "./routes/SettingsRouter.js";
import { PrismaClient } from "@prisma/client";
import cors from 'cors'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import path from "path";
import crypto from "crypto"
import locationsRoute from "./routes/locationsRouter.js"



const prisma = new PrismaClient();

const app = express();

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));

const allowedOrigins = ['http://localhost:5173']; // Add your frontend URL here

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});


//ENDPOINTS
app.use("/api/trips", tripsRouter);
app.use("/api/kilometer-allowances", kilometerAllowancesRouter);
app.use("/api/daily-allowances", allowancesRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/other-expenses", otherExpensesRouter);
app.use("/api/preview-pdf", pdfRouter);
app.use("/api/attachements", attachementsRouter);
app.use("/api/settings",settingsRouter);
app.use("/api/locations",locationsRoute);

app.get("/api/url/:filename", async (req, res) => {
  try {
    const params = { Bucket: process.env.AWS_BUCKET_NAME, Key: req.params.filename };
    
    // Create the GetObjectCommand for the specific file
    const command = new GetObjectCommand(params);
    
    // Generate the presigned URL (valid for 60 seconds)
    const url = await getSignedUrl(s3Client, command);

    // Return the presigned URL to the client
    res.json({ url });
  } catch (err) {
    console.error("Error generating presigned URL", err);
    res.status(500).json({ error: "Error generating presigned URL" });
  }
});



// Configure Multer storage in memory
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    const fileTypes =  /pdf|jpg|jpeg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
});



// // Route to handle PDF upload
// app.post('/api/upload', upload.single('file'), async (req, res) => {
//   const file = req.file;

//   if (!file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   // Set up S3 upload parameters
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME, // S3 bucket name
//     Key: file.originalname,              // File name to save as in S3
//     Body: file.buffer,                   // File content as a Buffer
//     ContentType: file.mimetype,          // MIME type for the file
//   };

//   try {
//     const command = new PutObjectCommand(params);
//     const data = await s3Client.send(command);
//     res.status(200).send(`File uploaded successfully.`);
//   } catch (err) {
//     console.error('Error uploading file:', err);
//     res.status(500).send('Error uploading file.');
//   }
// });

// Route to handle multiple PDF uploads
app.post('/api/upload', upload.array('files', 10), async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  try {
    // Loop through the files and upload them to S3
    const uploadPromises = files.map(async (file) => {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME, // S3 bucket name
        Key: file.originalname,              // File name to save as in S3
        Body: file.buffer,                   // File content as a Buffer
        ContentType: file.mimetype,          // MIME type for the file
      };
      
      const command = new PutObjectCommand(params);
      return s3Client.send(command);
    });

    // Wait for all uploads to complete
    await Promise.all(uploadPromises);
    res.status(200).send('Files uploaded successfully.');
  } catch (err) {
    console.error('Error uploading files:', err);
    res.status(500).send('Error uploading files.');
  }
});

const bucketName = process.env.AWS_BUCKET_NAME;

app.post("/api/image-upload", upload.array('files'), async (req, res) => {
  const files = req.files  // Type assertion for better TS support

  if (!files || files.length === 0) {
    return res.status(400).json("No files uploaded.");
  }

  try {
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const imageName = generateFileName();

        const uploadParams = {
          Bucket: bucketName,
          Body: file.buffer,
          Key: imageName,
          ContentType: file.mimetype
        };

        // Upload each file to S3
        await s3Client.send(new PutObjectCommand(uploadParams));

        // Get the signed URL for the uploaded file
        const getObjectParams = {
          Bucket: bucketName,
          Key: imageName
        };
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 30 });

        return {
          fileName: imageName,
          url: url
        };
      })
    );

    // Respond with the array of uploaded files
    res.status(200).json({
      uploadResults
    });

  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(400).json("Something went wrong...");
  }
});



const port = process.env.PORT || 3005;

try {
  app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
  });
} catch (error) {
  console.log(error);
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
