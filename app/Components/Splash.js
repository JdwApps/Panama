import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../xopa.json'; // Import your Lottie animation JSON file

const Splash = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData, // This is your imported animation data
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className='h-screen w-screen bg-gray-950  flex items-center justify-center'>
      <Lottie options={defaultOptions} height={900} width={1200} />
    </div>
  );
}

export default Splash;
