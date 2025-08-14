import React from 'react';
import { ReleaseLink } from '../../types/release';
import '../../styles/PlatformLink.css';

interface PlatformLinkProps {
    link: ReleaseLink;
}

const PlatformLink: React.FC<PlatformLinkProps> = ({ link }) => {
    const getPlatformName = (platform: string) => {
        switch (platform) {
            case 'spotify':
                return 'Spotify';
            case 'apple_music':
                return 'Apple Music';
            case 'youtube':
                return 'YouTube';
            case 'soundcloud':
                return 'SoundCloud';
            case 'free_download':
                return 'Free Download';
            default:
                return platform;
        }
    };

    const getActionText = (platform: string) => {
        return platform === 'free_download' ? 'Download' : 'Play';
    };

    return (
        <div className="platform-link">
            <span className="platform-name">{getPlatformName(link.platform)}</span>
            <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="platform-action"
            >
                {getActionText(link.platform)}
            </a>
        </div>
    );
};

export default PlatformLink; 