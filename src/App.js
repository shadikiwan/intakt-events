import React, { useEffect, useState, useRef } from 'react';
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
    const [videoList, setVideoList] = useState([]);
    const videoRef = useRef(null);
    const currentVideoIndex = useRef(0);

    useEffect(() => {
        // Fetch events data from your backend
        fetch('http://localhost:4000/')
            .then(response => response.json())
            .then(data => {
                /*const any = {
                    "summary": "Lesung Gedichte eines Leiharbeiters Kilian Lippold",
                    "start": "2024-07-06T16:00:00.000Z",
                    "end": "2024-07-06T17:00:00.000Z",
                    "description": "No description available"
                };
                setCurrentEvent(any);*/
                setCurrentEvent(data.currentEvent);
                setFutureEvents(data.futureEvents.concat(data.futureEvents)); // Duplicate the events for smooth looping
                startAutoScroll();
            })
            .catch(error => console.error('Error fetching events:', error));

        // Fetch video files from the server
        fetch('http://localhost:4000/api/videos')
            .then(response => response.json())
            .then(data => {
                setVideoList(data);
            })
            .catch(error => console.error('Error fetching videos:', error));

        // Create bubbles at intervals
        const bubbleInterval = setInterval(createBubble, 1000);
        return () => clearInterval(bubbleInterval);
    }, []);

    useEffect(() => {
        if (videoList.length > 0 && videoRef.current) {
            videoRef.current.src = `/videos/${videoList[currentVideoIndex.current]}`;
            videoRef.current.muted = true; // Mute the video
            videoRef.current.play();
        }
    }, [videoList]);

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

    const handleVideoEnded = () => {
        currentVideoIndex.current = (currentVideoIndex.current + 1) % videoList.length;
        videoRef.current.src = `/videos/${videoList[currentVideoIndex.current]}`;
        videoRef.current.play();
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
                <div className="left-info-column">
                    <div className="opening-hours-container">
                        <h2>Öffnungszeiten</h2>
                        <div className="opening-hours">
                            <h4>MO: 13:00 – 15:00 Uhr</h4>
                            <h4>DI: 17:00 – 19:00 Uhr</h4>
                            <h4>DO: 15:00 – 17:00 Uhr</h4>
                        </div>
                    </div>
                    <div className="qr-code">
                        <h4>www.intakt-magdeburg.de</h4>
                        <img className="qr-code" src="intakt_website.png" alt="QR Code for https://intakt-magdeburg.de/" />
                    </div>
                    <div className="qr-code">
                        <h4>@intakt_magdeburg</h4>
                        <img className="qr-code" src="intakt_instagram.png" alt="QR Code for https://www.instagram.com/intakt_magdeburg/" />
                    </div>
                </div>
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
                    <div className="video-container">
                            <div id="monitor">
                                <div id="monitorscreen">
                                    <video 
                                        controls 
                                        ref={videoRef}
                                        onEnded={handleVideoEnded}
                                        muted
                                        autoPlay
                                        className="video"
                                    >
                                        {videoList.length > 0 && (
                                            <source 
                                                src={`/videos/${videoList[currentVideoIndex.current]}`} 
                                                type="video/mp4" 
                                            />
                                        )}
                                    </video>
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
