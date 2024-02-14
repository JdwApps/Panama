'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from './Components/NavBar';


const EventsByDate = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
  const supabase = createClient(supabaseUrl, supabaseKey);

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
    async function fetchData() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 6); // Adding 7 days to today's date

      const futureYear = futureDate.getFullYear();
      const futureMonth = String(futureDate.getMonth() + 1).padStart(2, '0');
      const futureDay = String(futureDate.getDate()).padStart(2, '0');
      const formattedFutureDate = `${futureYear}-${futureMonth}-${futureDay}`;

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .or(`datebegin.lte.${formattedDate},dateend.gte.${formattedDate}`)
        .or(`datebegin.gte.${formattedDate},dateend.gte.${formattedDate}`)
        .lte('datebegin', formattedFutureDate);

      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('*');

      if (eventsError || venuesError) {
        console.error('Error fetching data from Supabase', eventsError || venuesError);
        return; // Exit early if there's an error
      }

      const mergedData = eventsData.map(event => {
        const venue = venuesData.find(venue => venue.id === event.venue_id);
        return { ...event, venue };
      });

      setEvents(mergedData);
      const uniqueCategories = [...new Set(eventsData.map(event => event.category))];
      setCategories(uniqueCategories);
    }

    fetchData();
  }, []);

  // Extracting unique dates from events
  const uniqueDates = [...new Set(events.map(event => event.datebegin))];

  const handleDateButtonClick = (date) => {
    setSelectedDate(date);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short' };
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // Adding one day to the date
    return date.toLocaleDateString('en-US', options);
  };


  const EventGroup = ({ events }) => {
    // Check if events is undefined or null, and return a message if it is
    if (!events) {
      return <p>Loading events...</p>;
    }
    const filteredEvents = events.filter(event => event.datebegin === selectedDate);

    // Once events is populated, map over it and render event details
    return (
      <div>
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="text-white items-center justify-center m-8"
          >
            <Link className='items-center '
              href={{
                pathname: '/DetailEvent',
                query: { eventId: event.id },
              }}
            >
              <div className='rounded-xl shadow-md transition-transform bg-opacity-60 transform-gpu hover:scale-105 pb-2 bg-gray-950 relative'>
                {/* Category sticker */}
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
                    className="h-full object-cover w-full rounded-t-xl"
                    src={event.image}
                    alt={event.title}
                    width={300} // Replace with the desired width
                    height={100} // Replace with the desired height
                    objectFit="cover" // Crops the image to fill the given dimensions
                  />
                </div>

                <h1 className="flex items-center mt-2 justify-between px-4 md:text-xl text-xl font-bold truncate">
                  {event.title}
                </h1>
                <h1 className="flex text-gray-200 items-center text-sm justify-between px-4  truncate">
                  {formatTime(event.hourbegin)}
                </h1>

                <h2 className="px-4 text-sm text-jauneor truncate">
                  {event.venue.name}
                </h2>
              </div>


            </Link>
          </motion.div>
        ))}
      </div>
    );
  };

  const formatTime = (timeString) => {
    // Split the time string into hours, minutes, and seconds
    const [hours, minutes] = timeString.split(':').map(Number);

    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const formattedHours = hours % 12 || 12;

    // Format minutes with leading zero if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Return formatted time
    return `${formattedHours}:${formattedMinutes} ${period}`;
  };


  return (
    <div className=' bg-gradient-to-br from-gray-600 via-bleuC  to-bleuF'>
      <Navbar />

      <div className="flex p-4 mt-4 space-x-2 justify-evenly w-full">
        {uniqueDates.sort((a, b) => new Date(a) - new Date(b)).map(date => (
          <button
            onClick={() => handleDateButtonClick(date)}
            key={date}
            className={`text-center rounded-full transition-all transition-duration-500`}
          >
            <div className={`text-lg rounded-full font-bold ${selectedDate === date ? 'text-bleuF bg-gray-200' : 'text-white'}`}>
              {new Date(date).getDate() + 1}
            </div>
            <div className={`text-lg  ${selectedDate === date ? 'text-white font-bold' : 'text-gray-200'}`}>
              {formatDate(date)}
            </div>
          </button>
        ))}

      </div>

      <EventGroup events={events.filter(event => event.datebegin === selectedDate)} />
    </div>
  );
};

export default EventsByDate;
