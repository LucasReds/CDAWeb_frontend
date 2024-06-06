import React from 'react';
import playButton from '../components/playButton';
import standardButton from '../components/standardButton';
import './Home.css';

function Home() {
  const handleClick = () => {
    alert('Button Clicked!');
  };
  return (
    <div style={{ position: 'relative' }}>
      <div className="title">
        <h1>Tank Wars</h1>
        <button className="play-button" onClick={handleClick}>
          Click to Play
        </button>
      </div>
    </div>
  );
}

export default Home;
