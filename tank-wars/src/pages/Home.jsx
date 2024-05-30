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
      <div>
        <button className="standard-button" onClick={handleClick} style={{ position: 'absolute', top: '10px', left: '10px' }}>
          Login or Register
        </button>
        <button className="standard-button" onClick={handleClick} style={{ position: 'absolute', top: '10px', right: '10px' }}>
          Customize
        </button>
      </div>
    </div>
  );
}

export default Home;
