import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NavBar from "../../../components/NavBar"

const OperatorCreate = () => {
    const [operatorName, setOperatorName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleOperatorNameChange = (event) => {
        setOperatorName(event.target.value);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!operatorName.trim()) {
            setError('Please enter an operator name.');
            return;
        }
        try {
            const response = await axios.post('https://localhost:7264/Operator', { name: operatorName });
            setSuccess(`Operator "${response.data.name}" added successfully.`);
            setOperatorName('');
            setError('');
        } catch (error) {
            setError('Error adding operator. Please try again.');
            console.error('Error adding operator:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Add Operator</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="operatorName" className="block text-gray-700 text-sm font-bold mb-2">Operator Name:</label>
                            <input
                                type="text"
                                id="operatorName"
                                value={operatorName}
                                onChange={handleOperatorNameChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter operator name"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Add Operator
                        </button>
                        <Link
                            to="/admin/operators"
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

export default OperatorCreate;
