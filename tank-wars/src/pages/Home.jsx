import React from 'react';
import playButton from '../components/playButton';
import standardButton from '../components/standardButton';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  const handleClick = () => {
    alert('Button Clicked!');
  };
  return (
    <div style={{ position: 'relative' }}>
      <div className="title">
        <h1>Tank Wars</h1>
        
        <Link to="/phaser-game">Start Game</Link>
        
      </div>
    </div>
  );
}

export default Home;
