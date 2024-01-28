'use client'


import Image from 'next/image'
import CategoHalf from './Components/CategoHalf'
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import FlipMove from 'react-flip-move';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link'


import * as L from 'leaflet';

import { motion } from 'framer-motion';


import localFont from 'next/font/local'
const neon = localFont({ src: '/Neon.ttf' })

const supabaseUrl = 'https://ghnvkxjbfxberpmnzjuk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdobnZreGpiZnhiZXJwbW56anVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTc1OTM1NTksImV4cCI6MjAxMzE2OTU1OX0.9BNmWeaFhZD6GbwrNkd_BBzFJlLCMEGVmKEt6OtQmdA';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {

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
      <FlipMove className="justify-center  flex flex-wrap mx-2">
        {limitedEvents.map((event) => (
          <li key={event.id}
            className="text-white w-4/5 md:w-2/5 h-64 lg:w-1/5 bg-gray-800 mx-2 rounded-xl my-2"
            style={{ borderWidth: 4, borderColor: `${categoryColors[event.category]}` }}
          >
            <div className={neon.className}>
              <p style={{ backgroundColor: `${categoryColors[event.category]}` }} className="flex items-center justify-betweenw-full  px-4 text-2xl font-bold">
                {event.category}
                <img src={getCategoryIcon(event.category)} className="w-10 h-10 ml-2" />
              </p>
            </div>
            <h2 className="px-4 text-jaune">{event.title}</h2>
            <p className="px-4 overflow-hidden truncate ">{event.description}</p>
            <p className="px-4 text-marine"> {event.venue.name}</p>
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
        <div className='w-1/4 bg-gray-500 flex '>
          <Image

            src="/logo.svg"
            alt="Next.js Logo"
            width={300}
            height={37}
            priority
          />
        </div>




        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='flex bg-gray-700'  >
          <div className='w-1/4'>
            <h2 className="text-white text-center text-xl my-1">When?</h2>
            <div className={neon.className}>

              <div className="flex flex-wrap  justify-center  items-center my-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0 }}
                >
                  <button
                    className={`text-gray-800  md:text-md shadow-sm shadow-black transition-all duration-500 px-2 py-1 my-2 mr-4 text-xl hover:opacity-100 hover:scale-110 rounded-full bg-gray-200 ${selectedTimeFrame === 'Today' ? 'opacity-100' : 'opacity-50'
                      }`}
                    onClick={() => handleTimeFrameClick('Today')}
                  >
                    Today
                  </button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: .2 }}
                >
                  <button
                    className={`text-gray-800 transition-all shadow-sm shadow-black duration-500 px-2 py-1 my-2 mr-4 text-xl hover:scale-110 hover:opacity-100 rounded-full bg-gray-200 ${selectedTimeFrame === 'Tomorrow' ? 'opacity-100' : 'opacity-50'
                      }`}
                    onClick={() => handleTimeFrameClick('Tomorrow')}
                  >
                    Tomorrow
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: .4 }}
                >
                  <button
                    className={`text-gray-800 px-2 py-1 mr-4 shadow-sm shadow-black duration-500 my-2  transition-transform text-xl hover:scale-110 rounded-full hover:opacity-100 bg-gray-200 ${selectedTimeFrame === 'Future' ? 'opacity-100' : 'opacity-50'
                      }`}
                    onClick={() => handleTimeFrameClick('Future')}
                  >
                    Future
                  </button>
                </motion.div>
              </div>
            </div>

            <h2 className="text-white text-center text-xl my-1">What?</h2>
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

            <div className="flex flex-wrap justify-between mx-2 ">

              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className='w-full flex justify-center'
                >

                  <button
                    key={category}
                    className={`text-gray-200 flex justify-between text-center shadow-sm w-4/5 shadow-black pl-2 transition-all duration-500 hover:scale-110 hover:opacity-100 border-white my-1 pt-1 ml-2 md:text-sm xl:text-xl items-center rounded-full ${selectedCategory === category ? 'shadow-md shadow-white opacity-100' : ' opacity-50'
                      }`}
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
          <div className=''>
            <MapContainer center={[8.96, -79.52]} zoom={14} style={{ width: '75vw', height: '100vh' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {(() => {
                switch (selectedTimeFrame) {
                  case 'Today':
                    return filteredTodayEvents.map((event) => (
                      <Marker
                        key={event.id}
                        position={[event.venue.latitude, event.venue.longitude]}
                        icon={L.icon({
                          iconUrl: getCategoryIcon(event.category),
                          iconSize: [42, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                        })}
                        className="pulse fade-in"
                      >
                        <Popup >
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className={neon.className}>
                              <h2 className='rounded-lg text-gray-200 pl-2 text-xl' style={{ backgroundColor: `${categoryColors[event.category]}` }} >{event.title}</h2>
                            </div>
                            <p>{event.description}</p>
                            <p className='text-sanguine text-lg'>{event.venue.name}</p>
                            <p>
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
                          </motion.div>
                        </Popup>
                      </Marker>


                    ));
                  case 'Tomorrow':
                    return filteredTomorrowEvents.map((event) => (
                      <Marker
                        key={event.id}
                        position={[event.venue.latitude, event.venue.longitude]}
                        icon={L.icon({
                          iconUrl: getCategoryIcon(event.category),
                          iconSize: [42, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                        })}
                      >
                        <Popup>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className={neon.className}>
                              <h2 className='rounded-lg text-gray-200 pl-2 text-xl' style={{ backgroundColor: `${categoryColors[event.category]}` }} >{event.title}</h2>
                            </div>
                            <p>{event.description}</p>
                            <p className='text-sanguine text-lg'>{event.venue.name}</p>
                            <p>
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
                          </motion.div>
                        </Popup>
                      </Marker>
                    ));
                  case 'Future':
                    return filteredFutureEvents.map((event) => (
                      <Marker
                        key={event.id}
                        position={[event.venue.latitude, event.venue.longitude]}
                        icon={L.icon({
                          bouncemarker: true,
                          iconUrl: getCategoryIcon(event.category),
                          iconSize: [42, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                        })}
                      >
                        <Popup>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className={neon.className}>
                              <h2 className='rounded-lg text-gray-200 pl-2 text-xl' style={{ backgroundColor: `${categoryColors[event.category]}` }} >{event.title}</h2>
                            </div>
                            <p>{event.description}</p>
                            <p className='text-sanguine text-lg'>{event.venue.name}</p>
                            <p>
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
                          </motion.div>
                        </Popup>
                      </Marker>
                    ));
                  default:
                    return null;
                }
              })()}
            </MapContainer>

          </div>
        </motion.div>



        <div className={neon.className}>

          <h2 className="text-white text-center text-2xl my-4">Today</h2>
        </div>
        <ul>
          {renderEventsList(filteredTodayEvents, showMoreToday, handleShowMoreToday)}
        </ul>
        <div className={neon.className}>

          <h2 className="text-white text-center text-2xl my-4">Tomorrow</h2>
        </div>

        <ul className="rounded-lg">
          {renderEventsList(filteredTomorrowEvents, showMoreTomorrow, handleShowMoreTomorrow)}
        </ul>
        <div className={neon.className}>

          <h2 className="text-white text-center text-2xl my-4">Future</h2>
        </div>

        <ul className="rounded-lg">
          {renderEventsList(filteredFutureEvents, showMoreFuture, handleShowMoreFuture)}
        </ul>
      </div>

      {events.map((event) => (
        <p key={event.id}>{event.id}</p>
      ))}
    </main >
  )
}