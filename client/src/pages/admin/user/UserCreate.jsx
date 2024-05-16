import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from "../../../components/NavBar";

const UserCreate = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [role, setRole] = useState(0); // Default role is 0 for 'user'
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const checkExistingEmail = async (email) => {
        try {
            const response = await axios.get(`https://localhost:7264/User?email=${email}`);
            if (response.data && response.data.length > 0) {
                return true; // Email exists
            } else {
                return false; // Email doesn't exist
            }
        } catch (error) {
            console.error(error);
            return false; // Assume email doesn't exist on error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for blank fields
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !createPassword.trim() || !repeatPassword.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        if (createPassword !== repeatPassword) {
            setError("Passwords do not match");
            return; // Prevent further execution if passwords don't match
        }
        const emailExists = await checkExistingEmail(email);
        if (emailExists) {
            setError("Email already exists, you can try login with this email.");
            return;
        }
        try {
            const response = await axios.post('https://localhost:7264/User', {
                firstName,
                lastName,
                email,
                password: createPassword,
                role // Include role in the request body
            });
            setSuccess(`User "${response.data.email}" added successfully.`);
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setCreatePassword('');
            setRepeatPassword('');
            setRole(0); // Reset role to default after submission
            setError('');
        } catch (error) {
            console.error(error);
            setError("An error occurred while adding user. Please try again later.");
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Add User</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="createPassword" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                            <input
                                type="password"
                                id="createPassword"
                                value={createPassword}
                                onChange={(e) => setCreatePassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter password"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="repeatPassword" className="block text-gray-700 text-sm font-bold mb-2">Repeat Password:</label>
                            <input
                                type="password"
                                id="repeatPassword"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Repeat password"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(Number(e.target.value))}
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
                            Add User
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

export default UserCreate;
