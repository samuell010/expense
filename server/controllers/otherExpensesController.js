import { PrismaClient, Prisma } from "@prisma/client";
import { formatDate } from "../utils/helperFunctions.js";

const prisma = new PrismaClient();

export const getOtherExpenses = async (req, res) => {
  try {
    const expenses = await prisma.otherExpense.findMany();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json("Something went wrong");
  }
};

// export const createOtherExpense = async (req, res) => {
//   const { date } = req.body;
//   console.log(date);
//   try {
//     const expense = await prisma.otherExpense.create({
//       data: {
//         ...req.body,
//         date: formatDate(date),
//       },
//     });
//     res.status(201).json(expense);
//   } catch (error) {
//     res.status(400).json("Something went wrong");
//   }
// };

export const getOtherExpenseId = async (req, res) => {
  const id = req.params.id;
  
  try {
      const otherExpense = await prisma.otherExpense.findUnique({ where: { id: parseInt(id) }});
      if (!otherExpense) {
          return res.status(404).json({ message: "Other expense not found" });
      }
      res.status(200).json(otherExpense);
  } catch (error) {
      res.status(400).json({msg: "Something went wrong..."});
  }

}


export const createOtherExpense = async (req, res) => {
  const { type, date, amount, country, vat, sum, description, comment, reportId, attachments } = req.body;

  try {
    // Create the OtherExpense along with nested attachments
    const newOtherExpense = await prisma.otherExpense.create({
      data: {
        type,
        date,
        amount,
        country,
        vat,
        sum,
        description,
        comment,
        report: {
          connect: {
            id: reportId, // Connecting to an existing report
          },
        },
        attachments: {
          create: attachments, // Use "attachments" instead of "attachment"
        },
      },
      include: {
        attachments: true, // Include attachments in the response
      },
    });

    res.status(201).json(newOtherExpense);
  } catch (error) {
    console.error("Error creating OtherExpense: ", error); // Log the actual error
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
};


export const deleteOtherExpense = async (req, res) => {

  const id = req.params.id;

  try {
      const deleteOtherExpense = await prisma.otherExpense.delete({
          where: {
            id: parseInt(id),
          },
        })
      res.status(204).json("other expense deleted");
  } catch (error) {
      res.status(400).json(error);
  }
}