import express, { Request, Response } from 'express';
import Room, { IRoom } from '../models/Room';
import filterRooms from '../utils/filterRooms';
import { ParsedQs } from 'qs';
import auth from '../middlewares/auth.middleware';

const router = express.Router({ mergeParams: true });

// router.get('/', async (req: Request, res: Response): Promise<Response<any, Record<string, any>> | void> => {
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const query: ParsedQs = req.query;
  try {
    const rooms: IRoom[] = await Room.find();
    if (Object.keys(query).length > 0) {
      const filteredRooms: IRoom[] | undefined  = await filterRooms(rooms, query);
      // return res.status(200).send(filteredRooms);
      res.status(200).send(filteredRooms);
      return;
    }

    res.status(200).send(rooms);
    // res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.get('/:roomId', async (req: Request, res: Response): Promise<void> => {
  const { roomId } = req.params;
  try {
    const room: IRoom | null = await Room.findById(roomId);
    res.send(room);
    // res.json(room);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.post('/:roomId', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const room: IRoom | null = await Room.findById(roomId);
    const isBooked: boolean | undefined = room?.bookings?.some(booking => booking.toString() === req.body.bookings);

    if (isBooked) {
      const updatedRoom: IRoom | null = await Room.findByIdAndUpdate(roomId, { $pull: req.body }, { new: true });
      res.send(updatedRoom);
    } else {
      const updatedRoom: IRoom | null = await Room.findByIdAndUpdate(roomId, { $push: req.body }, { new: true });
      res.send(updatedRoom);
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

router.patch('/:roomId', auth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { roomId } = req.params;
    const updatedRoom: IRoom | null = await Room.findByIdAndUpdate(roomId, req.body, { new: true });
    res.send(updatedRoom);
  } catch (error) {
    res.status(500).json({
      message: 'An error has occurred on the server. Please, try again later',
    });
  }
});

export default router;