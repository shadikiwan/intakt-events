import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [futureEvents, setFutureEvents] = useState([]);

  useEffect(() => {
    fetch('/.netlify/functions/calendar')
      .then(response => response.json())
      .then(data => {
        setCurrentEvent(data.currentEvent);
        setFutureEvents(data.futureEvents);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  // Function to smoothly scroll through future events
  const scrollToBottom = () => {
    const container = document.querySelector('.events-container');
    let frameCount = 0; // Initialize a frame counter
    const framesPerScroll = 5; // Adjust this value to slow down or speed up the scroll
  
    const scroll = () => {
      if (container.scrollTop < container.scrollHeight - container.offsetHeight) {
        // Increment frame counter
        frameCount++;
  
        // Only scroll down every 'framesPerScroll' frames
        if (frameCount >= framesPerScroll) {
          container.scrollBy(0, 1);
          frameCount = 0; // Reset frame counter
        }
        
        requestAnimationFrame(scroll);
      } else {
        container.scrollTo(0, 0);
        requestAnimationFrame(scroll);
      }
    };
  
    requestAnimationFrame(scroll);
  };
  


  return (
    
    <div className="App">
        <div className="header-titles">
          <div className="site-logo">
            <a href="https://intakt-magdeburg.de/" rel="home" className="custom-logo-link custom-logo">
            <img loading="lazy" className="logo-regular" src="https://intakt-magdeburg.de/wp-content/uploads/2020/06/cropped-0847d-logo.jpg" width="349" height="262" alt="in:takt logo" />
            </a>
            <span className="screen-reader-text">in:takt</span>
          </div>
          <div className="header-logo-text">
            <div className="site-title" aria-hidden="true"><a href="https://intakt-magdeburg.de/" rel="home">in:takt</a></div>
              <div className="site-description color-secondary">Der Freiraum für alle</div>
          </div>
        </div>
      <div className="container">
      <div className="left-column">
        <div className="current-event">
          <h2>Aktuelle Veranstaltung</h2>
          {currentEvent ? (
            <>
              <p><strong>{currentEvent.summary}</strong></p>
              <p>Start: {new Date(currentEvent.start).toLocaleString()}</p>
              <p>End: {new Date(currentEvent.end).toLocaleString()}</p>
              <p>{currentEvent.description}</p>
            </>
          ) : (
            <p>Es gibt aktuell keine Veranstaltung!</p>
          )}
        </div>
        <div className="info-container">
            <div className="opening-hours-container">
              <h2>Öffnungszeiten</h2>
              <p>Kommt uns gerne zu unseren Öffnungszeiten besuchen!</p>
              <p>Montag: 15 – 17 Uhr</p>
              <p>Dienstag: 17 – 19 Uhr</p>
              <p>Donnerstag: 13 – 15 Uhr</p>
              <p>Samstag: 13 – 15 Uhr</p>
            </div>
            <div className="qr-code-container">
              <h1>Bitte besucht unsere Website:</h1>
              <img className="qr-code" src="intakt-qr-code.png" alt="QR Code for https://intakt-magdeburg.de/" />
            </div>
          </div>
        </div>

        <div className="events">
          <h2>Zukünftige Veranstaltungen</h2>
          <div className="events-container">
            {futureEvents.length > 0 ? (
              futureEvents.map((event, index) => (
                <div key={index} className="event">
                  <p><strong>{event.summary}</strong></p>
                  <p>Start: {new Date(event.start).toLocaleString()}</p>
                  <p>End: {new Date(event.end).toLocaleString()}</p>
                  <p>{event.description}</p>
                </div>
              ))
            ) : (
              <p>Keine Zukünftige Veranstaltungen</p>
            )}
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;
