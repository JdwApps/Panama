'use client'
// pages/DetailEvent.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import FlipMove from 'react-flip-move';
import Link from 'next/link';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
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


  const RenderEventsList = (events, currentEventId) => {
    const filteredEvents = events.filter((event) => event.id !== currentEventId);

    return (
      <div>
        <FlipMove
          className="justify-center flex flex-wrap"
          maintainContainerHeight='true'
          duration={600}
          staggerDurationBy={20}
        >
          {filteredEvents.map((event) => (
            <li
              key={event.id}
              className="text-white w-2/5 md:w-1/5 
             h-1/2 
            items-center justify-center lg:w-1/5 mx-3  my-4
            
            "
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
                  <img
                    className="w-full h-36 object-cover rounded-t-md"
                    src={event.image}
                  />
                  <p className="flex items-center mt-2 justify-between px-4 md:text-xl text-l font-bold truncate">
                    {event.title}
                  </p>

                  <h2 className="px-4  text-sm font-bold text-gray-300" style={{ color: `${categoryColors[event.category]}` }}>
                    {event.category}
                  </h2>
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

        </FlipMove>

      </div>
    );
  };



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
    <div className='bg-gray-900  w-screen'>
      <div className='w-4/5 bg-gray-950 h-3/4 m-auto'>
        <p style={{ backgroundColor: `${categoryColors[eventData.category]}` }}
          className="flex items-center justify-between w-full px-4 py-4 text-2xl font-bold">
          {eventData.category}
          <img src={getCategoryIcon(eventData.category)} className="w-10 h-10 ml-2" />
        </p>
        <div className='h-screen'>
          <img
            className=" object-contain h-2/3 w-full rounded-md"
            src={eventData.image}
          />
          <h2 className="px-8 text-white mt-8 font-bold text-6xl">{eventData.title}</h2>
        </div>

        <p className="px-8 overflow-hidden mb-8 text-gray-300">{eventData.description}</p>
        <p className="px-8  text-xl text-gray-200">
          {eventData.dateend
            ? formatDate(eventData.datebegin)
            : `${formatDate(eventData.datebegin)} - ${formatDate(
              eventData.dateend
            )}`}
        </p>


        <p className="px-8 text-xl mb-8 text-gray-100">
          {new Date(0, 0, 0, eventData.hourbegin.split(':')[0], eventData.hourbegin.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
          - {new Date(0, 0, 0, eventData.hourend.split(':')[0], eventData.hourend.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
        </p>
        <Link className='items-center '
          href={{
            pathname: '/Venue',
            query: { venueId: venueData.id },
          }}
        >
          <p className="px-8 text-bleuC"> {venueData.name}</p>
        </Link>
        <p className="px-8 pb-8 text-gray-200"> {venueData.address}</p>

      </div>

      {/* Display related events */}
      <h3 className="text-white text-center font-bold tracking-wider text-4xl m-8">Other {eventData.category} events:</h3>



      <ul>
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
              className="text-white 
             h-1/2 
            items-center justify-center mx-3  my-4
            
            "
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
                  <img
                    className="w-full h-36 object-cover rounded-t-md"
                    src={event.image}
                  />
                  <p className="flex items-center mt-2 justify-between px-4 md:text-xl text-l font-bold truncate">
                    {event.title}
                  </p>

                  <h2 className="px-4  text-sm font-bold text-gray-300" style={{ color: `${categoryColors[event.category]}` }}>
                    {event.category}
                  </h2>
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
      <h3 className="text-white text-center font-bold tracking-wider text-4xl m-8">Other events at  {venueData.name} :</h3>
      <ul>
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
    className="text-white
   h-1/2 
  items-center justify-center mx-3  my-4
  
  "
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
        <img
          className="w-full h-36 object-cover rounded-t-md"
          src={event.image}
        />
        <p className="flex items-center mt-2 justify-between px-4 md:text-xl text-l font-bold truncate">
          {event.title}
        </p>

        <h2 className="px-4  text-sm font-bold text-gray-300" style={{ color: `${categoryColors[event.category]}` }}>
          {event.category}
        </h2>
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
  );
};

export default DetailEvent;
