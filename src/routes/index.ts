import express from 'express';
import authRoutes from './auth.routes';
import reviewRoutes from './review.routes';
import bookingRoutes from './booking.routes';
import roomRoutes from './room.routes';
import userRoutes from './user.routes';
import likeRoutes from './like.routes';
import paymentRoutes from './payment.routes';
import chatRoutes from './chat.routes';

const router = express.Router({ mergeParams: true });

router.use('/auth', authRoutes);
router.use('/review', reviewRoutes);
router.use('/booking', bookingRoutes);
router.use('/rooms', roomRoutes);
router.use('/user', userRoutes);
router.use('/like', likeRoutes);
router.use('/payment', paymentRoutes);
router.use('/chat', chatRoutes);

export default router;