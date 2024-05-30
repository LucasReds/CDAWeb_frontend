import React from 'react';
import './Home.css';

function Home() {
  const handleClick = () => {
        alert('Button Clicked!');
      };
  return (
    <div class = "title">
      <h1>Welcome to Tank Wars!</h1>
      <button class = "play-button" onClick={handleClick}>Click Me!</button>
    </div>
    
  );
}

export default Home;
