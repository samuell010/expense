import { PrismaClient, Prisma } from '@prisma/client'
import { formatDate } from '../utils/helperFunctions.js'
const prisma = new PrismaClient()

export const createKilometerAllowance = async (req, res) => {

    const {startDate, endDate} = req.body
    console.log(req.body);

    try {
        const kilometerAllowance = await prisma.kilometerAllowance.create({
            data: {
                ...req.body,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate)
            }
        })
        res.status(201).json(kilometerAllowance);
    } catch (error) {
        res.status(400).json({ msg: "bad request "});
        console.log(error);
    }

}

export const getKilometerAllowances = async (req, res) => {
    try {
        const kilometerAllowances = await prisma.kilometerAllowance.findMany()
        res.status(200).json(kilometerAllowances);
    } catch (error) {
        res.status(400).json(error.message);
    }
   
}

export const getKilometerAllowanceById = async (req, res) => {
    const id = req.params.id;
    
    try {
        const kilometerAllowance = await prisma.kilometerAllowance.findUnique({ where: { id: parseInt(id) }});
        if (!kilometerAllowance) {
            return res.status(404).json({ message: "Kilometer allowance not found" });
        }
        res.status(200).json(kilometerAllowance);
    } catch (error) {
        res.status(400).json({msg: "Something went wrong..."});
    }

}

export const getKilometerAllowancesByTripId = async (req, res) => {
    
    const { tripId } = req.body;

    try {
        const kilometerAllowances = await prisma.kilometerAllowance.findMany({
            where: {
                tripId: parseInt(tripId),
            },
        });

        if (kilometerAllowances.length === 0) {
            return res.status(404).json({ message: "No kilometer allowances found for this trip ID" });
        }

        res.status(200).json(kilometerAllowances);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateKilometerAllowance = async (req, res) => {

    const id = req.params.id;
    const { startDate, endDate, ...rest } = req.body;

    try {
        const updateData = { ...rest };

        if (startDate) {
          updateData.startDate = formatDate(startDate);
        }
    
        if (endDate) {
          updateData.endDate = formatDate(endDate);
        }
    
        const updatedKilometerAllowance = await prisma.kilometerAllowance.update({
          where: {
            id: parseInt(id),
          },
          data: updateData,
        });

        res.status(200).json(updatedKilometerAllowance);
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: "Something went wrong..."})
    }
}

export const deleteKilometerAllowance = async (req, res) => {

    const id = req.params.id;

    try {
        const deleteTrip = await prisma.kilometerAllowance.delete({
            where: {
              id: parseInt(id),
            },
          })
        res.status(204).json("kilometer allowance deleted");
    } catch (error) {
        res.status(400).json(error);
    }
}