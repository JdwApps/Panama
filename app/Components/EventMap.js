import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../Map/leaflet-custom.css'; 
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';


export default function EventMap  ({ events, selectedDate })  {
    // Check if events is undefined or null, and return a message if it is
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
    // Once events is populated, map over it and render event details
    return (
        <div className=''>
            <MapContainer center={[8.96, -79.55]} zoom={13} style={{ width: '100vw', height: '65vh' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {events.map((event) => (
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
                                transition={{ duration: 0.5 }}
                                className=''
                            >
                                <div className='  relative'>
                                    <div
                                        style={{
                                            backgroundColor: `${categoryColors[event.category]}`,

                                        }}
                                        className="absolute border-1 border-gray-200
                                        top-2 left-2 px-2 py-1 bg-bleuC text-gray-200
                                        text-sm font-bold rounded">
                                        {event.category}
                                    </div>

                                    <div className='h-24'>
                                        <Image
                                            className="h-full w-full object-cover  "
                                            src={event.image}
                                            alt={event.title}
                                            width={300} // Replace with the desired width
                                            height={100} // Replace with the desired height
                                        />
                                    </div>
                                </div>

                                <p className=" text-2xl font-bold text-white">{event.title}</p>
                                <p className='text-gray-300'>
                                {formatDate(event.datebegin)}  {new Date(0, 0, 0, event.hourbegin.split(':')[0], event.hourbegin.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })} - {new Date(0, 0, 0, event.hourend.split(':')[0], event.hourend.split(':')[1]).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                                </p>
                                <p className='text-jauneor'>{event.venue.name}</p>
                                
                                <Link className='items-center '
                                    href={{
                                        pathname: '/DetailEvent',
                                        query: { eventId: event.id },
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
                ))}
            </MapContainer>

        </div>
    );
};