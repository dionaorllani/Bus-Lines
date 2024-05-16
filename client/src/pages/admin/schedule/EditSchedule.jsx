import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const EditBusSchedule = () => {
    const { id } = useParams();
    const [busSchedule, setBusSchedule] = useState({
        id: 0,
        operatorName: '',
        departure: '',
        arrival: '',
        price: 0,
        stationNames: [], // Add stationNames field for stops
    });
    const [operators, setOperators] = useState([]);
    const [stops, setStops] = useState([]);
    const [selectedStop, setSelectedStop] = useState('');
    const [loading, setLoading] = useState(true);
    const [updateStatus, setUpdateStatus] = useState(null);

    useEffect(() => {
        fetchBusSchedule();
        fetchOperators();
        fetchStops();
    }, []);

    const fetchBusSchedule = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/BusSchedule/${id}`);
            setBusSchedule(response.data);
        } catch (error) {
            console.error('Error fetching bus schedule:', error);
        }
    };

    const fetchOperators = async () => {
        try {
            const response = await axios.get('https://localhost:7264/Operator');
            const sortedOperators = response.data.sort((a, b) => a.name.localeCompare(b.name));
            setOperators(sortedOperators);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching operators:', error);
        }
    };

    const fetchStops = async () => {
        try {
            const response = await axios.get('https://localhost:7264/Stop');
            const sortedStops = response.data.sort((a, b) => a.stationName.localeCompare(b.stationName));
            setStops(sortedStops);
        } catch (error) {
            console.error('Error fetching stops:', error);
        }
    };

    const updateBusSchedule = async () => {
        try {
            await axios.put(`https://localhost:7264/BusSchedule/${id}`, busSchedule);
            setUpdateStatus('success');
        } catch (error) {
            console.error('Error updating bus schedule:', error);
            setUpdateStatus('error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Name: ${name}, Value: ${value}`);
        setBusSchedule(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSelectChange = (e) => {
        setSelectedStop(e.target.value);
    };

    const handleAddStop = () => {
        if (selectedStop.trim() !== '' && !busSchedule.stationNames.includes(selectedStop)) {
            setBusSchedule(prevState => ({
                ...prevState,
                stationNames: [...prevState.stationNames, selectedStop.trim()]
            }));
            setSelectedStop('');
        }
    };

    const handleRemoveStop = (index) => {
        setBusSchedule(prevState => ({
            ...prevState,
            stationNames: prevState.stationNames.filter((_, i) => i !== index)
        }));
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateBusSchedule} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Bus Schedule</p>
                        {updateStatus === 'success' && (
                            <p className="text-green-600">Bus Schedule Updated Successfully</p>
                        )}
                        {updateStatus === 'error' && (
                            <p className="text-red-600">Error updating Bus Schedule</p>
                        )}
                        <div className="mb-4">
                            <label htmlFor="operatorName" className="block text-gray-700 text-sm font-bold mb-2">Operator Name:</label>
                            <select
                                id="operatorName"
                                name="operatorName"
                                value={busSchedule.operatorName}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                {loading ? (
                                    <option>Loading...</option>
                                ) : (
                                    operators.map(operator => (
                                        <option key={operator.id} value={operator.name}>{operator.name}</option>
                                    ))
                                )}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="departure" className="block text-gray-700 text-sm font-bold mb-2">Departure Time:</label>
                            <input
                                type="datetime-local"
                                id="departure"
                                name="departure"
                                value={busSchedule.departure}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="arrival" className="block text-gray-700 text-sm font-bold mb-2">Arrival Time:</label>
                            <input
                                type="datetime-local"
                                id="arrival"
                                name="arrival"
                                value={busSchedule.arrival}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price:</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                value={busSchedule.price}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="selectStop" className="block text-gray-700 text-sm font-bold mb-2">Select Stop:</label>
                            <select
                                id="selectStop"
                                name="selectStop"
                                value={selectedStop}
                                onChange={handleSelectChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select a stop</option>
                                {stops.map(stop => (
                                    <option key={stop.id} value={stop.stationName}>{stop.stationName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={handleAddStop}
                                className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-500 hover:bg-blue-600"
                            >
                                Add Stop
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Stops:</label>
                            <ul>
                                {busSchedule.stationNames.map((stop, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{stop}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStop(index)}
                                            className="bg-red-500 text-white font-medium py-1 px-2 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-red-500 hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Update
                        </button>

                        <Link
                            to="/admin/schedules" // Replace this with your desired route
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

export default EditBusSchedule;
