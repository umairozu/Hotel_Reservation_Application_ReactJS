'use client';

import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { deleteReservation, getHotelsSorted, getReservations } from '../lib/api';

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  async function loadReservations() {
    try {
      setIsLoading(true);
      const [reservationList, hotelList] = await Promise.all([getReservations(), getHotelsSorted()]);
      setReservations(reservationList);
      setHotels(hotelList);
      setError('');
    } catch (loadError) {
      setError('Reservations could not be loaded. Please make sure json-server is running.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteReservation(reservationId) {
    try {
      await deleteReservation(reservationId);
      setReservations((currentReservations) => (
        currentReservations.filter((reservation) => reservation.id !== reservationId)
      ));
    } catch (deleteError) {
      setError('Reservation could not be deleted. Please try again.');
    }
  }

  function findHotelImage(reservation) {
    const matchedHotel = hotels.find((hotel) => (
      hotel.name === reservation.hotel.name && hotel.address === reservation.hotel.address
    ));
    return matchedHotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="section-title mb-1">My Reservations</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="card-soft bg-white p-4 text-center">
          <p className="mb-0 text-secondary">There are no reservations yet.</p>
        </div>
      ) : (
        <Row className="g-4 row-cols-1 row-cols-md-2 row-cols-xl-3">
          {reservations.map((reservation) => (
            <Col key={reservation.id}>
              <Card className="card-soft reservation-card h-100">
                <Card.Img
                  variant="top"
                  className="card-img-fixed"
                  src={findHotelImage(reservation)}
                  alt={reservation.hotel.name}
                />
                <Card.Body className="pb-5 mb-3">
                  <Card.Title className="h5 text-center mb-1">{reservation.hotel.name}</Card.Title>
                  <p className="text-center text-secondary small mb-3">
                    {reservation.guestData.firstName} {reservation.guestData.lastName}
                  </p>
                  <div className="border rounded-4 p-3 small bg-light">
                    <div><b>Room Count:</b> {reservation.reservationData.roomCount}</div>
                    <div><b>Guest Count:</b> {reservation.reservationData.guestCount}</div>
                    <div><b>Room Type:</b> {reservation.reservationData.roomType}</div>
                    <div><b>Check In Date:</b> {reservation.reservationData.checkInDate}</div>
                    <div><b>Check Out Date:</b> {reservation.reservationData.checkOutDate}</div>
                    <div><b>Total:</b> ${reservation.paymentInformation.totalAmount}</div>
                  </div>
                  <Button
                    variant="danger"
                    size="md"
                    className="delete-reservation-btn"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
}
