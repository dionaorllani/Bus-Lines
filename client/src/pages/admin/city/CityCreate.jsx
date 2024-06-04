import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from "../../../components/NavBar"
import withAuthorization from '../../../HOC/withAuthorization';

const CityCreate = () => {

    const [cityName, setCityName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleCityNameChange = (event) => {
        setCityName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!cityName.trim()) {
            setError('Please enter a city name.');
            return;
        }
        try {
            await addCity(token);
        } catch (error) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const refreshResponse = await axios.post(
                        'https://localhost:7264/api/Token/refresh',
                        {
                            accessToken: token,
                            refreshToken: refreshToken
                        }
                    );
                    const newAccessToken = refreshResponse.data.token;
                    localStorage.setItem('token', newAccessToken);
                    // Retry adding the city with the new token
                    await addCity(newAccessToken);
                    console.log(45)
                } catch (refreshError) {
                    if (refreshError.response && refreshError.response.status === 400) {
                        window.location.href = '/authentication';
                    } else {
                        setError('Error refreshing token. Please try again.');
                        console.error('Error refreshing token:', refreshError);
                    }
                }
            } else {
                window.location.href = '/authentication';
            }
        }
    };

    const addCity = async (token) => {
        const response = await axios.post(
            'https://localhost:7264/City',
            {
                name: cityName
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        setSuccess(`City "${response.data.name}" added successfully.`);
     };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Add City</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="cityName" className="block text-gray-700 text-sm font-bold mb-2">City Name:</label>
                            <input
                                type="text"
                                id="cityName"
                                value={cityName}
                                onChange={handleCityNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter city name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Add City
                        </button>
                        <Link
                            to="/admin/cities"
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

export default withAuthorization(CityCreate, ["Admin"]);
