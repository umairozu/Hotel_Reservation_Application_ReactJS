'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container, Nav, Navbar } from 'react-bootstrap';

export default function NavigationBar() {

  return (
    <Navbar expand="md" className="app-navbar py-3" sticky="top">
      <Container>

        <span className='logo d-flex align-items-center gap-2 fw-bold'>Misafir at Ease</span>

          <Nav className="gap-2 mt-3 mt-md-0">

            <Nav.Link href="/" className={`nav-link-pill`}>
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              href="/reservations"
              className={`nav-link-pill`}
>
              My Reservations
            </Nav.Link>

          </Nav>

      </Container>
    </Navbar>
  );
}
