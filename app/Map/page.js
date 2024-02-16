'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '../Components/NavBar';
import dynamic from 'next/dynamic';


const EventsByDate = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
    const supabase = createClient(supabaseUrl, supabaseKey);
    const EventMap = dynamic(
        () => import('../Components/EventMap'),
        { ssr: false }
      );
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

    }
    if (events.length == 0) {
        return <p>Loading...</p>; // Add loading state or component
    }
    

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
        <div className='min-h-screen bg-gradient-to-br from-Music via-Exhibition to-Dance'>
            <Navbar />

            <div className="flex px-4 my-4 space-x-2 justify-evenly w-full">
                {uniqueDates.sort((a, b) => new Date(a) - new Date(b)).map(date => (
                    <button
                        onClick={() => handleDateButtonClick(date)}
                        key={date}
                        className={`text-center rounded-full transition-all transition-duration-500`}
                    >
                        <div className={`text-lg  ${selectedDate === date ? 'text-white font-bold' : 'text-gray-200'}`}>
                            {formatDate(date)}
                        </div>
                        <div className={`text-lg rounded-full font-bold ${selectedDate === date ? 'text-bleuF bg-gray-200' : 'text-white'}`}>
                            {new Date(date).getDate() + 1}
                        </div>

                    </button>
                ))}

            </div>

            <EventMap 
            events={events.filter(event => event.datebegin === selectedDate)}
            selectedDate={selectedDate}
             />
        </div>
    );
};

export default EventsByDate;
