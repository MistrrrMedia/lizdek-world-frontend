import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useReleaseDetail } from '../hooks/useReleaseDetail';
import { useAuth } from '../context/AuthContext';
import { getAlbumArtURL } from '../services/artworkRetriever';
import '../styles/ReleaseDetail.css';

const ReleaseDetail: React.FC = () => {
    const { urlTitle } = useParams();
    const { data: release, isLoading, error } = useReleaseDetail(urlTitle);
    const { user } = useAuth();
    const [artworkUrl, setArtworkUrl] = useState<string>('');

    // Fetch artwork for background
    useEffect(() => {
        if (release?.soundcloud_url && !artworkUrl) {
            getAlbumArtURL(release.soundcloud_url)
                .then(url => setArtworkUrl(url))
                .catch(error => console.error('Failed to fetch artwork:', error));
        }
    }, [release, artworkUrl]);

    if (isLoading) {
        return <div className="loading-state">LOADING SONG DETAILS...</div>;
    }

    if (error || !release) {
        return (
            <div className="error-state">
                <h2>SONG NOT FOUND</h2>
                <p>THE SONG YOU ARE LOOKING FOR DOES NOT EXIST.</p>
                <Link to="/releases" className="back-link">← RELEASES</Link>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).toUpperCase();
    };

    return (
        <>
            {artworkUrl && (
                <img
                    src={artworkUrl}
                    className="background_loop release-detail-background"
                    alt="Background"
                />
            )}

            <div className="release-detail-page">
                <div className="release-detail-header">
                    <Link to="/releases" className="back-link">
                        ← RELEASES
                    </Link>
                    {user && (
                        <Link to={`/admin/edit/${release.url_title}`} className="edit-link">
                            ✎
                        </Link>
                    )}
                </div>
            
            <h1 className="release-title">
                {release.title}
            </h1>
            
            {release.collaborators && (
                <p className="release-collaborators">
                    COLLABORATORS: {release.collaborators}
                </p>
            )}
            
            <p className="release-date">
                RELEASED: {formatDate(release.release_date)}
            </p>
            
            <div className="streaming-links-section">
                {/* SoundCloud link - always available since it's required */}
                <a 
                    href={release.soundcloud_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="streaming-link"
                >
                    <img src="/soundcloud.png" alt="SoundCloud" className="streaming-icon" />
                </a>
                
                {/* Additional streaming links */}
                {release.links && release.links.map((link) => (
                    <a 
                        key={link.id}
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="streaming-link"
                    >
                        <img 
                            src={`/${link.platform}.png`} 
                            alt={link.platform} 
                            className="streaming-icon" 
                        />
                    </a>
                ))}
            </div>
        </div>
        </>
    );
};

export default ReleaseDetail; 