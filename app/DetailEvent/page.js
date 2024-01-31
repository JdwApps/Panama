'use client'
// pages/DetailEvent.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const DetailEvent = () => {
  const [eventData, setEventData] = useState(null);
  const [venueData, setVenueData] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
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
            .limit(5) // Adjust the limit as needed

          if (relatedEventsError) {
            console.error('Error fetching related events data:', relatedEventsError);
          } else {
            // Set the fetched related events data to state
            setRelatedEvents(relatedEventsData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEventData();
  }, [queryParams]);

  if (!eventData || !venueData) {
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

  return (
    <div>
      <h1 className='text-black'>{eventData.longitude}</h1>
      <p style={{ backgroundColor: `${categoryColors[eventData.category]}` }} className="flex items-center justify-between w-full px-4 text-2xl font-bold">
        {eventData.category}
        <img src={getCategoryIcon(eventData.category)} className="w-10 h-10 ml-2" />
      </p>
      <h2 className="px-4 text-jaune">{eventData.title}</h2>
      <p className="px-4 overflow-hidden truncate ">{eventData.description}</p>
      <p className="px-4 text-marine"> {venueData.name}</p>
      <p className="px-4 text-bleu">
        Date: {eventData.datebegin} - {eventData.dateend}
      </p>
      <p className="px-4 text-bleu">
              {new Date(0, 0, 0, eventData.hourbegin.split(':')[0], eventData.hourbegin.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
              - {new Date(0, 0, 0, eventData.hourend.split(':')[0], eventData.hourend.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
            </p>



      {/* Display related events */}
      <h3 className="px-4 text-jaune">Related Events</h3>
      <ul>
        {relatedEvents.map((relatedEvent) => (
          <li key={relatedEvent.id}>
            <p>{relatedEvent.title}</p>
            <p>Date: {relatedEvent.datebegin} - {relatedEvent.dateend}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetailEvent;
