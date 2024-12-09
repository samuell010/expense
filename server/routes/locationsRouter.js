import { Router } from 'express';
import {
    createLocation,
    deleteLocation,
    updateLocation
} from '../controllers/locationController.js';

const router = Router();

// Routes for Settings

router.post('/', createLocation);
router.put('/:id', updateLocation);
// router.delete('/locations/:id', deleteLocation);
router.delete('/:id', deleteLocation);



export default router;
