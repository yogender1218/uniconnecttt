import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StartupButton.css'; // Assuming the CSS file name remains the same

const StartupInvestor = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    // This function will handle the navigation to the InvestPage
    console.log('Navigating to InvestPage');
    navigate('/investidea');
  };

  return (
    <div className="startup-button" onClick={handleClick}>
      Invest for Ideas? <br />
    </div>
  );
};

export default StartupInvestor;