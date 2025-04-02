import '../styles/ShowCard.css';

function ShowCard(
    title: string, 
    venue: string, 
    city: string, 
    province: string, 
    ticketLink: string, 
    date: string
) {
  return (
    <div className={`show-card`}>
      <h1>{title} @ {venue}</h1>
      <h2>{city}, {province}</h2>
      <h3>{date}</h3>
      {ticketLink && <a href={ticketLink} target="_blank" rel="noopener noreferrer">TICKETS</a>}
    </div>
  );
};

export default ShowCard;
