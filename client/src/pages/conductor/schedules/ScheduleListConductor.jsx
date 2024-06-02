import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";
import withAuthorization from '../../../HOC/withAuthorization';
import useTokenRefresh from '../../../hooks/useTokenRefresh';

const BusScheduleListConductor = () => {
    useTokenRefresh();

    const [busSchedules, setBusSchedules] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchBusSchedules();
    }, [currentPage]);

    const fetchBusSchedules = async () => {
        try {
            const response = await axios.get('https://localhost:7264/BusSchedule');
            const sortedBusSchedules = response.data.sort((a, b) => a.id - b.id); // Sort by ID
            const formattedBusSchedules = sortedBusSchedules.map(schedule => ({
                ...schedule,
                departure: new Date(schedule.departure).toLocaleString(),
                arrival: new Date(schedule.arrival).toLocaleString()
            }));
            setBusSchedules(formattedBusSchedules);
        } catch (error) {
            console.error('Error fetching bus schedules:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = busSchedules.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(busSchedules.length / itemsPerPage);

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-auto">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <div className="flex justify-between items-center border-b border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-700">Bus Schedule List</h2>
                        <div>
                            <Link
                                to="/conductor"
                                className="bg-gray-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-gray-400 hover:bg-gray-500 ml-2"
                            >
                                Back
                            </Link>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full whitespace-no-wrap">
                            <thead>
                                <tr className="text-left font-bold">
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">ID</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Start City</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Destination City</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Departure</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Arrival</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Stops</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((schedule, index) => (
                                    <tr key={schedule.id}>
                                        <td className="px-6 py-4">{schedule.id}</td>
                                        <td className="px-6 py-4">{schedule.startCityName}</td>
                                        <td className="px-6 py-4">{schedule.destinationCityName}</td>
                                        <td className="px-6 py-4">{schedule.departure}</td>
                                        <td className="px-6 py-4">{schedule.arrival}</td>
                                        <td className="px-6 py-4">{schedule.stationNames.join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center items-center mt-6 pb-8">
                        {Array.from({ length: pageCount }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`mx-1 px-3 py-1 rounded-lg focus:outline-none ${currentPage === i + 1 ? 'bg-gray-300' : 'bg-gray-200'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default withAuthorization(BusScheduleListConductor, ["Conductor"]);