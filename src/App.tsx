import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Shows from './pages/Shows.tsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/shows" element={<Shows/>} />
            </Routes>
        </Router>
    );
}

export default App;