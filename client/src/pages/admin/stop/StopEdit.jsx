import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const EditStop = () => {
    const { id } = useParams();
    const [stop, setStop] = useState({ stationName: '', cityName: '' });
    const [cities, setCities] = useState([]);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchStop();
        fetchCities();
    }, []);

    const fetchStop = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/Stop/${id}`);
            setStop(response.data);
        } catch (error) {
            console.error('Error fetching stop:', error);
        }
    };

    const fetchCities = async () => {
        try {
            const response = await axios.get('https://localhost:7264/city');
            const sortedCities = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setCities(sortedCities);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const updateStop = async () => {
        try {
            await axios.put(`https://localhost:7264/Stop/${id}`, stop, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating stop:', error);
        }
    };

    const handleChange = (e) => {
        setStop({ ...stop, [e.target.name]: e.target.value });
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateStop} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Stop</p>
                        <div className="mb-4">
                            <label htmlFor="stationName" className="block text-gray-700 text-sm font-bold mb-2">Station Name:</label>
                            <input
                                type="text"
                                id="stationName"
                                name="stationName"
                                value={stop.stationName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter station name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="cityName" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                            <select
                                id="cityName"
                                name="cityName"
                                value={stop.cityName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select a city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Update
                        </button>
                        <Link
                            to="/admin/stops"
                            className="bg-gray-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-gray-400 hover:bg-gray-500 ml-2"
                        >
                            Back
                        </Link>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditStop;
