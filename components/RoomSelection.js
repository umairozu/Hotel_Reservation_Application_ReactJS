'use client';

import { useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { calculateTotalAmount, calculateNightCount } from '../lib/dateUtils';

export default function RoomSelection({ hotel, searchData, onProceedToPayment }) {
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [roomCount, setRoomCount] = useState(searchData.roomCount || '1');
  const [error, setError] = useState('');

  const selectedRoom = hotel.rooms.find((room) => room.type === selectedRoomType);
  const nights = calculateNightCount(searchData.checkInDate, searchData.checkOutDate);

  const totalAmount = useMemo(() => {
    if (!selectedRoom) return 0;
    return calculateTotalAmount(selectedRoom.price, roomCount, searchData.checkInDate, searchData.checkOutDate);
  }, [selectedRoom, roomCount, searchData.checkInDate, searchData.checkOutDate]);

  function handleBookRoom() {
    if (!selectedRoomType) {
      setError('Please select a room type.');
      return;
    }
    if (!roomCount) {
      setError('Please select a room count.');
      return;
    }

    setError('');
    onProceedToPayment({
      hotel,
      reservationData: {
        roomCount: Number(roomCount),
        guestCount: Number(searchData.guestCount),
        roomType: selectedRoomType,
        checkInDate: searchData.checkInDate,
        checkOutDate: searchData.checkOutDate,
        totalAmount
      }
    });
  }

  return (
    <section className="card-soft bg-white p-4 mt-4">

      <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
        <div>
          <h3 className="h4 section-title mb-1">Room Selection</h3>
          <p className="text-secondary small mb-0">{nights} night(s) · choose room type and room count</p>
        </div>
        <div className="text-md-end">
          <span className="text-secondary small d-block">Estimated total</span>
          <strong className="fs-4">${totalAmount}</strong>
        </div>
      </div>

      {error && <p className="text-danger small">{error}</p>}

      <div className="vstack gap-3 mb-4">
        {hotel.rooms.map((room) => (
          <label className="room-option p-3" key={room.type} htmlFor={`room-${room.type.replaceAll(' ', '-')}`}>
            <Row className="align-items-center g-3">
              <Col xs={12} md={7}>

                <Form.Check
                  id={`room-${room.type.replaceAll(' ', '-')}`}
                  type="radio"
                  name="roomType"
                  value={room.type}
                  label={<span className="fw-bold">{room.type}</span>}
                  onChange={(event) => setSelectedRoomType(event.target.value)}
                />

                <p className="text-secondary small mb-0 mt-2">
                  Fits {room.guests} guest(s) · {room.refundable ? 'Free cancellation' : 'Non-refundable'}
                </p>

              </Col>

              <Col xs={12} md={5} className="text-md-end">
                <strong>${room.price}</strong>
                <span className="text-secondary small"> / night</span>
              </Col>

            </Row>
          </label>
        ))}
      </div>

      <Row className="g-3 align-items-end">


        <Col xs={12} md={4}>
          <Form.Label htmlFor="selectedRoomCount">Room count</Form.Label>
          <Form.Select
            id="selectedRoomCount"
            value={roomCount}
            onChange={(event) => setRoomCount(event.target.value)}
            required >

            <option value="1">1 Room</option>
            <option value="2">2 Rooms</option>
            <option value="3">3 Rooms</option>
          </Form.Select>
        </Col>

        <Col xs={12} md={5} className='d-flex justify-content-start '>
          <Button size="lg" variant='dark' onClick={handleBookRoom}>Book Now</Button>
        </Col>



      </Row>
    </section>
  );
}
