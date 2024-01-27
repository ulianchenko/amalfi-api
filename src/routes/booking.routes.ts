import express, { Request, Response } from 'express';
import Booking, { IBooking } from '../models/Booking';
import checkCanBooking from '../utils/checkCanBooking';
import auth from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // const { orderBy, equalTo } = req.query;
    // const bookings = await Booking.find({ [orderBy]: equalTo });
    const bookings = await Booking.find();
    res.status(200).send(bookings);
    // res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});


router.post('/', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const canBooking: boolean = await checkCanBooking(req.body);
    if (canBooking) {
      const newBooking: IBooking = await Booking.create({
        ...req.body,
        userId: req.body.user._id,
        expires_at: req.body.departureDate - req.body.arrivalDate,
      });

      res.status(201).send(newBooking);
      // res.status(201).json(newBooking);
    } else {
      res.status(400).json({
        error: {
          message: 'BOOKING_EXIST',
          code: 400,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
    // res.status(500).send({
    //   message: 'An error has occurred on the server. Please, try again later',
    //   code: 500,
    // });
  }
});

// router.delete('/:bookingId', auth, async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> => {
// router.delete('/:bookingId', auth, async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> => {
router.delete('/:bookingId', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const removedBooking: IBooking | null = await Booking.findById(bookingId);
    const isAdmin = req.body.userRole === 'admin';
    const currentUser = removedBooking?.userId.toString() === req.body.user._id;

    if (currentUser || isAdmin) {
      // await removedBooking?.remove();
      await removedBooking?.deleteOne();
      // return res.send(null);
      // return res.send(removedBooking);
      res.send(removedBooking);
      return;
      // return res.json(removedBooking);
    } else {
      res.status(401).json({
        message: 'Unauthorized',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

export default router;
