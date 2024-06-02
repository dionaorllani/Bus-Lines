import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import useTokenRefresh from '../hooks/useTokenRefresh';

const EditAccount = ({ setOpenEditProfile }) => {
    useTokenRefresh();

    const [userData, setUserData] = useState({});
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [passwordValidationError, setPasswordValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken['http://schemas.yourapp.com/identity/claims/userid'];

            const response = await axios.get(`https://localhost:7264/User/${userId}`);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const updateUserData = async (updatedUserData) => {
        try {
            const token = localStorage.getItem('token');
            const decodedToken = jwtDecode(token);
            const userId = decodedToken['http://schemas.yourapp.com/identity/claims/userid'];

            await axios.put(`https://localhost:7264/User/${userId}`, updatedUserData);
            fetchUserData();
            setSuccessMessage("Password updated successfully");
            setErrorMessage('');
            setTimeout(() => {
                setOpenEditProfile(false);
            }, 2000);
        } catch (error) {
            setErrorMessage("Error updating user data");
            setSuccessMessage('');
            console.error("Error updating user data:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [id]: value,
        }));
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        const newPassword = event.target.createpassword.value;

        if (newPassword !== repeatPassword) {
            setPasswordMismatch(true);
            return;
        }
        if (newPassword && !validatePassword(newPassword)) {
            setPasswordValidationError("Password must contain an uppercase letter, a number, a symbol, and be at least 8 characters long.");
            return;
        }
        setPasswordMismatch(false);
        setPasswordValidationError('');

        const updatedUserData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            ...(newPassword && { password: newPassword }),
        };

        await updateUserData(updatedUserData);
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="p-16 pb-6 bg-white shadow-xl rounded-lg">
                <div className="mb-6 w-[280px] md:w-[400px] lg:w-[550px]">
                    <input
                        className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out"
                        type="text"
                        id="firstName"
                        placeholder="First Name"
                        value={userData.firstName || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out"
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        value={userData.lastName || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out"
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={userData.email || ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out"
                        type="password"
                        id="createpassword"
                        placeholder="Create Password"
                    />
                </div>
                <div className="mb-6">
                    <input
                        className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out"
                        type="password"
                        id="repeatpassword"
                        placeholder="Repeat Password"
                        onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                    {passwordMismatch && <p className="text-red-500 text-sm">Passwords do not match.</p>}
                    {passwordValidationError && <p className="text-red-500 text-sm">{passwordValidationError}</p>}
                    {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </div>
                <div className="mb-6 flex justify-between text-black font-semibold">
                    <button className="hover:text-orange-400" type="button" onClick={() => setOpenEditProfile(false)}>Cancel</button>
                    <button className="hover:text-orange-400" type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EditAccount;
