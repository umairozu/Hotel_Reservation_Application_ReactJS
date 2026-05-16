export const API_BASE_URL = 'http://localhost:3001';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getDeals() {
  return request('/deals');
}

export function getPopularSearches() {
  return request('/popularSearches');
}

export function getHotelsSorted() {
  return request('/hotels?_sort=name&_order=asc');
}

export async function searchHotels(searchText) {
  const text = searchText.trim();
  const encodedText = encodeURIComponent(text);

  let queriedHotels = [];
  try {
    queriedHotels = await request(`/hotels?q=${encodedText}&_sort=name&_order=asc`);
  } catch (error) {
    queriedHotels = [];
  }

  const lowerText = text.toLowerCase();
  const matchesSearchText = (hotel) => [
    hotel.name,
    hotel.description,
    hotel.information,
    hotel.city,
    hotel.country,
    hotel.address
  ].some((value) => String(value || '').toLowerCase().includes(lowerText));

  let filteredHotels = queriedHotels.filter(matchesSearchText);

  if (filteredHotels.length === 0) {
    const allHotels = await getHotelsSorted();
    filteredHotels = allHotels.filter(matchesSearchText);
  }

  return filteredHotels.sort((hotelA, hotelB) => hotelA.name.localeCompare(hotelB.name));
}

export function getHotelById(hotelId) {
  return request(`/hotels/${hotelId}`);
}

export function getReservations() {
  return request('/reservations');
}

export function createReservation(reservation) {
  return request('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservation)
  });
}

export function deleteReservation(reservationId) {
  return request(`/reservations/${reservationId}`, {
    method: 'DELETE'
  });
}
