import { Router } from "express";
import { createTrip, deleteTrip, getTripById, getTrips, updateTrip } from "../controllers/tripsController.js";
import { validateTrip, validateTripUpdate } from "../middleware/validationMiddleware.js";


const router = Router();


router.get('/', getTrips);
router.post('/', validateTrip, createTrip);
router.get('/:id', getTripById);
router.patch('/:id', validateTripUpdate, updateTrip);
router.delete('/:id', deleteTrip);
// router.get('/test', getTripsWithForeignKey);

export default router;