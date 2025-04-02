import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartupButton.css';

const StartupButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // This function will handle the navigation to the StartupPage
    console.log('Navigating to StartupPage');
    navigate('/startupidea');
  };

  return (
    <div className="startup-button" onClick={handleClick}>
      Have any Startup Idea? <br />
    </div>
  );
};

export default StartupButton;