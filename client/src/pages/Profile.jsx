import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';
import EditAccount from '../components/EditAccount';
import Footer from "../components/Footer"

const Profile = () => {
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);

    const [openEditProfile, setOpenEditProfile] = useState(false);

    const navigate = useNavigate();

    const cancelTicket = async (ticketId) => {
        try {

            await axios.delete(`https://localhost:7264/Ticket/${ticketId}`);
            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        } catch (error) {
            console.error('Error canceling the ticket:', error);
        }
    };

    useEffect(() => {

        const userId = localStorage.getItem('userId');

        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`https://localhost:7264/User/${localStorage.getItem('userId')}`);
                setUser(userResponse.data);

                const ticketResponse = await axios.get(`https://localhost:7264/Ticket?userId=${localStorage.getItem('userId')}`);
                setTickets(ticketResponse.data);

            } catch (error) {
                console.error('Error fetching user or ticket data:', error);

            }
        };

        if (userId) {
            fetchUserData();
        }
    }, []);

    const clearStorage = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <>
            <div>
                <NavBar />
                <div>
                    {user ? (
                        <div className="selection:bg-orange-400 selection:text-white">
                            <div className="w-[380px] md:w-[600px] lg:w-[750px] mx-auto">
                                <h1 className='text-2xl md:text-4xl lg:text-5xl font-semibold text-[#3b3b3b] text-center'>Miresevini, {user.firstName} {user.lastName}</h1>
                                <div className='w-full flex justify-between mt-3 gap-10 px-6'>
                                    <button onClick={() => setOpenEditProfile(true)} className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-base text-extralight text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white mt-2 p-1 w-20">Ndrysho Profilin</button>
                                </div>
                            </div>
                            <h1 className=' w-[380px] md:w-[680px] lg:w-[750px] mx-auto mt-[100px] text-3xl text-[#3b3b3b] mb-5'>Biletat tuaja:</h1>
                            {tickets ? (

                                <div className="flex flex-col gap-4 justify-center">
                                    {tickets.map((ticket) => (
                                        <div>
                                            <div className="bg-white rounded-lg shadow-md overflow-hidden w-[380px] md:w-[680px] lg:w-[750px] mb-2 border-b border-gray-200 mx-auto hover:shadow-2xl">
                                                <div className="flex items-center px-4 py-2 border-b border-gray-200 justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900 mr-2">
                                                        {ticket.startCityName}
                                                    </h3>
                                                    <div className='flex'>
                                                        <h3>{ticket.departure.slice(0, 9)} at {ticket.departure.slice(11, 16)}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex items-center px-4 py-2 border-b border-gray-200 justify-between">
                                                    <h3 className="text-lg font-medium text-gray-900 mr-2">
                                                        {ticket.destinationCityName}
                                                    </h3>
                                                    <div className='flex'>
                                                        <h3>{ticket.arrival.slice(0, 9)} at {ticket.arrival.slice(11, 16)}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex items-center px-4 py-2">
                                                    <div>
                                                        <p className="ml-auto  text-sm text-orange-400"> Ulesja Numer: {ticket.seat}</p>
                                                        <p className="text-gray-500 text-sm">{ticket.operatorName}</p>
                                                    </div>
                                                    <button onClick={() => cancelTicket(ticket.id)} className=" text-sm focus:outline-none ml-auto  text-orange-400 hover:text-orange-700">
                                                        Anulo
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <h3>You dont have any booked tickets</h3>
                            )}
                        </div>
                    ) : (
                        <div className="flex w-full mt-[15%] align-middle text-center selection:bg-orange-400 selection:text-white">
                            <p className='m-auto text-6xl font-bold text-[#3b3b3b] '>Loading...</p>
                        </div>
                    )}
                </div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-lg'>
                    {openEditProfile && (
                        <EditAccount setOpenEditProfile={setOpenEditProfile} />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile; 