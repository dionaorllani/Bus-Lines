import NavBar from "../components/NavBar"
import TravelTo from "../components/TravelTo";
import Search from '../components/Search';
import Video from "../components/Video"
import Footer from "../components/Footer"
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
            <Video />
            <Footer />
        </>
    );
};

export default Home;
