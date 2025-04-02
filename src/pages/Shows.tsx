import ShowCard from '../components/ShowCard';
import '../styles/Shows.css';

function Shows() {
    return (
        <>
            <img
                src="/background-loop.gif"
                className="background_loop"
            />

            <div className="shows-page">
                    <div className="shows-list">
                        {ShowCard(
                            "THE LAVA PIT",
                            "VENUE TBA",
                            "VANCOUVER",
                            "BC",
                            "https://laylo.com/laylo-cu0flnf/Ydyvzh17",
                            "APRIL 18 2025"
                        )}
                    </div>
            </div>
        </>
    );
};

export default Shows;