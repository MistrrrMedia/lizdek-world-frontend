import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/AdminEditRelease.css';

interface EditReleaseForm {
    title: string;
    url_title: string;
    soundcloud_url: string;
    release_date: string;
    collaborators?: string;
    links: Array<{
        platform: 'spotify' | 'soundcloud' | 'apple_music' | 'youtube' | 'free_download';
        url: string;
    }>;
}

const EditRelease: React.FC = () => {
    const { urlTitle } = useParams();
    const [formData, setFormData] = useState<EditReleaseForm>({
        title: '',
        url_title: '',
        soundcloud_url: '',
        release_date: '',
        collaborators: '',
        links: []
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const navigate = useNavigate();

    // Fetch release data on component mount
    useEffect(() => {
        const fetchRelease = async () => {
            try {
                const response = await api.get(`/releases/${urlTitle}`);
                const release = response.data;
                
                setFormData({
                    title: release.title,
                    url_title: release.url_title,
                    soundcloud_url: release.soundcloud_url,
                    release_date: release.release_date.split('T')[0], // Format for date input
                    collaborators: release.collaborators || '',
                    links: release.links || []
                });
            } catch (err: any) {
                console.error('Error fetching release:', err);
                setError('FAILED TO LOAD RELEASE');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (urlTitle) {
            fetchRelease();
        }
    }, [urlTitle]);

    const generateUrlTitle = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove unsupported characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = {
                ...prev,
                [name]: value
            };
            
            // Auto-generate URL title when title changes
            if (name === 'title') {
                newData.url_title = generateUrlTitle(value);
            }
            
            return newData;
        });
    };

    const addLink = () => {
        setFormData(prev => {
            // Find the first available platform
            const usedPlatforms = prev.links.map(link => link.platform);
            const allPlatforms: Array<'spotify' | 'apple_music' | 'youtube' | 'free_download'> = 
                ['spotify', 'apple_music', 'youtube', 'free_download'];
            const availablePlatform = allPlatforms.find(platform => !usedPlatforms.includes(platform));
            
            if (!availablePlatform) {
                return prev; // No more platforms available
            }
            
            return {
                ...prev,
                links: [...prev.links, { platform: availablePlatform, url: '' }]
            };
        });
    };

    const removeLink = (index: number) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.filter((_, i) => i !== index)
        }));
    };

    const updateLink = (index: number, field: 'platform' | 'url', value: string) => {
        setFormData(prev => ({
            ...prev,
            links: prev.links.map((link, i) => 
                i === index ? { ...link, [field]: value } : link
            )
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.put(`/edit/releases/${urlTitle}`, formData);
            navigate('/releases');
        } catch (err: any) {
            console.error('Update release error:', err);
            setError(err.response?.data?.error || 'FAILED TO UPDATE RELEASE');
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return <div className="loading-state">LOADING RELEASE...</div>;
    }

    return (
        <div className="admin-edit-release-container">
            <div className="admin-edit-release-content">
                <div className="admin-edit-release-form-container">
                    <h1 className="admin-edit-release-title">EDIT RELEASE</h1>
                    <p className="required-fields-note">* REQUIRED FIELD</p>
                    
                    <form onSubmit={handleSubmit} className="admin-edit-release-form">
                        <div className="form-group">
                            <label htmlFor="title">TITLE *</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="admin-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="url_title">URL TITLE *</label>
                            <input
                                id="url_title"
                                name="url_title"
                                type="text"
                                value={formData.url_title}
                                onChange={handleInputChange}
                                className="admin-input"
                                placeholder="lowercase-with-hyphens"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="soundcloud_url">SOUNDCLOUD URL *</label>
                            <input
                                id="soundcloud_url"
                                name="soundcloud_url"
                                type="url"
                                value={formData.soundcloud_url}
                                onChange={handleInputChange}
                                className="admin-input"
                                placeholder="https://soundcloud.com/..."
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="release_date">RELEASE DATE *</label>
                            <input
                                id="release_date"
                                name="release_date"
                                type="date"
                                value={formData.release_date}
                                onChange={handleInputChange}
                                className="admin-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="collaborators">COLLABORATORS</label>
                            <input
                                id="collaborators"
                                name="collaborators"
                                type="text"
                                value={formData.collaborators}
                                onChange={handleInputChange}
                                className="admin-input"
                                placeholder="Artist 1, Artist 2"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>ADDITIONAL LINKS</label>
                            {formData.links.map((link, index) => (
                                <div key={index} className="link-row">
                                    <select
                                        value={link.platform}
                                        onChange={(e) => updateLink(index, 'platform', e.target.value)}
                                        className="admin-input platform-select"
                                    >
                                        {['spotify', 'apple_music', 'youtube', 'free_download'].map(platform => {
                                            const isUsed = formData.links.some((l, i) => i !== index && l.platform === platform);
                                            return (
                                                <option 
                                                    key={platform} 
                                                    value={platform}
                                                    disabled={isUsed}
                                                >
                                                    {platform === 'apple_music' ? 'Apple Music' : 
                                                     platform === 'free_download' ? 'Free Download' : 
                                                     platform.charAt(0).toUpperCase() + platform.slice(1)}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => updateLink(index, 'url', e.target.value)}
                                        className="admin-input link-url"
                                        placeholder="https://..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeLink(index)}
                                        className="remove-link-button"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addLink}
                                className="add-link-button"
                                disabled={formData.links.length >= 4}
                            >
                                + ADD LINK
                            </button>
                        </div>
                        
                        <button 
                            type="submit" 
                            className="admin-edit-release-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'UPDATING...' : 'UPDATE RELEASE'}
                        </button>
                        
                        {error && (
                            <div className="admin-error">
                                {error}
                            </div>
                        )}
                    </form>
                    
                    <div className="admin-edit-release-footer">
                        <button 
                            onClick={() => navigate('/releases')}
                            className="back-to-admin-releases"
                        >
                            ← BACK TO RELEASES
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditRelease; 