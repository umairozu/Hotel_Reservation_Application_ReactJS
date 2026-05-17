import { Card } from 'react-bootstrap';

export default function HotelCard({ hotel, onSelect, compact = false }) {
  return (

    <Card
      className="card-soft hover-lift hotel-card h-100"
      role="button"
      onClick={() => onSelect(hotel.id)}
    >


      <Card.Img
        className={compact ? 'card-img-small' : 'card-img-fixed'}
        variant="top"
        src={hotel.images?.[0]}
        alt={hotel.name}
      />


      <Card.Body>

        <Card.Title className={compact ? 'h6 mb-1' : 'h5 mb-2'}>{hotel.name}</Card.Title>
        <p className="text-secondary small mb-2">{hotel.city}, {hotel.country}</p>
        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
          <span className="badge bg-success">{hotel.rating} / 10</span>
          <span className="small text-secondary">{hotel.reviewCount} reviews</span>
        </div>
        {!compact && <p className="small text-secondary mb-2">{hotel.description}</p>}
        <p className="mb-0 fw-bold">${hotel.pricePerNight} <span className="fw-normal text-secondary small">per night</span></p>

        
      </Card.Body>

       
    </Card>
  );
}



