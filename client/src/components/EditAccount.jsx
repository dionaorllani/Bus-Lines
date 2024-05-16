import axios from "axios";
import { useEffect, useState } from "react";

const EditAccount = ({ setOpenEditProfile }) => {
    const [userData, setUserData] = useState({});
    const [repeatPassword, setRepeatPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/User/${localStorage.getItem('userId')}`);
            setUserData(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    const updateUserData = async (updatedUserData) => {
        try {
            await axios.put(`https://localhost:7264/User/${localStorage.getItem('userId')}`, updatedUserData);
            fetchUserData();
            console.log("User data updated successfully");
            setOpenEditProfile(false); // Close the modal after successful update
        } catch (error) {
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (event.target.createpassword.value !== event.target.repeatpassword.value) {
            setPasswordMismatch(true);
            return;
        }
        setPasswordMismatch(false);
        const updatedUserData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: event.target.createpassword.value,
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
                </div>
                <div className="mb-6 flex justify-between text-black  font-semibold">
                    <button className="hover:text-orange-400" type="button" onClick={() => setOpenEditProfile(false)}>Cancel</button>
                    <button className="hover:text-orange-400" type="submit">Save</button>
                </div>
            </form>
        </div>
    );
};

export default EditAccount;