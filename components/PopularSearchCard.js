import { Card } from 'react-bootstrap';

export default function PopularSearchCard({ popularSearch, onSelect }) {
  return (
    <Card
      className="card-soft hover-lift popular-card h-100"
      role="button"
      onClick={() => onSelect(popularSearch)}
    >


      <Card.Img className="card-img-fixed" variant="top" src={popularSearch.imageUrl} alt={popularSearch.title} />


      <Card.Body>

        <Card.Title className="h5 mb-2">{popularSearch.title}</Card.Title>
        <p className="mb-1 small"><b>{popularSearch.hotelCount}</b> Hotels</p>
        <p className="mb-0 text-secondary small">Average ${popularSearch.averagePrice}</p>

      </Card.Body>

    </Card>
  );
}


