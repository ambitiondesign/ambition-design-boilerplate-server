import { Router } from 'express';
import UserController from '../controllers/UserController';
import auth from '../util/auth';

const router = Router();

// router.get('/username/:username', AudienceController.getAllAudiencesByUsername);
// router.post('/', AudienceController.addAudience);
// router.get('/:id', AudienceController.getAudience);
// router.put('/:id', AudienceController.updateAudience);
// router.delete('/:id', AudienceController.deleteAudience);
router.get('/:email', auth, UserController.getUser);
router.post('/:email', auth, UserController.updateUser);

export default router;