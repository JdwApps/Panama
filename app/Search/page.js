'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '../Components/NavBar';
import { motion } from 'framer-motion';
import Splash from '../Components/Splash';

// Initialize Supabase client
const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
const supabase = createClient(supabaseUrl, supabaseKey);

const Search = () => {
  const queryParams = useSearchParams();
  const text = queryParams.get('text');
  const category = queryParams.get('category');
  const date = queryParams.get('date');

  const [searchResults, setSearchResults] = useState([]);

  const categoryColors = {
    Music: '#58508d',
    Exhibition: '#8a508f',
    Theater: '#bc5090',
    Dance: '#de5a79',
    Cinema: '#ff6361',
    Kids: '#ff8531',
    Sports: '#ffa600',
    Workshop: '#003f5c',
  };

  useEffect(() => {
    const fetchData = async () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        let query = supabase.from('events')
            .select('*')
            .or(`datebegin.lte.${formattedDate},dateend.gte.${formattedDate}`)
            .or(`datebegin.gte.${formattedDate},dateend.gte.${formattedDate}`);

        if (text) {
            query = query.filter('title', 'ilike', `%${text}%`);
        }
        if (category) {
            query = query.filter('category', 'eq', category);
        }
        if (date) {
            query = query.filter('datebegin', 'eq', date);
        }
        if (!date) {
            query = query.order('datebegin', { ascending: true });
        }

        // Fetch data from Supabase
        const { data: eventData, error: eventError } = await query;
        if (eventError) {
            console.error('Error fetching event data:', eventError.message);
            return;
        }

        // Fetch venue data for each event
        const eventVenueIds = eventData.map(event => event.venue_id);
        const { data: venueData, error: venueError } = await supabase.from('venues').select('*').in('id', eventVenueIds);
        if (venueError) {
            console.error('Error fetching venue data:', venueError.message);
            return;
        }

        // Merge venue data with event data
        const mergedResults = eventData.map(event => {
            const venue = venueData.find(venue => venue.id === event.venue_id);
            return { ...event, venue };
        });

        setSearchResults(mergedResults || []);
    };

    fetchData();
}, [text, category, date]);


  const groupedEvents = searchResults.reduce((acc, event) => {
    const eventDate = new Date(event.datebegin).toLocaleDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});

  let notificationMessage = '';
  if (text) {
    notificationMessage += `Searching for: "${text}" `;
  }
  if (category) {
    notificationMessage += `in Category: ${category} `;
  }
  if (date) {
    notificationMessage += `at Date: ${date}`;
  }
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };


  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };


  if (!searchResults) {
    return <Splash />; // Add loading state or component
  }


  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900'>
      <NavBar />

      <div className="">
 
        {notificationMessage && (
          <p className="text-lg text-center text-white my-4 px-8">{notificationMessage}</p>
        )}

        {Object.entries(groupedEvents).map(([date, events]) => (
          <div key={date} className="">
            <h2 className="text-xl text-center bg-gray-950 bg-opacity-20 py-4 text-white font-semibold mb-8">{formatDate(date)}</h2>
            <div className='flex  flex-wrap space-x-8 items-center justify-center'>
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="text-white items-center hover:scale-105  lg:w-3/8 w-5/6 md:w-2/5 justify-center mb-8"
                  >
                  <Link className='items-center '
                    href={{
                      pathname: '/DetailEvent',
                      query: { eventId: event.id },
                    }}
                  >
                    <div className='rounded-xl flex  shadow-md  bg-opacity-60   bg-gray-950 relative'>
                      <div>
                        <div
                          style={{
                            backgroundColor: `${categoryColors[event.category]}`,

                          }}
                          className="absolute border-1 border-gray-200
                                      top-2 left-2 px-2 py-1 bg-bleuC text-gray-200 text-sm font-bold rounded">
                          {event.category}
                        </div>

                        <div className='h-24 w-24 lg:h-44 lg:w-44'>
                          <Image
                            className="h-full object-cover w-full rounded-tl-xl rounded-bl-xl"
                            src={event.image}
                            alt={event.title}
                            width={300} // Replace with the desired width
                            height={100} // Replace with the desired height
                            objectFit="cover" // Crops the image to fill the given dimensions
                          />
                        </div>
                      </div>
                      <div className='w-full flex flex-col justify-center overflow-hidden'>
                        <h1 className="mt-2 px-4  text-xl font-bold">
                          {event.title}
                        </h1>
                        <h1 className="mt-2 px-4  text-xl ">
                        {event.price === 0 ? 'Free' : `${event.price} $`}
                        </h1>
                        <h1 className="mt-2  px-4 text-jauneor truncate">
                          {event.venue.name}
                        </h1>
                        <h1 className=" text-gray-200 items-center text-sm px-4">
                          {formatTime(event.hourbegin)}
                        </h1>
                      </div>

                    </div>


                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
