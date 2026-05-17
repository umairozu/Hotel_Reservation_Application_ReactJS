'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { formatDateForInput } from '../lib/dateUtils';

export default function SearchBar({ initialData, onSearch }) {
  const [formData, setFormData] = useState(initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const minimumDates = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return {
      today: formatDateForInput(today),
      tomorrow: formatDateForInput(tomorrow)
    };
  }, []);

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  }

  function validate() {
    if (!formData.searchText.trim()) return 'Search text is required.';
    if (!formData.checkInDate) return 'Check-in date is required.';
    if (!formData.checkOutDate) return 'Check-out date is required.';
    if (!formData.guestCount) return 'Guest count is required.';
    if (!formData.roomCount) return 'Room count is required.';
    if (new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      return 'Check-out date must be after check-in date.';
    }
    return '';
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validate();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setError('');
    onSearch({ ...formData, searchText: formData.searchText.trim() });
  }

  return (
    <section className="search-panel mb-4">
      <Form onSubmit={handleSubmit}>
        <Row className="g-3 align-items-end">


          <Col xs={12} lg={4}>
            <Form.Label htmlFor="searchText">Hotel</Form.Label>
            <Form.Control
              id="searchText"
              type="search"
              placeholder="Search by city, hotel, or description"
              value={formData.searchText}
              onChange={(event) => updateField('searchText', event.target.value)}
              required
            />
          </Col>



          <Col xs={12} sm={6} lg={2}>
            <Form.Label htmlFor="checkInDate">Check-in</Form.Label>
            <Form.Control
              id="checkInDate"
              type="date"
              min={minimumDates.today}
              value={formData.checkInDate}
              onChange={(event) => updateField('checkInDate', event.target.value)}
              required
            />
          </Col>



          <Col xs={12} sm={6} lg={2}>
            <Form.Label htmlFor="checkOutDate">Check-out</Form.Label>
            <Form.Control
              id="checkOutDate"
              type="date"
              min={minimumDates.tomorrow}
              value={formData.checkOutDate}
              onChange={(event) => updateField('checkOutDate', event.target.value)}
              required
            />
          </Col>



          <Col xs={6} lg={1}>
            <Form.Label htmlFor="guestCount">Guests</Form.Label>
            <Form.Select
              id="guestCount"
              value={formData.guestCount}
              onChange={(event) => updateField('guestCount', event.target.value)}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Form.Select>
          </Col>


          <Col xs={6} lg={1}>
            <Form.Label htmlFor="roomCount">Rooms</Form.Label>
            <Form.Select
              id="roomCount"
              value={formData.roomCount}
              onChange={(event) => updateField('roomCount', event.target.value)}
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Form.Select>
          </Col>


          <Col xs={12} lg={2} className="d-grid">
            <Button type="submit" size="md" variant='dark' >Search</Button>
          </Col>


        </Row>

        {error && <p className="text-danger small mb-0 mt-3">{error}</p>}

      </Form>
    </section>
  );
}
