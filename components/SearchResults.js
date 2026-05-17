import { Col, Row } from 'react-bootstrap';
import HotelCard from './HotelCard';

export default function SearchResults({ hotels, title, onHotelSelect }) {
  return (
    <section className="mb-5">
      <div className="mb-3">
        <h2 className="section-title h3 mb-1">{title}</h2>
        <p className="text-secondary small mb-0">{hotels.length} hotel(s) found, sorted by hotel name.</p>
      </div>

      {hotels.length === 0 ? (
        <div className="card-soft bg-white p-4 text-center">
          <p className="mb-0 text-secondary">No hotels found.</p>
        </div>
      ) : (
        <Row className="g-4 row-cols-1 row-cols-sm-2 row-cols-lg-4">
          {hotels.map((hotel) => (
            <Col key={hotel.id}>
              <HotelCard hotel={hotel} onSelect={onHotelSelect} />
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
}
