import { useState } from 'react'
import './App.css'

function App() {
    return (
        <>
            <video
                src="/background-loop.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="background-loop"
            />

            <div>
                <img
                    src="/lizdekintro.gif"
                    alt="lizdek_intro"
                    className="lizdek-gif"
                />

                <div>
                    <a href="https://open.spotify.com/artist/65Kq02oh0g3gRqfZ0fo8eG?nd=1&dlsi=b496799f29ff4521">RELEASES</a>
                    <a >SHOWS</a>
                    <a href="mailto:tiff@24-8.com">CONTACT</a>
                </div>
            </div>
        </>
    )
}

export default App
