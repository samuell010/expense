import { PrismaClient, Prisma } from "@prisma/client";
import { formatDate } from "../utils/helperFunctions.js";

const prisma = new PrismaClient();

export const createTrip = async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(req.body);

  try {
    const trip = await prisma.trip.create({
      data: {
        ...req.body,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      },
    });
    res.status(201).json(trip);
  } catch (error) {
    res.status(400).json({ msg: "bad request " });
    console.log(error);
  }
};

export const getTrips = async (req, res) => {
  const { description, sortBy, isAscending, page = 1, limit = 100 } = req.query;

  const filters = {};
  const sorting = {};

  if (description) {
    filters.description = {
      contains: description,
      mode: 'insensitive',
    };
  }

  if (sortBy) {
    sorting.startDate = isAscending ? "asc" : "desc";
  }

  
  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const skip = (pageNumber - 1) * pageSize;

  const trips = await prisma.trip.findMany({
    where: filters,
    include: { kilometerAllowances: true, dailyAllowances: true },
    orderBy: sorting,
    skip,
    take: pageSize,
  });
  res.status(200).json(trips);
};

export const getTripById = async (req, res) => {
  const id = req.params.id;

  try {
    const trip = await prisma.trip.findUnique({ where: { id: parseInt(id) } });
    res.status(200).json(trip);
  } catch (error) {
    res.status(400).json("Something went wrong...");
  }
};

export const updateTrip = async (req, res) => {
  const id = req.params.id;
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

    const updatedTrip = await prisma.trip.update({
      where: {
        id: parseInt(id),
      },
      data: updateData,
    });

    res.status(200).json(updatedTrip);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Something went wrong..." });
  }
};

export const deleteTrip = async (req, res) => {
  const id = req.params.id;

  try {
    const deleteTrip = await prisma.trip.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(204).json("trip deleted");
  } catch (error) {
    res.status(400).json(error);
  }
};
