'use client';

import { Carousel, Col, Row } from 'react-bootstrap';
import PopularSearchCard from './PopularSearchCard';

function chunkItems(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

export default function PopularSearches({ popularSearches, onPopularSearchSelect }) {
  const slides = chunkItems(popularSearches, 4);

  return (
    <section className="mb-5">
      <h2 className="section-title h3 mb-3">Popular Searches</h2>
      {slides.length === 0 ? (
        <p className="text-secondary">No popular searches found.</p>
      ) : (
        <Carousel>
          {slides.map((slideSearches, slideIndex) => (
            <Carousel.Item key={slideIndex}>
              <Row className="g-3 px-4 px-md-5">
                {slideSearches.map((popularSearch) => (
                  <Col xs={12} sm={6} lg={3} key={popularSearch.id}>
                    <PopularSearchCard popularSearch={popularSearch} onSelect={onPopularSearchSelect} />
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
