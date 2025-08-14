import React from 'react';
import { Link } from 'react-router-dom';
import { useUpcomingShows } from '../hooks/useShows';
import '../styles/Home.css';

const Home: React.FC = () => {
    const { data: upcomingShowsData } = useUpcomingShows();
    const hasUpcomingShows = upcomingShowsData?.hasUpcomingShows || false;

    return (
        <>
            <img
                src="/background-loop.gif"
                className="background_loop"
                alt="Background"
            />

            <div className="content_container">
                <img
                    src="/lizdekintro.gif"
                    alt="lizdek_intro"
                    className="lizdek_gif"
                />

                <div className="navigation-links">
                    <Link to="/releases">RELEASES</Link>
                    {hasUpcomingShows ? (
                        <Link to="/shows">SHOWS</Link>
                    ) : (
                        <span className="crossed-out">SHOWS</span>
                    )}
                    <a href="mailto:tiff@24-8.com">CONTACT</a>
                </div>
            </div>

            <div className="social_container">
                <a className="social_link" href="https://instagram.com/lizdekmusic" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.svg" alt="instagram" className="social_icon" />
                </a>

                <a className="social_link" href="https://tiktok.com/@lizdekmusic" target="_blank" rel="noopener noreferrer">
                    <img src="/tik-tok.svg" alt="tiktok" className="social_icon" />
                </a>

                <a className="social_link" href="https://twitter.com/lizdekmusic" target="_blank" rel="noopener noreferrer">
                    <img src="/twitter.svg" alt="twitter" className="social_icon" />
                </a>
            </div>


        </>
    );
};

export default Home;
