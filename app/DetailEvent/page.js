'use client'
// pages/DetailEvent.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from 'next/image';
import NavBar from '../Components/NavBar';
import dynamic from 'next/dynamic';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};


const DetailEvent = () => {
  const [eventData, setEventData] = useState(null);
  const [venueData, setVenueData] = useState(null);
  const [venueEvents, setVenueEvents] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState(null);
  const queryParams = useSearchParams();


  const VenueMap = dynamic(
    () => import('../Components/VenueMap'),
    { ssr: false }
  );

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventId = queryParams.get('eventId');

        if (!eventId) {
          // Handle the case where eventId is not present in the query parameters
          console.error('Event ID not found in query parameters.');
          return;
        }

        // Initialize Supabase client
        const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        // Fetch event data from Supabase using eventId
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('id', eventId)
          .single();

        if (eventError) {
          console.error('Error fetching event data:', eventError);
        } else {
          // Set the fetched event data to state
          setEventData(eventData);

          // Fetch venue data from Supabase using venue_id from eventData
          const { data: venueData, error: venueError } = await supabase
            .from('venues')
            .select('*')
            .eq('id', eventData.venue_id)

            .single();

          if (venueError) {
            console.error('Error fetching venue data:', venueError);
          } else {
            // Set the fetched venue data to state
            setVenueData(venueData);
          }

          // Fetch related events in the same category and begin in the next 7 days
          const { data: relatedEventsData, error: relatedEventsError } = await supabase
            .from('events')
            .select('*')
            .eq('category', eventData.category)
            .or(`datebegin.lte.${formattedDate},dateend.gte.${formattedDate}`)
            .or(`datebegin.gte.${formattedDate},dateend.gte.${formattedDate}`)
            .not('id', 'eq', eventData.id)
            .order('datebegin', { ascending: true })
            .limit(4);

          if (relatedEventsError) {
            console.error('Error fetching related events data:', relatedEventsError);
          } else {
            // Set the fetched related events data to state
            setRelatedEvents(relatedEventsData);
          }

          // Fetch venue events
          const { data: venueEventsData, error: venueEventsError } = await supabase
            .from('events')
            .select('*')
            .eq('venue_id', eventData.venue_id)
            .or(`datebegin.lte.${formattedDate},dateend.gte.${formattedDate}`)
            .or(`datebegin.gte.${formattedDate},dateend.gte.${formattedDate}`)
            .not('id', 'eq', eventData.id)
            .order('datebegin', { ascending: true })
            .limit(4);

          if (venueEventsError) {
            console.error('Error fetching venue events data:', venueEventsError);
          } else {
            // Set the fetched venue events data to state
            setVenueEvents(venueEventsData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEventData();
  }, [queryParams]);

  if (!eventData || !venueData || !venueEvents) {
    return <p>Loading...</p>; // Add loading state or component
  }

  const categoryColors = {
    Music: '#d3c858ff',
    Exhibition: '#78b23aff',
    Theater: '#2f9543ff',
    Dance: '#278d6cff',
    Cinema: '#3779a6ff',
    Kids: '#4654c8ff',
    Sports: '#7c39bfff',
    Conference: '#b64481ff',
    Festival: '#ae343eff',
    Workshop: '#c0733dff',
    Literary: '#bc8438ff',
    Culinary: '#000',
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Music':
        return 'music.svg';
      case 'Exhibition':
        return 'expo.svg';
      case 'Theater':
        return 'theatre.svg';
      case 'Dance':
        return 'dance.svg';
      case 'Cinema':
        return 'cinema.svg';
      default:
        return 'pin2.svg';
    }
  };
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };
  return (
    <div className=' bg-gradient-to-br from-Music via-Exhibition to-Dance'>
      <NavBar />
      <div className=''>
        <div className='  relative'>
          <div
            style={{
              backgroundColor: `${categoryColors[eventData.category]}`,

            }}
            className="absolute border-1 border-gray-200
                   top-2 left-2 px-2 py-1 bg-bleuC text-gray-200 text-sm font-bold rounded">
            {eventData.category}
          </div>

          <div className='h-72'>
            <Image
              className="h-full w-full object-cover  "
              src={eventData.image}
              alt={eventData.title}
              width={300} // Replace with the desired width
              height={100} // Replace with the desired height
            />
          </div>
        </div>

        <p className="px-8 overflow-hidden mt-8 text-4xl font-bold mb-8 text-gray-300">{eventData.title}</p>
        <p className="px-8 overflow-hidden mb-4 text-gray-300">{eventData.description}</p>
        <p className="px-8  text-xl text-gray-200">
          {eventData.dateend
            ? formatDate(eventData.datebegin)
            : `${formatDate(eventData.datebegin)} - ${formatDate(eventData.dateend)}`}
        </p>


        <p className="px-8 text-xl mb-4 text-gray-100">
          {new Date(0, 0, 0, eventData.hourbegin.split(':')[0], eventData.hourbegin.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
          - {new Date(0, 0, 0, eventData.hourend.split(':')[0], eventData.hourend.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
        </p>
        <Link className='items-center '
          href={{
            pathname: '/Venue',
            query: { venueId: venueData.id },
          }}
        >
          <p className="px-8 text-jauneor"> {venueData.name}</p>
        </Link>
        <p className="px-8 pb-8 text-gray-200"> {venueData.address}</p>
       <div className='justify-center mb-8 flex'>
       <VenueMap  latitude={venueData.latitude} longitude={venueData.longitude} />
      </div>
      </div>

      {/* Display related events */}


      {relatedEvents.length > 0 && (
        <div className='pb-8'>
          <h2
            className='text-center text-gray-200 text-2xl px-8 pt-8 pb-4'
          >
            Other {eventData.category} events :
          </h2>
          <ul className=''>
            <Carousel

              responsive={responsive}
              infinite={true}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              transitionDuration={500}
              removeArrowOnDeviceType={["tablet", "mobile"]}
            >
              {relatedEvents.map((event) => (
                <li
                  key={event.id}
                  className="text-white w-4/5 m-auto"
                >
                  <Link className='items-center '
                    href={{
                      pathname: '/DetailEvent',
                      query: { eventId: event.id },
                    }}
                  >
                    <div className=' rounded-md shadow-md
              transition-transform transform-gpu hover:scale-105 pb-2 bg-gray-950'
                    >
                      <div className='  relative'>
                        <div
                          style={{
                            backgroundColor: `${categoryColors[event.category]}`,

                          }}
                          className="absolute border-1 border-gray-200
                   top-2 left-2 px-2 py-1 bg-bleuC text-gray-200 text-sm font-bold rounded">
                          {event.category}
                        </div>

                        <div className='h-44 '>
                          <Image
                            className="h-full object-cover rounded-t-xl "
                            src={event.image}
                            alt={event.title}
                            width={300} // Replace with the desired width
                            height={100} // Replace with the desired height
                          />
                        </div>
                      </div>

                      <p className="flex items-center mt-2 justify-between px-4 md:text-xl text-l font-bold truncate">
                        {event.title}
                      </p>


                      <p className="px-4 text-sm text-gray-300">
                        {event.dateend
                          ? formatDate(event.datebegin)
                          : `${formatDate(event.datebegin)} - ${formatDate(
                            event.dateend
                          )}`}
                      </p>


                    </div>


                  </Link>
                </li>
              ))}

            </Carousel>

          </ul>
        </div>
      )}
      {venueEvents.length > 0 && (
        <div className='pb-12'>

          <h2
            className='text-center text-gray-200 text-2xl px-8 pt-8 pb-4'
          >
            Other events at {venueData.name} :
          </h2>
          <ul className=''>
            <Carousel

              responsive={responsive}
              infinite={true}
              autoPlaySpeed={1000}
              keyBoardControl={true}
              transitionDuration={500}
              removeArrowOnDeviceType={["tablet", "mobile"]}
            >
              {venueEvents.map((event) => (
                <li
                  key={event.id}
                  className="text-white w-4/5 m-auto"
                >
                  <Link className='items-center '
                    href={{
                      pathname: '/DetailEvent',
                      query: { eventId: event.id },
                    }}
                  >
                    <div className=' rounded-md shadow-md
    transition-transform transform-gpu hover:scale-105  bg-gray-950'
                    >
                      <div className='  relative'>
                        <div
                          style={{
                            backgroundColor: `${categoryColors[event.category]}`,

                          }}
                          className="absolute border-1 border-gray-200
                   top-2 left-2 px-2 py-1 bg-bleuC text-gray-200 text-sm font-bold rounded">
                          {event.category}
                        </div>

                        <div className='h-44'>
                          <Image
                            className="h-full object-cover rounded-t-xl "
                            src={event.image}
                            alt={event.title}
                            width={300} // Replace with the desired width
                            height={100} // Replace with the desired height
                          />
                        </div>
                      </div>
                      <p className="flex items-center mt-2 justify-between px-4 md:text-xl text-l font-bold truncate">
                        {event.title}
                      </p>

                      <p className="px-4 text-sm text-gray-300">
                        {event.dateend
                          ? formatDate(event.datebegin)
                          : `${formatDate(event.datebegin)} - ${formatDate(
                            event.dateend
                          )}`}
                      </p>


                    </div>


                  </Link>
                </li>
              ))}

            </Carousel>

          </ul>
        </div>

      )}
    </div>
  );
};

export default DetailEvent;
