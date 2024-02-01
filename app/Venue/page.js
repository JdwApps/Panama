'use client'
// pages/Venue.js
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


const Venue = () => {
  const [venueData, setVenueData] = useState(null);
  const [venueEvents, setVenueEvents] = useState(null);
  const queryParams = useSearchParams();


  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const venueId = queryParams.get('venueId');

        if (!venueId) {
          // Handle the case where venueId is not present in the query parameters
          console.error('Event ID not found in query parameters.');
          return;
        }

        // Initialize Supabase client
        const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Fetch event data from Supabase using venueId
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select('*')
          .eq('id', venueId)
          .single(); // Assuming 'id' is a unique identifier

        if (venueError) {
          console.error('Error fetching event data:', venueError);
        } else {
          // Set the fetched event data to state
          setVenueData(venueData);



          // Fetch venue events
          const { data: venueEventsData, error: venueEventsError } = await supabase
            .from('events')
            .select('*')
            .eq('venue_id', venueId)
            .limit(4)

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

  if (!venueData || !venueEvents) {
    return <p>Loading...</p>; // Add loading state or component
  }




  const RenderEventsList = (events) => {


    return (
      <div>
        <FlipMove
          className="justify-center flex flex-wrap"
          maintainContainerHeight='true'
          duration={600}
          staggerDurationBy={20}
        >
          {events.map((event) => (
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
        <p
          className="flex items-center justify-between text-white w-full px-4 py-4 text-2xl font-bold">
          {venueData.category}

        </p>
        <div className='h-screen'>
          <img
            className=" object-contain h-2/3 w-full rounded-md"
            src={venueData.image}
          />

          <h2 className="px-8 text-white mt-8 font-bold text-6xl">{venueData.name}</h2>

        </div>

        <p className="px-8 overflow-hidden mb-8 text-gray-300">{venueData.description}</p>

        <p className="px-8 pb-8 text-gray-200"> {venueData.address}</p>

      </div>


      <h3 className="text-white text-center font-bold tracking-wider text-4xl m-8">Events at  {venueData.name} :</h3>
      <ul className='w-screen'>
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
            className="text-white  
           h-1/2 
          items-center justify-center  mx-3  my-4
          
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

export default Venue;
