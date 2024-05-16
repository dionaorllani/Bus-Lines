import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from "../../../components/NavBar";

const LineCreate = () => {
    const [startCityName, setStartCityName] = useState('');
    const [destinationCityName, setDestinationCityName] = useState('');
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
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

    const handleStartCityNameChange = (event) => {
        setStartCityName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleDestinationCityNameChange = (event) => {
        setDestinationCityName(event.target.value);
        setError('');
        setSuccess('');
    };

const handleSubmit = async (event) => {
    event.preventDefault();
    if (!startCityName.trim() || !destinationCityName.trim()) {
        setError('Please enter both start and destination city names.');
        return;
    }
    
    try {
        // Check if the bus line already exists in the database
        const response = await axios.get(`https://localhost:7264/BusLine?startCityName=${startCityName}&destinationCityName=${destinationCityName}`);
        
        // If the response has data, it means the bus line already exists
        if (response.data.length > 0) {
            setError('Bus Line with the same start and destination city already exists.');
            return;
        }

        // If the response is empty, it means the bus line doesn't exist, so we can proceed to add it
        const addResponse = await axios.post('https://localhost:7264/BusLine', {
            startCityName: startCityName,
            destinationCityName: destinationCityName
        });

        setSuccess(`Bus line from "${addResponse.data.startCity.name}" to "${addResponse.data.destinationCity.name}" added successfully.`);
        setStartCityName('');
        setDestinationCityName('');
        setError('');
    } catch (error) {
        setError('Error adding bus line. Please try again.');
        console.error('Error adding bus line:', error);
    }
};

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Add Bus Line</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="startCityName" className="block text-gray-700 text-sm font-bold mb-2">Start City Name:</label>
                            <select
                                id="startCityName"
                                value={startCityName}
                                onChange={handleStartCityNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select start city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="destinationCityName" className="block text-gray-700 text-sm font-bold mb-2">Destination City Name:</label>
                            <select
                                id="destinationCityName"
                                value={destinationCityName}
                                onChange={handleDestinationCityNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select destination city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Add Bus Line
                        </button>
                        <Link
                            to="/admin/lines"
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

export default LineCreate;
