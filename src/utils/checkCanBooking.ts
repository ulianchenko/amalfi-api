import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Booking from '../models/Booking';

dayjs.extend(isBetween);

//Interface
interface IBookingData {
  adults: number;
  babies: number;
  children: number;
  arrivalDate: Date;
  departureDate: Date;
  roomId: string;
  userId: string;
  totalPrice: number;
  expires_at?: number;
}

const checkCanBooking = async (bookingData: IBookingData): Promise<boolean> => {
  const bookings: IBookingData[] = await Booking.find();

  // const hasDuplicateBookingData =
  //   bookings.filter(
  //     booking =>
  //       moment(booking.arrivalDate).toString() === moment(bookingData.arrivalDate).toString() ||
  //       moment(booking.departureDate).toString() === moment(bookingData.departureDate).toString()
  //   ).length > 0;
  const hasDuplicateBookingData: boolean =
    bookings.filter(
      booking =>
        dayjs(booking.arrivalDate) === dayjs(bookingData.arrivalDate) ||
        dayjs(booking.departureDate) === dayjs(bookingData.departureDate)
        ).length > 0;

  if (hasDuplicateBookingData) return false;

  const bookedRoomsIds = bookings
    .filter(
      booking =>
      dayjs(bookingData.arrivalDate).isBetween(dayjs(booking.arrivalDate), dayjs(booking.departureDate)) ||
      dayjs(bookingData.departureDate).isBetween(dayjs(booking.arrivalDate), dayjs(booking.departureDate)) ||
      dayjs(booking.arrivalDate).isBetween(dayjs(bookingData.arrivalDate), dayjs(bookingData.departureDate))
    )
    .map(booking => booking.roomId.toString());

  return bookedRoomsIds.filter(bookingId => bookingId === bookingData.roomId).length <= 0;
};

export default checkCanBooking;
