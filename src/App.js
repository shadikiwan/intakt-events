import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

function createBubble() {
    const bubble = document.createElement('div');
    const size = Math.random() * 100 + 50;  // Random size between 50 and 150
    const position = Math.random() * 100;   // Random position on the x-axis
    const animationDuration = Math.random() * 10 + 5;  // Random animation duration between 5 and 15 seconds

    bubble.classList.add('bubble');
    bubble.classList.add(getRandomColorClass());
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.right = `${position}vw`;
    bubble.style.animationDuration = `${animationDuration}s`;

    document.body.appendChild(bubble);

    setTimeout(() => {
        document.body.removeChild(bubble);
    }, animationDuration * 1000);
}

function getRandomColorClass() {
    const colors = ['bubble-yellow', 'bubble-light-yellow', 'bubble-orange'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function App() {
    const [currentEvent, setCurrentEvent] = useState(null);
    const [futureEvents, setFutureEvents] = useState([]);

    useEffect(() => {
        // Fetch events data from your backend
        fetch('http://localhost:4000/')
            .then(response => response.json())
            .then(data => {
                setCurrentEvent(data.currentEvent);
                setFutureEvents(data.futureEvents.concat(data.futureEvents)); // Duplicate the events for smooth looping
                startAutoScroll();
            })
            .catch(error => console.error('Error fetching events:', error));

        // Create bubbles at intervals
        const bubbleInterval = setInterval(createBubble, 1000);
        return () => clearInterval(bubbleInterval);
    }, []);

    const startAutoScroll = () => {
        const container = document.querySelector('.events-container');
        let scrollStep = 1;
        let frameCount = 0;
        let framesPerScroll = 5;

        const scroll = () => {
            frameCount++;
            if (frameCount >= framesPerScroll) {
                container.scrollTop += scrollStep;
                frameCount = 0;
            }

            if (container.scrollTop >= container.scrollHeight / 2) {
                container.scrollTop = 0;
            }

            requestAnimationFrame(scroll);
        };

        requestAnimationFrame(scroll);
    };

    const getBackgroundColorClass = (index) => {
        return index % 2 === 0 ? 'bg-color1' : 'bg-color2';
    };

    return (
        <div className="App">
            <div className="header-titles">
                <div className="site-logo">
                    <a href="https://intakt-magdeburg.de/" rel="home" className="custom-logo-link custom-logo">
                        <img loading="lazy" className="logo-regular" src="intakt-logo.png" width="349" height="262" alt="in:takt logo" />
                    </a>
                    <span className="screen-reader-text">in:takt</span>
                </div>
                <div className="header-logo-text">
                    <div className="site-title" aria-hidden="true">
                        <a href="https://intakt-magdeburg.de/" rel="home">in:takt</a>
                    </div>
                    <div className="site-description color-secondary">Der Freiraum für alle</div>
                </div>
            </div>
            <div className="container">
                <div className="left-column">
                    {currentEvent && (
                        <>
                            <h2>Aktuelle Veranstaltung</h2>
                            <div className="current-event event bg-color2 p-3 mb-2 text-start text-dark">
                                <p><strong>{currentEvent.summary}</strong></p>
                                <p>Start: {new Date(currentEvent.start).toLocaleString()}</p>
                                <p>End: {new Date(currentEvent.end).toLocaleString()}</p>
                                <p>{currentEvent.description}</p>
                            </div>
                        </>
                    )}
                    <div className="info-container">
                        <div className="opening-hours-container">
                            <h2>Öffnungszeiten</h2>
                            <div className="opening-hours">
                                <p>MO: 13:00 – 15:00 Uhr</p>
                                <p>DIE: 17:00 – 19:00 Uhr</p>
                                <p>DO: 15:00 – 17:00 Uhr</p>
                            </div>
                        </div>
                        <div className="qr-code-container">
                            <div>
                                <h2>Besucht unsere Website:</h2>
                                <h5>www.intakt-magdeburg.de</h5>
                                <img className="qr-code" src="intakt_website.png" alt="QR Code for https://intakt-magdeburg.de/" />
                            </div>
                            <div>
                                <h2>Besucht uns auf Instagram:</h2>
                                <h5>@intakt_magdeburg</h5>
                                <img className="qr-code" src="intakt_instagram.png" alt="QR Code for https://www.instagram.com/intakt_magdeburg/" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="events">
                    <h2 className="text-center">Zukünftige Veranstaltungen</h2>
                    <div className="events-container">
                        {futureEvents.map((event, index) => (
                            <div key={index} className={`event ${getBackgroundColorClass(index)} p-3 mb-2 text-start text-dark`}>
                                <p><strong>{event.summary}</strong></p>
                                <p>Start: {new Date(event.start).toLocaleString()}</p>
                                <p>End: {new Date(event.end).toLocaleString()}</p>
                                <p>{event.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
