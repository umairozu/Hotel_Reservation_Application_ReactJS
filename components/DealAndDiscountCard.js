import { Card } from 'react-bootstrap';

export default function DealAndDiscountCard({ deal }) {
  return (
    <Card className="card-soft hover-lift h-100">

      <Card.Img className="deal-img" variant="top" src={deal.imageUrl} alt={deal.title} />

      <Card.Body>

        <Card.Title className="h5">{deal.title}</Card.Title>

        <Card.Text className="text-secondary small">{deal.details}</Card.Text>
        <a href="#" className="fw-semibold text-decoration-none" onClick={(event) => event.preventDefault()}>
          Learn more
        </a>
        
      </Card.Body>

    </Card>
  );
}
