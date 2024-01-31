'use client'



import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';
import dynamic from 'next/dynamic';

import Link from 'next/link'




import { motion, AnimatePresence } from 'framer-motion';


import localFont from 'next/font/local'
const neon = localFont({ src: './Neon.ttf' })

const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  const DynamicMap = dynamic(
    () => import('./Components/Map'),
    { ssr: false }
  );
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


  const [selectedCategory, setSelectedCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [tomorrowEvents, setTomorrowEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [showMoreToday, setShowMoreToday] = useState(false);
  const [showMoreTomorrow, setShowMoreTomorrow] = useState(false);
  const [showMoreFuture, setShowMoreFuture] = useState(false);
  const [offsetToday, setOffsetToday] = useState(0);
  const [offsetTomorrow, setOffsetTomorrow] = useState(0);
  const [offsetFuture, setOffsetFuture] = useState(0);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);

  const toggleFilters = () => {
    setIsFiltersCollapsed(!isFiltersCollapsed);
  };
  const filtersVariants = {
    collapsed: { height: 0, opacity: 0, overflow: 'hidden' },
    expanded: { height: 'auto', opacity: 1, overflow: 'visible' },
  };

  useEffect(() => {
    async function fetchData() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .or(`datebegin.lte.${formattedDate},dateend.gte.${formattedDate}`)
        .or(`datebegin.gte.${formattedDate},dateend.gte.${formattedDate}`);


      const { data: venuesData, error: venuesError } = await supabase.from('venues').select('*');
      if (eventsError || venuesError) {
        console.error('Error fetching data from Supabase', eventsError || venuesError);
      } else {
        const mergedData = eventsData.map((event) => {
          const venue = venuesData.find((venue) => venue.id === event.venue_id);
          return { ...event, venue };
        });
        setEvents(mergedData);
        const uniqueCategories = [...new Set(eventsData.map((event) => event.category))];
        setCategories(uniqueCategories);


        const todayEvents = mergedData.filter((event) => {

          return event.datebegin <= formattedDate && formattedDate <= event.dateend;
        });
        setTodayEvents(todayEvents);

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowYear = tomorrow.getFullYear();
        const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');
        const formattedTomorrowDate = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;

        const tomorrowEvents = mergedData.filter((event) => {

          return event.datebegin <= formattedTomorrowDate && formattedTomorrowDate <= event.dateend;
        });
        setTomorrowEvents(tomorrowEvents);

        const futureEvents = mergedData.filter((event) => {

          return event.dateend > formattedTomorrowDate;
        });
        setFutureEvents(futureEvents);
      }
    }
    fetchData();

  }, []);
  console.log(events);
  const filteredEventsByCategory = (events, category) => {
    return category === 'All' ? events : events.filter((event) => event.category === category);
  };

  const filteredTodayEvents = filteredEventsByCategory(todayEvents, selectedCategory);
  const filteredTomorrowEvents = filteredEventsByCategory(tomorrowEvents, selectedCategory);
  const filteredFutureEvents = filteredEventsByCategory(futureEvents, selectedCategory);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

// Function to handle "Next" button click for Today events
const handleShowNextToday = () => {
  const newOffset = offsetToday + 4;
  setOffsetToday(newOffset > todayEvents.length ? todayEvents.length : newOffset);
};

// Function to handle "Prev" button click for Today events
const handleShowPrevToday = () => {
  const newOffset = offsetToday - 4;
  setOffsetToday(newOffset < 0 ? 0 : newOffset);
};

// Function to handle "Next" button click for Tomorrow events
const handleShowNextTomorrow = () => {
  const newOffset = offsetTomorrow + 4;
  setOffsetTomorrow(newOffset > tomorrowEvents.length ? tomorrowEvents.length : newOffset);
};

// Function to handle "Prev" button click for Tomorrow events
const handleShowPrevTomorrow = () => {
  const newOffset = offsetTomorrow - 4;
  setOffsetTomorrow(newOffset < 0 ? 0 : newOffset);
};

// Function to handle "Next" button click for Future events
const handleShowNextFuture = () => {
  const newOffset = offsetFuture + 4;
  setOffsetFuture(newOffset > futureEvents.length ? futureEvents.length : newOffset);
};

// Function to handle "Prev" button click for Future events
const handleShowPrevFuture = () => {
  const newOffset = offsetFuture - 4;
  setOffsetFuture(newOffset < 0 ? 0 : newOffset);
};
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const renderEventsList = (events, handleShowNext, handleShowPrev, offset) => {
    if (events.length === 0) {
      return (
        <p className="text-white text-center mt-4">
          No events in this category: {selectedCategory}
        </p>
      );
    }
    const eventsPerPage = 4;
    const totalEvents = events.length;
    const totalPages = Math.ceil(totalEvents / eventsPerPage);
    const currentPage = Math.floor(offset / eventsPerPage) + 1;
  
    const visibleEvents = Math.min(events.length - offset, 4);
    const limitedEvents = events.slice(offset, offset + visibleEvents);
  
    return (
      <FlipMove className="justify-center flex flex-wrap">
        {limitedEvents.map((event) => (
          <li
            key={event.id}
            className="text-white w-2/5 md:w-2/5 items-center justify-center lg:w-1/5 mx-3 rounded-xl my-8"
          >
            <img
              className="w-full h-36 bg-gray-900 object-cover rounded-xl"
              src={event.image}
            />
            <p className="flex items-center justify-between px-4 text-xl font-bold">
              {event.title}
            </p>
            <p className="px-4 text-marine truncate"> {event.venue.name}</p>
            <p className="px-4 text-bleu">
              {event.dateend
                ? formatDate(event.datebegin)
                : `${formatDate(event.datebegin)} - ${formatDate(
                    event.dateend
                  )}`}
            </p>
            <h2 className="px-4 text-jaune">{event.category}</h2>
            <Link
              href={{
                pathname: '/DetailEvent',
                query: { eventId: event.id },
              }}
            >
              <p className="text-white bg-gray-700 px-4 py-2 rounded-md mt-2">
                Learn More
              </p>
            </Link>
          </li>
        ))}
        {events.length > 4 && (
          <div className="text-center w-full my-4">
            <button
              onClick={handleShowPrev}
              className="text-jaune bg-gray-800 px-4 py-2 rounded-md mr-2"
              disabled={offset === 0}
            >
              Prev
            </button>
            <span className="text-white px-4 py-2">{`${currentPage}/${totalPages}`}</span>
            <button
              onClick={handleShowNext}
              className="text-jaune bg-gray-800 px-4 py-2 rounded-md"
              disabled={offset + 4 >= events.length}
            >
              Next
            </button>
          </div>
        )}
      </FlipMove>
    );
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



  return (
    <main >
      <div className="justify-center bg-gray-900 ">

        <div className="relative">
          <img
            className='w-screen h-screen  object-cover'
            src="https://ghnvkxjbfxberpmnzjuk.supabase.co/storage/v1/object/public/images/city/city.webp"
            alt="City Image"

          />

          <div className="absolute top-1/2 left-1/2 text-4xl transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <h1 className="text-black font-bold">
              Explore, Experience, Enjoy:
            </h1>
            <h1 className={neon.className}>
              Your Cultural Adventure Awaits!
            </h1>
          </div>
        </div>




        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='flex sticky top-0 bg-gray-950 w-screen z-20'  >
          <div className={neon.className}>


            <h2 className="text-white text-center text-2xl mt-8 my-1">What are you up to ?</h2>


            <AnimatePresence>
              {isFiltersCollapsed && (
                <motion.div
                  key="filters"
                  variants={filtersVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  className="flex flex-wrap justify-center mx-2"
                >              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className=' flex justify-center mx-4'
                >

                  <button
                    key={category}
                    className={`text-gray-200 flex text-center shadow-sm 
                     shadow-black pl-2 transition-all duration-500 hover:scale-110 hover:opacity-100
                      border-white my-1 pt-1 mb-4 ml-2 md:text-sm xl:text-xl items-center rounded-full
                       ${selectedCategory === category ? 'shadow-md scale-125  shadow-white opacity-100' : ' opacity-80'}
                       `}
                    onClick={() => handleCategoryClick(category)}
                    style={{
                      backgroundColor: `${categoryColors[category]}`,

                    }}
                  >
                    {category}
                    <img src={getCategoryIcon(category)} className="w-8 h-6" />
                  </button>
                </motion.div>
              ))}
              <div className='flex justify-center'>

                <button
                  className="text-gray-800 px-4  bg-gray-200 
                    transition-transform duration-500 hover:scale-110 border-white 
                    my-1 py-2  md:text-sm xl:text-xl flex items-center 
                    rounded-full "
                  onClick={() => handleCategoryClick('All')}
                >
                  All
                </button>
              </div>

              </motion.div>
              )}
            </AnimatePresence>
            <div className="flex justify-center">
              <button
                className="text-gray-800 px-4  bg-gray-200 
                  transition-transform duration-500 hover:scale-110 border-white 
                  my-1 py-2  md:text-sm xl:text-xl flex items-center 
                  rounded-full "
                onClick={toggleFilters}
              >
                {isFiltersCollapsed ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

          </div>

        </motion.div>



        <div className={neon.className}>
          <h2 className="text-white text-center font-bold tracking-wider text-4xl m-8">Today</h2>
        </div>
        <ul>
        {renderEventsList(filteredTodayEvents, handleShowNextToday, handleShowPrevToday, offsetToday)}
        </ul>

        <div className={neon.className}>
          <h2 className="text-white text-center font-bold tracking-wider text-4xl m-8">Tomorrow</h2>
        </div>
        <ul className="rounded-lg">
        {renderEventsList(filteredTomorrowEvents, handleShowNextTomorrow, handleShowPrevTomorrow, offsetTomorrow)}
        </ul>

        <div className={neon.className}>
          <h2 className="text-white text-center font-bold tracking-wider text-4xl m-8">Later</h2>
        </div>
        <ul className="rounded-lg">
        {renderEventsList(filteredFutureEvents, handleShowNextFuture, handleShowPrevFuture, offsetFuture)}
        </ul>
      </div>
      <DynamicMap />
    </main >
  )
}