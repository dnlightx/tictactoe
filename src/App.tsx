import React, { useState } from 'react';
import './App.css';
import TicTacToe from './components/TicTacToe';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Tic Tac Toe</h1>
        <h3>Created by Promise Omisakin</h3>
      </header>
      <TicTacToe />
    </div>
  );
}

export default App;
