'use client';

import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { getDeals, getPopularSearches, searchHotels } from '../lib/api';
import { createDefaultSearchData } from '../lib/dateUtils';
import DealsAndDiscountsCarousel from './DealsAndDiscountsCarousel';
import HotelDetail from './HotelDetail';
import Payment from './Payment';
import PopularSearches from './PopularSearches';
import SearchBar from './SearchBar';
import SearchResultCarousel from './SearchResultCarousel';
import SearchResults from './SearchResults';

const defaultSearchData = createDefaultSearchData();

export default function HomePage() {
  const [deals, setDeals] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [searchData, setSearchData] = useState(defaultSearchData);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [reservationDraft, setReservationDraft] = useState(null);
  const [view, setView] = useState('initial');
  const [isLoadingHomeData, setIsLoadingHomeData] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadHomeData() {
      try {
        setIsLoadingHomeData(true);
        const [dealList, popularSearchList] = await Promise.all([getDeals(), getPopularSearches()]);
        if (!ignore) {
          setDeals(dealList);
          setPopularSearches(popularSearchList);
          setError('');
        }
      } catch (loadError) {
        if (!ignore) setError('Home page data could not be loaded. Please make sure json-server is running.');
      } finally {
        if (!ignore) setIsLoadingHomeData(false);
      }
    }

    loadHomeData();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSearch(submittedSearchData) {
    setSearchData(submittedSearchData);
    setSelectedHotelId(null);
    setReservationDraft(null);
    setError('');

    try {
      setIsSearching(true);
      const hotels = await searchHotels(submittedSearchData.searchText);
      setSearchResults(hotels);
      setView(view === 'results' ? 'results' : 'carousel');
    } catch (searchError) {
      setError('Search could not be completed. Please make sure json-server is running.');
    } finally {
      setIsSearching(false);
    }
  }

  async function handlePopularSearchSelect(popularSearch) {
    const popularSearchData = { ...searchData, searchText: popularSearch.query };
    setSearchData(popularSearchData);
    setSelectedHotelId(null);
    setReservationDraft(null);
    setError('');

    try {
      setIsSearching(true);
      const hotels = await searchHotels(popularSearch.query);
      setSearchResults(hotels);
      setView('results');
    } catch (searchError) {
      setError('Popular search could not be completed. Please make sure json-server is running.');
    } finally {
      setIsSearching(false);
    }
  }

  function handleHotelSelect(hotelId) {
    setSelectedHotelId(hotelId);
    setReservationDraft(null);
    setView('details');
  }

  function handleProceedToPayment(draft) {
    setReservationDraft(draft);
    setView('payment');
  }


  if (view === 'details' && selectedHotelId) {
    return (
      <HotelDetail
        hotelId={selectedHotelId}
        searchData={searchData}
        onProceedToPayment={handleProceedToPayment}
      />
    );
  }

  if (view === 'payment' && reservationDraft) {
    return <Payment reservationDraft={reservationDraft} />;
  }

  return (
    <section>
      <SearchBar initialData={searchData} onSearch={handleSearch} />

      {error && <Alert variant="danger">{error}</Alert>}

      {isSearching && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {!isSearching && view === 'initial' && (
        isLoadingHomeData ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <>
            <DealsAndDiscountsCarousel deals={deals} />
            <PopularSearches popularSearches={popularSearches} onPopularSearchSelect={handlePopularSearchSelect} />
          </>
        )
      )}

      {!isSearching && view === 'carousel' && (
        <>
          <SearchResultCarousel
            hotels={searchResults}
            searchText={searchData.searchText}
            onSeeMore={() => setView('results')}
            onHotelSelect={handleHotelSelect}
          />
          <PopularSearches popularSearches={popularSearches} onPopularSearchSelect={handlePopularSearchSelect} />
        </>
      )}

      {!isSearching && view === 'results' && (
        <SearchResults
          hotels={searchResults}
          title={`Results for ${searchData.searchText}`}
          onHotelSelect={handleHotelSelect}
        />
      )}
    </section>
  );
}
