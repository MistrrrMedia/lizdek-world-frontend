import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/AdminCreateShow.css';

interface CreateShowForm {
    venue: string;
    city: string;
    state_province: string;
    country: string;
    ticket_link?: string;
    show_date: string;
}

const CreateShow: React.FC = () => {
    const [formData, setFormData] = useState<CreateShowForm>({
        venue: '',
        city: '',
        state_province: '',
        country: '',
        ticket_link: '',
        show_date: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
            await api.post('/shows', formData);
            navigate('/shows');
        } catch (err: any) {
            console.error('Create show error:', err);
            setError(err.response?.data?.error || 'FAILED TO CREATE SHOW');
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-create-show-container">
            <div className="admin-create-show-content">
                <div className="admin-create-show-form-container">
                    <h1 className="admin-create-show-title">CREATE SHOW</h1>
                    <p className="required-fields-note">* REQUIRED FIELD</p>
                    
                    <form onSubmit={handleSubmit} className="admin-create-show-form">
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
                            className="admin-create-show-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'CREATING...' : 'CREATE SHOW'}
                        </button>
                        
                        {error && (
                            <div className="admin-error">
                                {error}
                            </div>
                        )}
                    </form>
                    
                    <div className="admin-create-show-footer">
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

export default CreateShow;
