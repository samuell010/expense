import { PrismaClient, Prisma } from "@prisma/client";
import { formatDate } from "../utils/helperFunctions.js";
import db from "prisma";
import { S3Client, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import "dotenv/config";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable logging
});

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

export const getReports = async (req, res) => {
  const { title, sortBy, isAscending, page = 1, limit = 50 } = req.query;

  const filters = {};
  const sorting = {};

  if (title) {
    filters.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (sortBy) {
    sorting[sortBy] = isAscending ? "asc" : "desc";
  } else {
    sorting.createdAt = "desc"; // Default sorting by creation date in descending order
  }

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const totalReports = await prisma.report.count({
    where: filters,
  });

  const reports = await prisma.report.findMany({
    where: filters,
    // include: { kilometerAllowances: true, dailyAllowances: true },
    include: { otherExpenses: true },
    orderBy: sorting,
    skip,
    take: pageSize,
  });

  const totalPages = Math.ceil(totalReports / pageSize);

  res.status(200).json({ reports, totalPages });
};

export const getPaginatedReports = async (req, res) => {
  const { page = 1, limit = 50 } = req.query;

  const filters = {};
  const sorting = {};

  // if (sortBy) {
  //     sorting.startDate = isAscending ? "asc" : "desc";
  // }

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  try {
    const reports = await prisma.report.findMany({
      select: {
        tripId: true,
      },
      skip,
      take: pageSize,
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json("Something went wrong...");
  }
};

export const createReport = async (req, res) => {
  // const { startDate, endDate } = req.body;
  console.log(req.body);

  try {
    const report = await prisma.report.create({
      data: {
        ...req.body,
        // startDate: formatDate(startDate),
        // endDate: formatDate(endDate),
      },
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ msg: "bad request " });
    console.log(error);
  }
};

export const getReportById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is missing' });
  }

  try {
    const report = await prisma.report.findUnique({
      where: { id: parseInt(id) },
      include: {
        kilometerAllowances: true,
        dailyAllowances: true,
        otherExpenses: { include: { attachments: true } },
      },
    });

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    const currentTime = new Date();

    // Loop through the expenses and their attachments to update URLs
    for (let expense of report.otherExpenses || []) {
      for (let attachment of expense.attachments || []) {
        // Check if URL or expiration is invalid
        if (
          !attachment.url || 
          !attachment.urlExpiration || 
          attachment.urlExpiration < currentTime
        ) {
          const getObjectParams = {
            Bucket: bucketName,
            Key: attachment.fileName, // Use fileName from the attachment for the S3 Key
          };

          const command = new GetObjectCommand(getObjectParams);
          const minutesToAdd = 20; // Specify the number of minutes you want to add
          const secondsToAdd = minutesToAdd * 60; // Convert minutes to seconds

          // Generate the signed URL with the specified expiration
          const url = await getSignedUrl(s3Client, command, {
            expiresIn: secondsToAdd,
          });

          // Update attachment with the new signed URL and expiration
          attachment.url = url;
          attachment.urlExpiration = new Date(
            currentTime.getTime() + secondsToAdd * 1000
          );

          // Save the updated attachment
          await prisma.attachment.update({
            where: { id: attachment.id }, // Ensure you have the attachment ID for the update
            data: {
              url: attachment.url,
              urlExpiration: attachment.urlExpiration,
            },
          });
          console.log("New image URL generated for attachment:", attachment.fileName);
        }
      }
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json("Something went wrong....");
  }
};

export const getReportWithTrip = async (req, res) => {
  const id = req.params.id; // Ensure the ID is parsed as an integer

  try {
    // Fetch the report along with the associated trip
    const report = await prisma.report.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        trip: {
          select: {
            id: true,
            description: true,
            startDate: true,
            endDate: true,
            // Include nested relations if needed
            kilometerAllowances: true,
            dailyAllowances: true,
          },
        },
      },
    });

    // Check if the report exists
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Respond with the report and its associated trip data
    res.status(200).json(report);
  } catch (error) {
    // Handle any errors that occurred during the query
    res.status(500).json({ error: error.message });
  }
};

export const updateReport = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'ID parameter is missing' });
  }


  const { startDate, endDate, ...rest } = req.body;

  try {
    const updateData = { ...rest };

    // Conditionally format and add startDate and endDate if they exist
    if (startDate) {
      updateData.startDate = formatDate(startDate);
    }

    if (endDate) {
      updateData.endDate = formatDate(endDate);
    }

    const updatedReport = await prisma.report.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong..." });
  }
};

export const deleteReports = async (req, res) => {
  try {
    const { reportIds } = req.body;

    // Step 1: Retrieve all attachments for the reports
    const attachments = await prisma.attachment.findMany({
      where: {
        otherExpense: {
          reportId: {
            in: reportIds,
          },
        },
      },
    });

    // Step 2: Delete the attachments from S3
    if (attachments.length > 0) {
      const deleteFilePromises = attachments.map((attachment) => {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: attachment.fileName,
        };
        return s3Client.send(new DeleteObjectCommand(deleteParams));
      });
      await Promise.all(deleteFilePromises);
    }

    // Step 3: Delete the attachments from the database
    await prisma.attachment.deleteMany({
      where: {
        otherExpense: {
          reportId: {
            in: reportIds,
          },
        },
      },
    });

    // Step 4: Delete the reports from the database
    const deletedReports = await prisma.report.deleteMany({
      where: {
        id: {
          in: reportIds,
        },
      },
    });

    res.status(200).json({ message: "Reports deleted successfully", deletedReports });
  } catch (error) {
    console.error("Error deleting reports:", error);
    res.status(500).json({ message: "An error occurred while deleting reports", error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) {
    return res.status(400).json({ error: 'ID parameter is missing' });
  }


  try {
    // Step 1: Retrieve all attachments for the report
    const attachments = await prisma.attachment.findMany({
      where: {
        otherExpense: {
          reportId: id,
        },
      },
    });

    // Step 2: Delete attachments from S3 if any
    if (attachments.length > 0) {
      const deleteFilePromises = attachments.map((attachment) => {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: attachment.fileName,
        };
        return s3Client.send(new DeleteObjectCommand(deleteParams));
      });
      await Promise.all(deleteFilePromises);
    }

    // Step 3: Delete attachments from the database
    await prisma.attachment.deleteMany({
      where: {
        otherExpense: {
          reportId: id,
        },
      },
    });

    // Step 4: Delete the report itself from the database
    const deletedReport = await prisma.report.delete({
      where: {
        id: id,
      },
    });

    res.status(204).json({ message: "Report deleted successfully", deletedReport });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getLatestDraftReport = async (req, res) => {
  try {
    const report = await prisma.report.findFirst({
      where: {
        status: "DRAFT",
      },
      /* orderBy: {
        createdAt: "desc",
      }, */
    });

    if (!report) {
      return res.status(404).json({ message: "No draft report found" });
    }

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// export const deleteReports = async (req, res) => {
//   try {
//     // Extract the array of report IDs from the request body
//     const { reportIds } = req.body;

//     if (!reportIds || !Array.isArray(reportIds) || reportIds.length === 0) {
//       return res.status(400).json({ message: "No report IDs provided" });
//     }

//     // Use Prisma to delete all the reports with the given IDs
//     await prisma.report.deleteMany({
//       where: {
//         id: {
//           in: reportIds, // Use 'in' to target multiple records
//         },
//       },
//     });

//     // Send a success response
//     res.status(200).json({
//       message: `${reportIds.length} reports have been successfully deleted.`,
//     });
//   } catch (error) {
//     console.error("Error deleting reports:", error);
//     res.status(500).json({ message: "An error occurred while deleting reports" });
//   }
// };
