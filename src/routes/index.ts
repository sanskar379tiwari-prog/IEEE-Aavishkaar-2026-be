import { Router } from 'express';
import { pingRoute } from './ping';
import { sampleRoute } from './sample';
import { registrationRoute } from './registration';

const router = Router();

router.use(pingRoute);
router.use(sampleRoute);
router.use(registrationRoute);

export default router;
