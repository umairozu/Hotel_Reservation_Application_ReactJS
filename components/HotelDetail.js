'use client';


import { useEffect, useState } from 'react';
import { Alert, Button, Carousel, Col, Row, Spinner } from 'react-bootstrap';
import { getHotelById } from '../lib/api';
import RoomSelection from './RoomSelection';



export default function HotelDetail({ hotelId, searchData, onProceedToPayment }) {
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRoomSelection, setShowRoomSelection] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadHotel() {
      try {
        setIsLoading(true);
        const selectedHotel = await getHotelById(hotelId);
        if (!ignore) {
          setHotel(selectedHotel);
          setError('');
        }
      } catch (loadError) {
        if (!ignore) setError('Hotel details could not be loaded. Please make sure json-server is running.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadHotel();

    return () => {
      ignore = true;
    };
  }, [hotelId]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!hotel) return <Alert variant="warning">Hotel was not found.</Alert>;

  return (
    <section>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 mb-3">
        <div>
          <h1 className="section-title mb-1">{hotel.name}</h1>
          <p className="text-secondary mb-0">{hotel.address} · {hotel.city}, {hotel.country}</p>
        </div>
        <Button variant='dark' onClick={() => setShowRoomSelection(true)}>Book Now</Button>
      </div>

      <Carousel className="card-soft mb-4" interval={5000}>
        {hotel.images.map((imageUrl, index) => (
          <Carousel.Item key={imageUrl}>
            <img className="hotel-photo" src={imageUrl} alt={`${hotel.name} photo ${index + 1}`} />
          </Carousel.Item>
        ))}
      </Carousel>

      <Row className="g-4">


        <Col xs={12} lg={7}>
          <div className="info-box h-100">
            <h2 className="h4 section-title">About the property</h2>
            <p>{hotel.description}</p>
            <h3 className="h5 mt-4">Location</h3>
            <p className="mb-0 text-secondary">{hotel.address}. This property is in {hotel.city} and offers comfortable rooms for holiday and business stays.</p>
          </div>
        </Col>


        <Col xs={12} lg={5}>
          <div className="info-box h-100">
            <h2 className="h4 section-title">Hotel policies</h2>
            <dl className="row mb-0">
              <dt className="col-5">Check-in</dt>
              <dd className="col-7">After {hotel.policies.checkIn}</dd>

              <dt className="col-5">Check-out</dt>
              <dd className="col-7">Before {hotel.policies.checkOut}</dd>

              <dt className="col-5">Pets</dt>
              <dd className="col-7">{hotel.policies.pets}</dd>

              <dt className="col-5">Smoking</dt>
              <dd className="col-7">{hotel.policies.smoking}</dd>
              
              <dt className="col-5">Children</dt>
              <dd className="col-7">{hotel.policies.children}</dd>
            </dl>
          </div>
        </Col>


      </Row>

      {showRoomSelection && (
        <RoomSelection hotel={hotel} searchData={searchData} onProceedToPayment={onProceedToPayment} />
      )}
    </section>
  );
}
