'use client'



import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';
import dynamic from 'next/dynamic';

import Link from 'next/link'




import { motion } from 'framer-motion';


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
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('Today');


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

  const handleShowMoreToday = () => {
    setShowMoreToday(!showMoreToday);
  };

  const handleShowMoreTomorrow = () => {
    setShowMoreTomorrow(!showMoreTomorrow);
  };

  const handleShowMoreFuture = () => {
    setShowMoreFuture(!showMoreFuture);
  };

  const renderEventsList = (events, showMore, handleShowMore) => {
    const limitedEvents = showMore ? events : events.slice(0, 4);

    return (
      <FlipMove className="justify-center  flex flex-wrap ">
        {limitedEvents.map((event) => (
          <li key={event.id}
            className="text-white w-1/3 md:w-2/5 items-center justify-center lg:w-1/5 mx-6 rounded-xl my-2"
          >

            <p className="flex items-center justify-between  px-4 text-xl font-bold">
              {event.title}

            </p>
            <img
              className="w-full h-36 bg-gray-900 object-cover rounded-xl "
              src={event.image}
            />
            <h2 className="px-4 text-jaune">{event.category}</h2>
            <p className="px-4 overflow-hidden truncate ">{event.description}</p>
            <p className="px-4 text-marine truncate"> {event.venue.name}</p>
            <p className="px-4 text-bleu">
              Date: {event.datebegin} - {event.dateend}
            </p>
            <Link
              href={{
                pathname: '/DetailEvent',
                query: { ...event, ...event.venue },
              }}
            >
              <p
                className="text-white bg-gray-700 px-4 py-2 rounded-md mt-2"
              >
                Learn More

              </p>
            </Link>
            {/* Add more details here */}

          </li>
        ))}
        {events.length > 4 && (
          <div className="text-center w-full my-4">
            <button onClick={handleShowMore} className="text-jaune bg-gray-800 px-4 py-2 rounded-md">
              {showMore ? 'Show less' : 'Show more'}
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

  const handleTimeFrameClick = (timeFrame) => {
    setSelectedTimeFrame(timeFrame);
  };

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
          className='flex'  >
          <div className={neon.className}>


            <h2 className="text-white text-center text-2xl mt-8 my-1">What are you up to ?</h2>
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

            <div className="flex flex-wrap mx-2 ">

              {categories.map((category, index) => (
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
                      border-white my-1 pt-1 ml-2 md:text-sm xl:text-xl items-center rounded-full
                       ${selectedCategory === category ? 'shadow-md shadow-white opacity-100' : ' opacity-95'}
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

            </div>

          </div>

        </motion.div>



        <div className={neon.className}>

          <h2 className="text-white items-center font-bold text-4xl m-8">Today</h2>
        </div>
        <ul>
          {renderEventsList(filteredTodayEvents, showMoreToday, handleShowMoreToday)}
        </ul>
        <div className={neon.className}>

          <h2 className="text-white text-4xl my-4">Tomorrow</h2>
        </div>

        <ul className="rounded-lg">
          {renderEventsList(filteredTomorrowEvents, showMoreTomorrow, handleShowMoreTomorrow)}
        </ul>
        <div className={neon.className}>

          <h2 className="text-white  text-4xl my-4">Future</h2>
        </div>

        <ul className="rounded-lg">
          {renderEventsList(filteredFutureEvents, showMoreFuture, handleShowMoreFuture)}
        </ul>
      </div>
      <DynamicMap/>
    </main >
  )
}