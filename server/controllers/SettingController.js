import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // Enable logging
});


// Get all settings
export const getSettings = async (req, res) => {
  try {
    const settings = await prisma.setting.findMany({
      include: {
        locations: true, // Include associated locations
      },
    });
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const getSettingByUserId = async (req,res) => {
       const userId = req.params.userId
     
       try {
        const setting = await prisma.setting.findFirst({
          where: {userId},
          include:{
            locations: true,
          }
        })
        console.log(setting)
        res.status(200).json(setting || {})

       } catch (error) {
        res.status(500).json('somthing was wrong')
       }
  

}



// Create a new setting
export const createSetting = async (req, res) => {
  const { currency, language, userId } = req.body;
 
  // get setting of userId
  const setting = await prisma.setting.findFirst({
    where: {userId},
    include:{
      locations: true,
    }
  })

  if (setting) {
    console.log("setting found updating...")
    try {
      const updatedSetting = await prisma.setting.updateMany({
        where: { userId },
        data: {
          currency,
          language
        },
      });
      res.status(200).json(updatedSetting);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update setting' });
    }
    return;
  }


  try {
    console.log("setting not found creating...")
    const newSetting = await prisma.setting.create({
      data: {
        currency,
        language,
        userId
        // locations: {
        //   create: locations, // Create associated locations for the new setting
        // },
      },
      // include: {
      //   locations: true,
      // },
    });
    console.log({ newSetting });
    res.status(201).json(newSetting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create setting' });
  }
};

// Create locations under a specific setting
export const createLocation = async (req, res) => {
  const settingId = parseInt(req.params.id); // Setting ID is passed via the URL
  const { locations } = req.body; // Expect an array of locations

  // Ensure the setting ID and locations array are provided
  if (!settingId || !Array.isArray(locations) || locations.length === 0) {
    return res.status(400).json({ error: "Invalid input. A valid setting ID and locations are required." });
  }

  try {
    // Fetch the existing setting to ensure it exists
    const setting = await prisma.setting.findUnique({
      where: { id: settingId },
    });

    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }

    // Create multiple locations and associate them with the setting
    const newLocations = await prisma.location.createMany({
      data: locations.map((location) => ({
        ...location, // Spread location data (e.g., name, address, etc.)
        settingId: settingId, // Associate with the setting
      })),
    });

    // Return the created locations
    res.status(201).json({ message: "Locations created successfully", locations: newLocations });
  } catch (error) {
    console.error("Failed to create locations:", error);
    res.status(500).json({ error: "Failed to create locations" });
  }
};

// Update an existing setting
export const updateSetting = async (req, res) => {
  const { id } = req.params;
  const { currency, language, locations } = req.body;

  try {
    const updatedSetting = await prisma.setting.update({
      where: { id:id },
      data: {
        currency,
        language,
        locations: {
          delete: {}, // Delete existing locations
          create: locations, // Create new locations
        },
      },
      include: {
        locations: true,
      },
    });
    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

// Delete a setting
export const deleteSetting = async (req, res) => {
  const id  = parseInt(req.params.id);
  console.log(id)
  try {
    await prisma.setting.delete({
      where: { id:id  },
    });
    res.status(200).json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete setting' });
  }
  
};

// Controller for deleting a specific location associated with a setting ID
export const deleteLocation = async (req, res) => {
  const { id, locationId } = req.params; // setting ID and location ID from the URL

  try {
    // Check if the location exists and is associated with the provided setting ID
    const location = await prisma.location.findUnique({
      where: { id: parseInt(locationId) },
      include: { setting: true },
    });

    if (!location || location.setting.id !== parseInt(id)) {
      return res.status(404).json({ error: 'Location not found or does not belong to this setting' });
    }

    // Delete the location if it belongs to the specified setting
    await prisma.location.delete({
      where: { id: parseInt(locationId) },
    });
    res.status(200).json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete location' });
  }
};


// Controller function to get locations by setting ID
export const getLocations = async (req, res) => {
  const { settingId } = req.params; // Extract the setting ID from the route parameter

  try {
    // Find the setting and include its locations
    const setting = await prisma.setting.findUnique({
      where: {
        id: parseInt(settingId),
      },
      include: {
        locations: true, // Include associated locations
      },
    });

    // Check if the setting was found
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    // Send the locations as the response
    res.status(200).json(setting.locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
};