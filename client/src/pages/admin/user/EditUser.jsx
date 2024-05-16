import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import NavBar from "../../../components/NavBar";

const EditUser = () => {
    const { id } = useParams();
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 0 // Default role is 0 for 'user'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/User/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const updateUser = async () => {
        try {
            const response = await axios.put(`https://localhost:7264/User/${id}`, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccess(`User "${response.data.email}" updated successfully.`);
        } catch (error) {
            console.error('Error updating user:', error);
            setError("An error occurred while updating user. Please try again later.");
        }
    };

    const handleChange = (e) => {
        if (e.target.name === 'role') {
            setUser({ ...user, role: parseInt(e.target.value) }); // Convert value to integer
        } else {
            setUser({ ...user, [e.target.name]: e.target.value });
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateUser} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit User</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={user.firstName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={user.lastName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={user.password}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                            <select
                                id="role"
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value={0}>User</option>
                                <option value={1}>Admin</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Update
                        </button>
                        <Link
                            to="/admin/users"
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

export default EditUser;
