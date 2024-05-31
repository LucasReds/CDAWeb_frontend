import React from 'react';
import playButton from '../components/playButton';
import standardButton from '../components/standardButton';
import './Home.css';

function Rules() {
  const handleClick = () => {
    alert('Button Clicked!');
  };
  return (
    <div style={{ position: 'relative' }}>
      <div className="title">
        <h1>Tank Wars</h1>
      </div>
      <h2 className='centered-text sub-title'>Rules</h2>
    </div>
  );
}

export default Rules;
