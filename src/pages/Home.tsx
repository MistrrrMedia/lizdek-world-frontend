import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    return (
        <>
            <img
                src="/background-loop.gif"
                className="background_loop"
            />

            <div className="content_container">
                <img
                    src="/lizdekintro.gif"
                    alt="lizdek_intro"
                    className="lizdek_gif"
                />

                <div>
                    <a href="https://open.spotify.com/artist/65Kq02oh0g3gRqfZ0fo8eG?nd=1&dlsi=b496799f29ff4521">RELEASES</a>
                    <a onClick={() => navigate('/shows')}>SHOWS</a>
                    <a href="mailto:tiff@24-8.com">CONTACT</a>
                </div>
            </div>

            <div className="social_container">
                <a className="social_link" href="https://instagram.com/lizdekmusic" target="_blank" rel="noopener noreferrer">
                    <img src="/instagram.svg" alt="instagram" className="social_icon" />
                </a>

                <a className="social_link" href="https://tiktok.com/@lizdekmusic" target="_blank" rel="noopener noreferrer">
                    <img src="/tik-tok.svg" alt="tiktok" className="social_icon" />
                </a>

                <a className="social_link" href="https://twitter.com/lizdekmusic" target="_blank" rel="noopener noreferrer">
                    <img src="/twitter.svg" alt="twitter" className="social_icon" />
                </a>
            </div>
        </>
    );
}

export default Home;
