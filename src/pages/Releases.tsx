import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useReleases } from '../hooks/useReleases';
import { useAuth } from '../context/AuthContext';
import { getAlbumArtURL } from '../services/artworkRetriever';
import '../styles/Releases.css';

const Releases: React.FC = () => {
    const { data: releases, isLoading, error } = useReleases();
    const { user } = useAuth();
    const [artworkUrls, setArtworkUrls] = useState<Record<number, string>>({});
    const [displayCount, setDisplayCount] = useState(5);

    const sortedReleases = useMemo(() => {
        if (!releases) return [];
        return [...releases].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    }, [releases]);

    const displayedReleases = sortedReleases.slice(0, displayCount);
    const hasMoreReleases = sortedReleases.length > displayCount;

    // Fetch artwork for each release
    useEffect(() => {
        if (displayedReleases) {
            displayedReleases.forEach(async (release) => {
                if (!artworkUrls[release.id] && release.soundcloud_url) {
                    try {
                        const artworkUrl = await getAlbumArtURL(release.soundcloud_url);
                        setArtworkUrls(prev => ({
                            ...prev,
                            [release.id]: artworkUrl
                        }));
                    } catch (error) {
                        console.error(`Failed to fetch artwork for release ${release.id}:`, error);
                    }
                }
            });
        }
    }, [displayedReleases, artworkUrls]);

    if (isLoading) {
        return <div>Loading releases...</div>;
    }

    if (error) {
        return <div>Error loading releases</div>;
    }

    return (
        <>
            <img
                src="/background-loop.gif"
                className="background_loop releases-background"
                alt="Background"
            />

            <div className="releases-page">
                <h1>RELEASES</h1>
                
                {displayedReleases.length > 0 ? (
                    <div className="releases-list">
                        {displayedReleases.map((release) => (
                            <div 
                                key={release.id} 
                                className="release-card"
                                style={artworkUrls[release.id] ? {
                                    backgroundImage: `url(${artworkUrls[release.id]})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                } : {}}
                            >
                                <div className="release-info">
                                    <h2>{release.title.toUpperCase()}</h2>
                                    {release.collaborators && (
                                        <p className="collaborators">COLLABORATORS: {release.collaborators}</p>
                                    )}
                                    <p className="release-date">
                                        {new Date(release.release_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }).toUpperCase()}
                                    </p>
                                </div>
                                <div className="release-actions">
                                    {user && (
                                        <Link to={`/admin/edit/${release.url_title}`} className="edit-release">
                                            ✎
                                        </Link>
                                    )}
                                    <Link to={`/releases/${release.url_title}`} className="view-release">
                                        →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-releases">
                        <p>No releases available.</p>
                    </div>
                )}
                
                {hasMoreReleases && (
                    <div className="load-more-container">
                        <button 
                            onClick={() => setDisplayCount(prev => Math.min(prev + 5, sortedReleases.length))}
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

export default Releases; 