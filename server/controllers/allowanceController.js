import { PrismaClient, Prisma } from '@prisma/client'
import { formatDate } from '../utils/helperFunctions.js'

const prisma = new PrismaClient()


export const getAllowances = async (req, res) => {
    try {
        const allowances = await prisma.dailyAllowance.findMany();
        res.status(200).json(allowances);
    } catch (error) {
        console.error('Error fetching allowances:', error);
        res.status(500).json({ error: 'Failed to fetch allowances. Please try again later.' });
    }
};

export const getAllowanceById = async (req, res) => {
    const id = req.params.id;

    try {
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format. ID should be a number.' });
        }

        const allowance = await prisma.dailyAllowance.findUnique({ where: { id: parseInt(id) } });

       
        if (!allowance) {
            return res.status(404).json({ error: 'Allowance not found.' });
        }

        res.status(200).json(allowance);
    } catch (error) {
        console.error('Error fetching allowance by ID:', error);
        res.status(500).json({ error: 'Failed to fetch allowance. Please try again later.' });
    }
};

export const createAllowance = async (req, res) => {
    const { startDate, endDate, ...rest } = req.body;

    try {
        
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Start date and end date are required.' });
        }

        const allowance = await prisma.dailyAllowance.create({
            data: {
                ...rest,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate)
            }
        });

        res.status(201).json(allowance);
    } catch (error) {
        console.error('Error creating allowance:', error);
        res.status(500).json({ error: 'Failed to create allowance. Please try again later.' });
    }
};

export const updateAllowance = async (req, res) => {
    const id = req.params.id;
    const { startDate, endDate, ...rest } = req.body;

    try {
        
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format. ID should be a number.' });
        }

        
        if (startDate && isNaN(Date.parse(startDate))) {
            return res.status(400).json({ error: 'Invalid start date format.' });
        }
        if (endDate && isNaN(Date.parse(endDate))) {
            return res.status(400).json({ error: 'Invalid end date format.' });
        }

        const updateData = { ...rest };

        if (startDate) {
            updateData.startDate = formatDate(startDate);
        }

        if (endDate) {
            updateData.endDate = formatDate(endDate);
        }

        const updatedAllowance = await prisma.dailyAllowance.update({
            where: { id: parseInt(id) },
            data: updateData
        });

        res.status(200).json(updatedAllowance);
    } catch (error) {
        console.error('Error updating allowance:', error);
        res.status(500).json({ error: 'Failed to update allowance. Please try again later.' });
    }
};

export const deleteAllowance = async (req, res) => {
    const id = req.params.id;

    try {
      
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format. ID should be a number.' });
        }

        const deletedAllowance = await prisma.dailyAllowance.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).json(deletedAllowance);
    } catch (error) {
        console.error('Error deleting allowance:', error);
        res.status(500).json({ error: 'Failed to delete allowance. Please try again later.' });
    }
};
