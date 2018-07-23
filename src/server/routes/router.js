import { Router } from 'express';
import userRouter from './api/users';
import productRouter from './api/products';

// middlewares
import parsedQuery from '../middlewares/parsedQuery';
import parsedCookies from '../middlewares/parsedCookies';

const router = Router();

router.use(parsedQuery);
router.use(parsedCookies);
router.get('/', (req, res) => res.send('Home page'));
router.use('/api/users', userRouter);
router.use('/api/products', productRouter);

export default router;
