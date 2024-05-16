import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTickets();
    }, [currentPage]);

    const fetchTickets = async () => {
        try {
            const response = await axios.get('https://localhost:7264/Ticket');
            const sortedTickets = response.data.sort((a, b) => b.id - a.id); // Sort by higher ID to lower
            const formattedTickets = sortedTickets.map(ticket => ({
                ...ticket,
                dateOfBooking: new Date(ticket.dateOfBooking).toLocaleDateString(),
                departure: new Date(ticket.departure).toLocaleString()
            }));
            setTickets(formattedTickets);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    const deleteTicket = async (id) => {
        try {
            await axios.delete(`https://localhost:7264/Ticket/${id}`);
            fetchTickets();
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = tickets.slice(indexOfFirstItem, indexOfLastItem);

    const pageCount = Math.ceil(tickets.length / itemsPerPage);

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-auto">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <div className="flex justify-between items-center border-b border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-700">Ticket List</h2>
                        <div>
                            <Link
                                to="/admin"
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
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">User</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Bus Schedule</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Departure Date</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Seat</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Date of Booking</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((ticket, index) => (
                                    <tr key={ticket.id}>
                                        <td className="px-6 py-4">{ticket.id}</td>
                                        <td className="px-6 py-4">{ticket.userName}</td>
                                        <td className="px-6 py-4">{ticket.startCityName} to {ticket.destinationCityName}</td>
                                        <td className="px-6 py-4">{ticket.departure}</td>
                                        <td className="px-6 py-4">{ticket.seat}</td>
                                        <td className="px-6 py-4">{ticket.dateOfBooking}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => deleteTicket(ticket.id)} className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                            <Link to={`/admin/tickets/${ticket.id}/edit`} className="text-blue-600 hover:text-blue-900 ml-10">
                                                Edit
                                            </Link>
                                        </td>
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

export default TicketList;
