import { Router } from 'express';
import { signup, getDepositAddress } from './controllers';

const router = Router();

router.post('/signup', signup);
router.post('/depositAddress', getDepositAddress);

export default router;