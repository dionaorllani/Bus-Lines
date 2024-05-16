import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Import Axios
import NavBar from "../../../components/NavBar"

const EditCity = () => {
    const { id } = useParams();
    const [city, setCity] = useState({ name: '' });

    useEffect(() => {
        fetchCity();
    }, []);

    const fetchCity = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/City/${id}`);
            setCity(response.data);
        } catch (error) {
            console.error('Error fetching city:', error);
        }
    };

    const updateCity = async () => {
        try {
            const response = await axios.put(`https://localhost:7264/City/${id}`, city, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Error updating city:', error);
        }
    };

    const handleChange = (e) => {
        setCity({ ...city, [e.target.name]: e.target.value });
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateCity} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit City</p>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">City Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={city.name}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter city name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Update
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

export default EditCity;
