import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faSearch } from '@fortawesome/free-solid-svg-icons';
const Navbar = () => {
  const [active, setActive] = useState(null);

  const handleSetActive = (page) => {
    setActive(page);
  };

  return (
    <nav className='space-x-8 w-full bg-gray-950 bg-opacity-40'>
      <div className='flex p-4 justify-between items-center'>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`nav-item ${active === 'home' ? 'active' : ''} `}
        onClick={() => handleSetActive('home')}

      >
        <Link href="/" className='text-gray-200 text-xl'>
          Xopa
        </Link>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`nav-item ${active === 'map' ? 'active' : ''}`}
        onClick={() => handleSetActive('map')}
      >
        <Link href="/map">
          <FontAwesomeIcon icon={faMap} className='text-white text-xl' />
        </Link>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`nav-item ${active === 'search' ? 'active' : ''}`}
        onClick={() => handleSetActive('search')}
      >
        <Link href="/search">
          <FontAwesomeIcon icon={faSearch} className='text-white text-xl' />

        </Link>
      </motion.div>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: center;
          align-items: center;
    
          height: 60px;
        }
        .nav-item {
          
          cursor: pointer;
        }
        .active {
          color: #fff;
          font-weight: bold;
        }
      `}</style>
      </div>
    </nav>
  );
};

export default Navbar;
