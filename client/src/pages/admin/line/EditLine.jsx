import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const EditLine = () => {
    const { id } = useParams();
    const [busLine, setBusLine] = useState(null);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchBusLine();
        fetchCities();
    }, []);

    const fetchBusLine = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/BusLine/${id}`);
            const { startCity, destinationCity } = response.data;
            setBusLine({
                startCityName: startCity.name,
                destinationCityName: destinationCity.name
            });
        } catch (error) {
            console.error('Error fetching bus line:', error);
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

    const updateBusLine = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        try {
            // Clear any existing error message
            setError('');

            // Check if the bus line already exists in the database
            const response = await axios.get(`https://localhost:7264/BusLine?startCityName=${busLine.startCityName}&destinationCityName=${busLine.destinationCityName}`);

            // If the response has data, it means the bus line already exists
            if (response.data.length > 0) {
                setError('Bus line with the same start and destination city already exists.');
                setSuccess('');
                return;
            }

            // If the response is empty, it means the bus line doesn't exist, so we can proceed to update it
            await axios.put(`https://localhost:7264/BusLine/${id}`, busLine, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // If the update is successful, set a success message
            setSuccess('Bus line updated successfully.');
        } catch (error) {
            setError('Error updating bus line. Please try again.');
            console.error('Error updating bus line:', error);
        }
    };


    const handleChange = (e) => {
        setBusLine({ ...busLine, [e.target.name]: e.target.value });
    };

    if (!busLine) {
        return null; // or loading indicator
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateBusLine} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Bus Line</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="startCityName" className="block text-gray-700 text-sm font-bold mb-2">Start City Name:</label>
                            <select
                                id="startCityName"
                                name="startCityName"
                                value={busLine.startCityName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>{city.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="destinationCityName" className="block text-gray-700 text-sm font-bold mb-2">Destination City Name:</label>
                            <select
                                id="destinationCityName"
                                name="destinationCityName"
                                value={busLine.destinationCityName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
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

export default EditLine;
