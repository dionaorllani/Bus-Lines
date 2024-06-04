import React from "react";
import { Link } from "react-router-dom";

const Cancel = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h2 className="text-6xl text-orange-400 font-extralight mb-4">Gabim</h2>
            <p className="text-gray-400 font-light text-center mb-4">There was a problem processing yout payment</p>
            <Link to="/" className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center px-4 py-2">
                Go Back Home
            </Link>
        </div>
    );
};

export default Cancel;

