import NavBar from "../components/NavBar"
import TravelTo from "../components/TravelTo";
import Search from '../components/Search';
import Video from "../components/Video"
import Footer from "../components/Footer"
import Chat from "../components/Chat";
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate = useNavigate();

    const handleFormSubmit = (searchData) => {
        navigate('/lines', { state: searchData });
    };

    return (
        <>
            <NavBar />
            <Search onSubmit={handleFormSubmit} initialSearchData={{}} />
            <TravelTo />
            <Chat />
            <Video />
            <Footer />
        </>
    );
};

export default Home;
