import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from "../../../components/NavBar";
import { Link } from 'react-router-dom';

const StopCreate = () => {
    const [stationName, setStationName] = useState('');
    const [cityName, setCityName] = useState('');
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Fetch the list of cities when the component mounts
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await axios.get('https://localhost:7264/city');
            const sortedCities = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setCities(sortedCities);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleStationNameChange = (event) => {
        setStationName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleCityNameChange = (event) => {
        setCityName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stationName.trim() || !cityName.trim()) {
            setError('Please enter both station name and city.');
            return;
        }
        try {
            const response = await axios.post('https://localhost:7264/Stop', {
                stationName: stationName,
                cityName: cityName
            });
            setSuccess(`Stop "${response.data.stationName}" in "${response.data.cityName}" added successfully.`);
            setStationName('');
            setCityName('');
            setError('');
        } catch (error) {
            setError('Error adding stop. Please try again.');
            console.error('Error adding stop:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Add Stop</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="stationName" className="block text-gray-700 text-sm font-bold mb-2">Station Name:</label>
                            <input
                                type="text"
                                id="stationName"
                                value={stationName}
                                onChange={handleStationNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter station name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="cityName" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                            <select
                                id="cityName"
                                value={cityName}
                                onChange={handleCityNameChange}
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
                            Add Stop
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

export default StopCreate;
