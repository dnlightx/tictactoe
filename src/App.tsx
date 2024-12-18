import React from 'react';
import { motion } from 'framer-motion';
import './App.css';
import TicTacToe from './components/TicTacToe';

function App() {
  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <motion.h1 
          animate={{ scale: [1, 1.1, 1] }}  
          transition={{ duration: 2 , repeat: Infinity, repeatDelay: 1 }}
        >
          Tic-Tac-Toe
        </motion.h1>
        <motion.h3 
          animate={{ scale: [1, 1.1, 1] }}  
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          style={{ 
            marginTop: '-10px',  // Reduce top margin
            fontSize: '1.2rem'    // Slightly smaller font size
          }}
        >
          by Promise Omisakin
        </motion.h3>
        <TicTacToe />
      </header>
    </div>
  );
}

export default App;
