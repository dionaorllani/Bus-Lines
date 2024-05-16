import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const EditTicket = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState({
        userId: '',
        userName: '',
        busScheduleId: '',
        seat: '',
        dateOfBooking: ''
    });
    const [busSchedules, setBusSchedules] = useState([]);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTicket();
        fetchBusSchedules();
    }, []);

    const fetchTicket = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/Ticket/${id}`);
            setTicket(response.data);
        } catch (error) {
            console.error('Error fetching ticket:', error);
        }
    };

    const fetchBusSchedules = async () => {
        try {
            const response = await axios.get('https://localhost:7264/BusSchedule');
            const sortedBusSchedules = response.data.sort((a, b) => a.departure.localeCompare(b.departure));
            setBusSchedules(sortedBusSchedules);
        } catch (error) {
            console.error('Error fetching bus schedules:', error);
        }
    };

    const updateTicket = async () => {
        try {
            await axios.put(`https://localhost:7264/Ticket/${id}`, ticket, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setSuccess('Ticket updated successfully!');
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    const handleChange = (e) => {
        setTicket({ ...ticket, [e.target.name]: e.target.value });
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateTicket} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Ticket</p>
                        <div className="mb-4">
                            <label htmlFor="userName" className="block text-gray-700 text-sm font-bold mb-2">User Name:</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={`${ticket.userName}`}
                                readOnly
                                className="bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="busScheduleId" className="block text-gray-700 text-sm font-bold mb-2">Bus Schedule:</label>
                            <select
                                id="busScheduleId"
                                name="busScheduleId"
                                value={ticket.busScheduleId}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Select a bus schedule</option>
                                {busSchedules.map(schedule => (
                                    <option key={schedule.id} value={schedule.id}>{schedule.startCityName} - {schedule.destinationCityName} ({new Date(schedule.departure).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })})</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="seat" className="block text-gray-700 text-sm font-bold mb-2">Seat:</label>
                            <input
                                type="text"
                                id="seat"
                                name="seat"
                                value={ticket.seat}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter seat number"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="dateOfBooking" className="block text-gray-700 text-sm font-bold mb-2">Date of Booking:</label>
                            <input
                                type="text"
                                id="dateOfBooking"
                                name="dateOfBooking"
                                value={new Date(ticket.dateOfBooking).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                readOnly
                                className="bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Update
                        </button>
                        <Link
                            to="/admin/tickets"
                            className="bg-gray-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-gray-400 hover:bg-gray-500 ml-2"
                        >
                            Back
                        </Link>
                        {success && <p className="text-green-600 mt-2">{success}</p>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditTicket;
