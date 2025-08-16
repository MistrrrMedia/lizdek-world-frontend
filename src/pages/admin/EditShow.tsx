import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/AdminEditShow.css';

interface EditShowForm {
    venue: string;
    city: string;
    state_province: string;
    country: string;
    ticket_link?: string;
    show_date: string;
}

const EditShow: React.FC = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState<EditShowForm>({
        venue: '',
        city: '',
        state_province: '',
        country: '',
        ticket_link: '',
        show_date: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const navigate = useNavigate();

    // Fetch show data on component mount
    useEffect(() => {
        const fetchShow = async () => {
            try {
                const response = await api.get(`/shows/${id}`);
                const show = response.data;
                
                setFormData({
                    venue: show.venue,
                    city: show.city,
                    state_province: show.state_province,
                    country: show.country,
                    ticket_link: show.ticket_link || '',
                    show_date: show.show_date.split('T')[0] + 'T' + show.show_date.split('T')[1].substring(0, 5) // Format for datetime-local
                });
            } catch (err: any) {
                console.error('Error fetching show:', err);
                setError('FAILED TO LOAD SHOW');
            } finally {
                setIsLoadingData(false);
            }
        };

        if (id) {
            fetchShow();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.put(`/shows/${id}`, formData);
            navigate('/shows');
        } catch (err: any) {
            console.error('Update show error:', err);
            setError(err.response?.data?.error || 'FAILED TO UPDATE SHOW');
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return <div className="loading-state">LOADING SHOW...</div>;
    }

    return (
        <div className="admin-edit-show-container">
            <div className="admin-edit-show-content">
                <div className="admin-edit-show-form-container">
                    <h1 className="admin-edit-show-title">EDIT SHOW</h1>
                    <p className="required-fields-note">* REQUIRED FIELD</p>
                    
                    <form onSubmit={handleSubmit} className="admin-edit-show-form">
                        <div className="form-group">
                            <label htmlFor="venue">VENUE *</label>
                            <input
                                id="venue"
                                name="venue"
                                type="text"
                                value={formData.venue}
                                onChange={handleInputChange}
                                className="admin-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="city">CITY *</label>
                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="admin-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="state_province">STATE/PROVINCE *</label>
                            <input
                                id="state_province"
                                name="state_province"
                                type="text"
                                value={formData.state_province}
                                onChange={handleInputChange}
                                className="admin-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="country">COUNTRY *</label>
                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="admin-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="show_date">SHOW DATE *</label>
                            <input
                                id="show_date"
                                name="show_date"
                                type="datetime-local"
                                value={formData.show_date}
                                onChange={handleInputChange}
                                className="admin-input"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="ticket_link">TICKET LINK</label>
                            <input
                                id="ticket_link"
                                name="ticket_link"
                                type="url"
                                value={formData.ticket_link}
                                onChange={handleInputChange}
                                className="admin-input"
                                placeholder="https://..."
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="admin-edit-show-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'UPDATING...' : 'UPDATE SHOW'}
                        </button>
                        
                        {error && (
                            <div className="admin-error">
                                {error}
                            </div>
                        )}
                    </form>
                    
                    <div className="admin-edit-show-footer">
                        <button 
                            onClick={() => navigate('/admin')}
                            className="back-to-admin"
                        >
                            ← BACK TO ADMIN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditShow;
