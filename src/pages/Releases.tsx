import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useReleases } from '../hooks/useReleases';
import { getAlbumArtURL } from '../services/artworkRetriever';
import '../styles/Releases.css';

const Releases: React.FC = () => {
    const { data: releases, isLoading, error } = useReleases();
    const [artworkUrls, setArtworkUrls] = useState<Record<number, string>>({});

    // Fetch artwork for each release
    useEffect(() => {
        if (releases) {
            releases.forEach(async (release) => {
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
    }, [releases, artworkUrls]);

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
                
                {releases && releases.length > 0 ? (
                    <div className="releases-list">
                        {releases.map((release) => (
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
                                <a href={release.soundcloud_url} target="_blank" rel="noopener noreferrer" className="view-release">
                                    →
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-releases">
                        <p>No releases available.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Releases; 