import React from 'react';
import ShowCard from '../components/shows/ShowCard';
import { useShows } from '../hooks/useShows';
import '../styles/Shows.css';

const Shows: React.FC = () => {
    const { data: shows, isLoading, error } = useShows();

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
                className="background_loop"
                alt="Background"
            />

            <div className="shows-page">
                <div className="shows-list">
                    {shows && shows.length > 0 ? (
                        shows.map((show) => (
                            <ShowCard key={show.id} show={show} />
                        ))
                    ) : (
                        <div className="no-shows">
                            <h2>No upcoming shows</h2>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Shows;