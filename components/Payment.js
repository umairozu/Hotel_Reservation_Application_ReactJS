'use client';

import { useState } from 'react';
import { Alert, Button, Card, Col, Form, Row } from 'react-bootstrap';
import { createReservation } from '../lib/api';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  cardHolder: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
};

export default function Payment({ reservationDraft, onReservationCompleted }) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const hotel = reservationDraft.hotel;
  const reservationData = reservationDraft.reservationData;

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  }

  function validatePaymentForm() {
    const cardNumberClean = formData.cardNumber.replace(/[\s-]/g, '');
    const phoneClean = formData.phone.replace(/[\s]/g, '');

    if (!formData.firstName.trim()) return 'First name is required.';
    if (!formData.lastName.trim()) return 'Last name is required.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return 'Please enter a valid email address.';
    if (!formData.phone.trim()) return 'Phone number is required.';
    if (phoneClean.length < 11) return 'Please enter a valid phone number.';
    if (!formData.cardHolder.trim()) return 'Name on the card is required.';
    if (!/^\d{16}$/.test(cardNumberClean)) return 'Card number must contain 16 digits.';
    if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate.trim())) return 'Expiration date must be in MM/YY format.';
    if (!/^\d{3}$/.test(formData.cvv.trim())) return 'Security number must be 3 digits.';
    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    const validationMessage = validatePaymentForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const reservation = {
      hotel: {
        name: hotel.name,
        address: hotel.address
      },
      reservationData: {
        roomCount: reservationData.roomCount,
        guestCount: reservationData.guestCount,
        roomType: reservationData.roomType,
        checkInDate: reservationData.checkInDate,
        checkOutDate: reservationData.checkOutDate
      },
      guestData: {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      },
      paymentInformation: {
        cardInfo: {
          cardNumber: formData.cardNumber.trim(),
          cardHolder: formData.cardHolder.trim(),
          expiryDate: formData.expiryDate.trim(),
          cvv: formData.cvv.trim()
        },
        paymentMethod: 'Credit Card',
        totalAmount: reservationData.totalAmount
      }
    };

    try {
      setIsSaving(true);
      await createReservation(reservation);
      setFormData(emptyForm);
      setSuccess('Booking completed successfully.');
      window.alert('Booking completed successfully.');
      if (onReservationCompleted) onReservationCompleted();
    } catch (saveError) {
      setError('Reservation could not be saved. Please make sure json-server is running.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section>
      <h1 className="section-title mb-3">Payment</h1>
      <Row className="g-4">
        <Col xs={12} lg={4}>
          <Card className="card-soft">
            <Card.Img variant="top" className="card-img-fixed" src={hotel.images?.[0]} alt={hotel.name} />
            <Card.Body>
              <Card.Title className="h5">{hotel.name}</Card.Title>
              <p className="text-secondary small">{hotel.address}</p>
              <ul className="list-unstyled small mb-3">
                <li><b>Check-in:</b> {reservationData.checkInDate}</li>
                <li><b>Check-out:</b> {reservationData.checkOutDate}</li>
                <li><b>Guests:</b> {reservationData.guestCount}</li>
                <li><b>Rooms:</b> {reservationData.roomCount}</li>
                <li><b>Room Type:</b> {reservationData.roomType}</li>
              </ul>
              <div className="border-top pt-3">
                <span className="text-secondary small d-block">Total Amount</span>
                <strong className="fs-4">${reservationData.totalAmount}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} lg={8}>
          <Form className="card-soft bg-white p-4" onSubmit={handleSubmit} noValidate>
            <h2 className="h4 section-title mb-3">Your Reservation Information</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Label htmlFor="firstName">Your Name <span className="required-star">*</span></Form.Label>
                <Form.Control
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(event) => updateField('firstName', event.target.value)}
                  required
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label htmlFor="lastName">Your Surname <span className="required-star">*</span></Form.Label>
                <Form.Control
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(event) => updateField('lastName', event.target.value)}
                  required
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label htmlFor="email">Your Email Address <span className="required-star">*</span></Form.Label>
                <Form.Control
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                />
              </Col>
              <Col xs={12} md={6}>
                <Form.Label htmlFor="phone">Your Phone Number <span className="required-star">*</span></Form.Label>
                <Form.Control
                  id="phone"
                  type="tel"
                  placeholder="555 5555 55 55"
                  value={formData.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  required
                />
              </Col>

            </Row>

            <h2 className="h4 section-title mt-5 mb-3">Payment Options</h2>
            <div className="border border-terniary rounded-4 p-3 p-md-4">
              <h3 className="h5 mb-3">Guarantee by credit card</h3>
              <Row className="g-3">
                <Col xs={12}>
                  <Form.Label htmlFor="cardHolder">Name on the card <span className="required-star">*</span></Form.Label>
                  <Form.Control
                    id="cardHolder"
                    placeholder="Name on the card"
                    value={formData.cardHolder}
                    onChange={(event) => updateField('cardHolder', event.target.value)}
                    required
                  />
                </Col>
                <Col xs={12}>
                  <Form.Label htmlFor="cardNumber">Card Number <span className="required-star">*</span></Form.Label>
                  <Form.Control
                    id="cardNumber"
                    inputMode="numeric"
                    placeholder="1234-5678-9012-3456"
                    value={formData.cardNumber}
                    onChange={(event) => updateField('cardNumber', event.target.value)}
                    required
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form.Label htmlFor="expiryDate">Expiration Date <span className="required-star">*</span></Form.Label>
                  <Form.Control
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(event) => updateField('expiryDate', event.target.value)}
                    required
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form.Label htmlFor="cvv">Security Number <span className="required-star">*</span></Form.Label>
                  <Form.Control
                    id="cvv"
                    inputMode="numeric"
                    placeholder="CVC"
                    value={formData.cvv}
                    onChange={(event) => updateField('cvv', event.target.value)}
                    required
                  />
                </Col>

                <Col xs={12} className="text-end">
                  <Button type="submit" size="lg" variant='secondary'>
                    {isSaving ? 'Saving...' : 'Complete the Booking'}
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </Col>
      </Row>
    </section>
  );
}
