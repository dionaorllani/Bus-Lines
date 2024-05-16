import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        setIsLoggedIn(!!userId); // Set isLoggedIn to true if userId exists
        setUserRole(userRole);
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null); // Reset userRole to null
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
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
                {userRole === "1" && (
                    <Link to="/admin" className="mr-4 text-medium">Admin Panel</Link>
                )}
                {isLoggedIn && userRole !== "0" && (
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