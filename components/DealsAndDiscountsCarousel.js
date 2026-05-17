'use client';

import { Carousel, Col, Row } from 'react-bootstrap';
import DealAndDiscountCard from './DealAndDiscountCard';

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export default function DealsAndDiscountsCarousel({ deals }) {
  const slides = chunkItems(deals, 4);

  return (
    <section className="mb-5">
      <h2 className="section-title h3 mb-3">Deals and Discounts</h2>
      {slides.length === 0 
      ? (
        <p className="text-secondary">No deals found.</p>
      ) 
      : (
        <Carousel>
          {slides.map((slideDeals, slideIndex) => (
            <Carousel.Item key={slideIndex}>
              <Row className="g-3 px-4 px-md-5">
                {slideDeals.map((deal) => (
                  <Col xs={12} sm={6} lg={3} key={deal.id}>
                    <DealAndDiscountCard deal={deal} />
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
