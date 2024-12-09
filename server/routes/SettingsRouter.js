import { Router } from 'express';
import { 
    getSettings,
    createSetting,
    updateSetting,
    deleteSetting,
    getSettingByUserId,
    deleteLocation,
    getLocations 
} from '../controllers/SettingController.js';

const router = Router();

// Routes for Settings
router.get('/', getSettings);
router.get('/:userId', getSettingByUserId)
router.post('/', createSetting);
router.put('/:id', updateSetting);
router.delete('/:id', deleteSetting);
router.get('/setting/location/:id')
router.delete('/location/:id', deleteLocation);
router.get('/:settingId/locations', getLocations);


export default router;