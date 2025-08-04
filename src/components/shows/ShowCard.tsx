import { Show } from '../../types/show';
import '../../styles/ShowCard.css';

interface ShowCardProps {
    show: Show;
}

const ShowCard: React.FC<ShowCardProps> = ({ show }) => {
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
            <h1 className="show-title">{show.venue}</h1>
            <h2 className="show-location">{show.city}, {show.state_province}</h2>
            <h3 className="show-date">{formatDate(show.show_date)}</h3>
            {show.ticket_link && (
                <a 
                    href={show.ticket_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ticket-link"
                >
                    TICKETS
                </a>
            )}
        </div>
    );
};

export default ShowCard; 