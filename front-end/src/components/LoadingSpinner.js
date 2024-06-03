// LoadingSpinner.js
import React, { useState, useEffect } from "react";
import "./LoadingSpinner.css"; // Import the CSS file for styling

const LoadingSpinner = ({ visible, messages, interval = 2000 }) => {
  const [loadingMessage, setLoadingMessage] = useState(messages[0]);

  useEffect(() => {
    if (visible) {
      let index = 0;
      const intervalId = setInterval(() => {
        setLoadingMessage(messages[index]);
        index = (index + 1) % messages.length;
      }, interval);

      return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }
  }, [visible, messages, interval]);

  return (
    visible && (
      <div className="overlay">
        <div className="spinner"></div>
        <div className="spinner-text">{loadingMessage}</div>
      </div>
    )
  );
};

export default LoadingSpinner;
