import { PrismaClient, Prisma } from '@prisma/client'
import { formatDate } from '../utils/helperFunctions.js'

const prisma = new PrismaClient()


export const getAttachements = async (req, res) => {
    try {
        const attachments = await prisma.attachment.findMany(); 
        
        res.status(201).json(attachments);
       } catch (error) {
        res.status(500).json("Something went wrong...");   
       }
}

export const createAttachment = async (req, res) => {
    try {
      const { fileName, url, otherExpenseId } = req.body;
  
      // Validate that necessary fields are provided
      if (!fileName || !url || !otherExpenseId) {
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Create the attachment
      const attachment = await prisma.attachment.create({
        data: {
          fileName,
          url,
          otherExpenseId,
        },
      });
  
      res.status(201).json(attachment);
    } catch (error) {
      console.error("Error creating attachment:", error);
      res.status(500).json({ error: "Something went wrong..." });
    }
  };