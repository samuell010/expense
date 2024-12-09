import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable logging
});


export const createLocation = async (req, res) => {
   
    const { country, city, address, settingId } = req.body;
  
    try {
      const newLocation = await prisma.location.create({
        data: {
          country, city, address, settingId,
          //latitude: parseFloat(latitude),
          //longitude: parseFloat(longitude), 
        },
      });
      res.status(201).json(newLocation); // Send the created location as response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create location' });
    }
  };


  export const updateLocation = async (req, res) => {
    const { id } = req.params; // Get the location ID from request parameters
    const { country, city, address, settingId } = req.body; // Get new data from the request body
  
    try {
      // Update the location with the provided data
      const updatedLocation = await prisma.location.update({
        where: {
          id: parseInt(id), // Ensure the ID is an integer
        },
        data: {
          country,
          city,
         // latitude: parseFloat(latitude), // Ensure latitude is a float
         // longitude: parseFloat(longitude), // Ensure longitude is a float
          address,
          settingId, // Assuming settingId can be updated as well
        },
      });
  
      res.status(200).json(updatedLocation); // Send the updated location as response
    } catch (error) {
      console.error(error);
      // Handle cases where the location was not found or other errors
      if (error.code === 'P2025') { // P2025 is Prisma's "record not found" code
        res.status(404).json({ error: 'Location not found' });
      } else {
        res.status(500).json({ error: 'Failed to update location' });
      }
    }
  };

  export const deleteLocation = async (req, res) => {
    const { id } = req.params; // Get the location ID from request parameters
  
    try {
      await prisma.location.delete({
        where: {
          id: parseInt(id), // Ensure the ID is an integer
        },
      });
  
      res.status(200).json({ message: `Location with ID ${id} deleted successfully.` });
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') { // P2025 is Prisma's "record not found" code
        res.status(404).json({ error: 'Location not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete location' });
      }
    }
  };