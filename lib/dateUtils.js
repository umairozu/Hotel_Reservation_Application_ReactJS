export function formatDateForInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createDefaultSearchData() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  return {
    searchText: 'Antalya',
    checkInDate: formatDateForInput(tomorrow),
    checkOutDate: formatDateForInput(nextWeek),
    guestCount: '2',
    roomCount: '1'
  };
}

export function calculateNightCount(checkInDate, checkOutDate) {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const difference = Math.ceil((checkOut - checkIn) / millisecondsPerDay);
  return Number.isFinite(difference) && difference > 0 ? difference : 1;
}

export function calculateTotalAmount(pricePerNight, roomCount, checkInDate, checkOutDate) {
  const nights = calculateNightCount(checkInDate, checkOutDate);
  return Number(pricePerNight) * Number(roomCount) * nights;
}
