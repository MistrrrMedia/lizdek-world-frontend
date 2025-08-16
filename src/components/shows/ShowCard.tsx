import { Show } from '../../types/show';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import '../../styles/ShowCard.css';

interface ShowCardProps {
    show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
    const { user } = useAuth();
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).toUpperCase();
    };

    return (
        <div className="show-card">
            <div className="show-info">
                <h2 className="show-title">{show.venue.toUpperCase()}</h2>
                <p className="show-location">{show.city}, {show.state_province}, {show.country}</p>
                <p className="show-date">{formatDate(show.show_date)}</p>
            </div>
            <div className="show-actions">
                {user && (
                    <Link to={`/admin/edit/show/${show.id}`} className="edit-show">
                        ✎
                    </Link>
                )}
                {show.ticket_link && show.ticket_link.trim() !== '' && (
                    <a 
                        href={show.ticket_link} 
                        className="view-show"
                    >
                        →
                    </a>
                )}
            </div>
        </div>
    );
};

export default ShowCard; 