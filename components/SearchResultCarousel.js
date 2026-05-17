'use client';

import { Button, Carousel, Col, Row } from 'react-bootstrap';
import HotelCard from './HotelCard';

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export default function SearchResultCarousel({ hotels, searchText, onSeeMore, onHotelSelect }) {
  const slides = chunkItems(hotels, 5);

  return (
    <section className="mb-5">


      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <div>
          <h2 className="section-title h3 mb-1">Hot deals in {searchText}</h2>
          <p className="text-secondary small mb-0">{hotels.length} hotel(s) found, sorted by hotel name.</p>
        </div>
        {hotels.length > 0 && (
          <Button variant="link" className="fw-semibold text-decoration-none p-0" onClick={onSeeMore}>
            See more deals →
          </Button>
        )}
      </div>


      

      {hotels.length === 0 ? (
        <div className="card-soft bg-white p-4 text-center">
          <p className="mb-0 text-secondary">No hotels matched your search.</p>
        </div>
      ) : (
        <Carousel>
          {slides.map((slideHotels, slideIndex) => (
            <Carousel.Item key={slideIndex}>
              <Row className="g-3 px-4 px-md-5 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-5">
                {slideHotels.map((hotel) => (
                  <Col key={hotel.id}>
                    <HotelCard hotel={hotel} compact onSelect={onHotelSelect} />
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </section>
  );
}
