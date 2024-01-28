'use client'
import { useSearchParams } from 'next/navigation';

const DetailEvent = () => {
  const eventData = useSearchParams()
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

  }

  return (
    <div>
      <h1 className='text-black'>{eventData.get('longitude')}</h1>
     
        <p style={{ backgroundColor: `${categoryColors[eventData.get('category')]}` }} className="flex items-center justify-betweenw-full  px-4 text-2xl font-bold">
          {eventData.get('category')}
          <img src={getCategoryIcon(eventData.get('category'))} className="w-10 h-10 ml-2" />
        </p>
    
      <h2 className="px-4 text-jaune">{eventData.get('title')}</h2>
      <p className="px-4 overflow-hidden truncate ">{eventData.get('description')}</p>
      <p className="px-4 text-marine"> {eventData.get('venue.name')}</p>
      <p className="px-4 text-bleu">
        Date: {eventData.get('datebegin')} - {eventData.get('dateend')}
      </p>

    </div>
  );
};

export default DetailEvent;
