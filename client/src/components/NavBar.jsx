import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.nameid;
                const userRole = decodedToken.role;
                setIsLoggedIn(!!userId); // Set isLoggedIn to true if userId exists
                setUserRole(userRole);
            } catch (error) {
                console.error("Failed to decode token:", error);
                // Handle invalid token case, if needed
                setIsLoggedIn(false);
                setUserRole(null);
            }
        }
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="flex flex-row items-center py-5 px-20 justify-between w-full">
            <Link to="../">
                <div className="flex items-center">
                    <h1 className="text-4xl ml-1 font-thin flex text-offBlack font-sans">Bus <span className="text-orange-400">Lines</span></h1>
                </div>
            </Link>
            <div className="flex items-center text-offBlack">
                {userRole === "Admin" && (
                    <Link to="/admin" className="mr-4 text-medium">Admin Panel</Link>
                )}
                {isLoggedIn && userRole !== "User" && (
                    <span className="mr-4">|</span>
                )}
                {isLoggedIn && (
                    <Link to="../profile" className="mr-4 text-medium">Profili</Link>
                )}
                {isLoggedIn && (
                    <span className="mr-4">|</span>
                )}
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="mr-4 text-medium">Dil</button>
                ) : (
                    <Link to="../authentication" className="mr-4 text-medium">Ky&ccedil;u</Link>
                )}
            </div>
        </nav>
    );
};

export default NavBar;