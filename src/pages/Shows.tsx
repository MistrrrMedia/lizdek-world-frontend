import React, { useState, useMemo } from 'react';
import ShowCard from '../components/shows/ShowCard';
import { useShows } from '../hooks/useShows';
import '../styles/Shows.css';

const Shows: React.FC = () => {
    const { data: shows, isLoading, error } = useShows();
    const [displayCount, setDisplayCount] = useState(5);

    const sortedShows = useMemo(() => {
        if (!shows) return [];
        return [...shows].sort((a, b) => new Date(b.show_date).getTime() - new Date(a.show_date).getTime());
    }, [shows]);

    const displayedShows = sortedShows.slice(0, displayCount);
    const hasMoreShows = sortedShows.length > displayCount;

    if (isLoading) {
        return <div>Loading shows...</div>;
    }

    if (error) {
        return <div>Error loading shows</div>;
    }

    return (
        <>
            <img
                src="/background-loop.gif"
                className="background_loop shows-background"
                alt="Background"
            />

            <div className="shows-page">
                <h1>SHOWS</h1>
                <div className="shows-list">
                    {displayedShows.length > 0 ? (
                        displayedShows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))
                    ) : (
                        <div className="no-shows">
                            <h2>No upcoming shows</h2>
                        </div>
                    )}
                </div>
                
                {hasMoreShows && (
                    <div className="load-more-container">
                        <button 
                            onClick={() => setDisplayCount(prev => Math.min(prev + 5, sortedShows.length))}
                            className="load-more-button"
                        >
                            LOAD MORE
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Shows;