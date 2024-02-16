import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faSearch } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import localFont from 'next/font/local';
const panama = localFont({ src: '../Panama.ttf' });

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [text, setText] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const categories = [
    'Music',
    'Exhibition',
    'Theater',
    'Dance',
    'Cinema',
    'Kids',
    'Sports',
    'Workshop'
  ];
console.log(selectedDate)
  const menuVariants = {
    hidden: { y: -300, opacity: 0, transition: { duration: 0.5, type: 'spring', stiffness: 120, damping: 20 } },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, type: 'spring', stiffness: 120, damping: 20 } },
  };

  return (
    <nav className=' w-full bg-gray-950 bg-opacity-15'>
      <div className='flex space-x-12 md:space-x-24 items-center'>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='nav-item'
        >
          <Link href='/' className='text-white text-4xl'>
            <div className={panama.className}>Xopa</div>
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='nav-item'
        >
          <Link href='/Map'>
            <FontAwesomeIcon icon={faMap} className='text-white text-3xl' />
          </Link>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='nav-item'
        >
          <FontAwesomeIcon
            icon={faSearch}
            className='text-white text-3xl'
            onClick={toggleMenu}
          />
        </motion.div>
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="fixed top-0 z-1000 left-0 w-full h-full bg-gradient-to-br from-gray-900  to-blue-900 flex items-center justify-center z-50"
          >
          <div className='flex flex-col items-center h-full'>
          <h1 className='text-3xl pt-12 text-white font-bold'>Search</h1>

            <div className='mt-10 '>
              <input
                type='text'
                placeholder='Search'
                value={text}
                onChange={(e) => setText(e.target.value)}
                className='px-4 py-2 w-60 border rounded-md outline-none'
              />
            </div>
            <div className='mt-4'>
              {/* Category Selector */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='px-4 w-60 py-2 border rounded-md outline-none'
              >
                <option value=''>Select Category</option>
                {/* Populate options dynamically */}
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className='mt-4'>
              {/* Date Picker */}
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat='YYYY/MM/dd'
                className='px-4 py-2 w-60 border rounded-md outline-none'
                placeholderText="Pick your date"

             />
            </div>
            <div className='mt-4'>
            <Link className='items-center '
            key={`${text}-${selectedCategory}-${selectedDate}`}
            onClick={toggleMenu}
              href={{
                pathname: '/Search',
                query: { 
                  text: text,
                  category: selectedCategory,
                  date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
                },
              }}
            >
           
              <div
                className='px-4 py-2 bg-Exhibition text-white rounded-md outline-none hover:bg-blue-600'
               
              >
                Find your next Event !
              </div>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
</AnimatePresence>
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
    </nav>
  );
};

export default Navbar;
