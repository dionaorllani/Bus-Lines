import React from 'react';
import axios from 'axios';

const Line = ({ onClose, schedule, departureDate, departureTime, arrivalDate, arrivalTime, totalPrice }) => {
    // Function to handle reservation
    const handleReservation = async () => {
        const token = localStorage.getItem('token'); // Retrieve the token from local storage
        const userId = localStorage.getItem('userId'); // Retrieve the user ID from local storage

        // Check if either token or userId is not found
        if (!token || !userId) {
            console.error('User is not authenticated or user ID is missing.');
            // Redirect to login page if authentication fails or user ID is missing
            window.location.href = '/authentication'; // Modify the path as per your route settings
            return;
        }

        // Confirm reservation with the user
        const confirmReservation = window.confirm('Konfirmo se deshironi te rezervoni bileten.');
        if (confirmReservation) {
            try {
                // Make a POST request to create a ticket
                const response = await axios.post(
                    'https://localhost:7264/Ticket',
                    {
                        busScheduleId: schedule.id,
                        userId: userId,
                        dateOfBooking: new Date()
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                console.log('Ticket created:', response.data);
                alert('Keni rezervuar bileten me sukses!');
                onClose(); // Close the modal after successful reservation
            } catch (error) {
                console.error('Error creating ticket:', error.response.data);
                alert('Ndodhi nje gabim gjate rezervimit te biletës.');
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="fixed uppercase top-0 right-0 h-full bg-gray-400 bg-opacity-5 z-50 modal-content pt-6 px-6 rounded-2xl w-full sm:w-[400px] selection:bg-white selection:text-orange-400">
                    <h1 className="text-lg font-medium uppercase text-gray-900 bg-white px-4 py-2 rounded-lg shadow-sm m-2 shadow-xl text-center hover:bg-orange-300 hover:text-white">Detajet e linjes</h1>

                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm m-2 shadow-xl hover:bg-orange-300 hover:text-white">
                        <p className="text-base select-none">Nisja</p>
                        <p className="text-lg font-medium selection:bg-white selection:text-orange-400"> {schedule.startCityName}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm m-2 shadow-xl hover:bg-orange-300 hover:text-white">
                        <p className="text-base select-none">Destinacioni</p>
                        <p className="text-lg font-medium selection:bg-white selection:text-orange-400"> {schedule.destinationCityName}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm m-2 shadow-xl hover:bg-orange-300 hover:text-white">
                        <p className="text-base select-none">Operatori</p>
                        <p className="text-lg0 font-medium selection:bg-white selection:text-orange-400"> {schedule.operatorName}</p>
                        <br />
                        <p className="text-base select-none">Data</p>
                        <p className="text-m font-medium"> {departureDate}</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm m-2 shadow-xl hover:bg-orange-300 hover:text-white">
                        <p className="text-lg font-medium mb-5 selection:bg-white selection:text-orange-400"> Ndalesat:</p>
                        <p className="text-lg mb-3">
                            <span className="text-sm font-light selection:bg-white selection:text-orange-400">{departureTime}</span> -
                            <span className="font-normal selection:bg-white selection:text-orange-400"> {schedule.startCityName}</span>
                        </p>
                        {schedule.stationNames.map((station, idx) => (
                            <p key={idx} className="text-sm font-light ml-20 mb-3">&#x25C8; {station} <br></br><span>&#x250B;</span></p>
                        ))}
                        <p className="text-lg">
                            <span className="text-sm font-light selection:bg-white selection:text-orange-400">{departureTime}</span> -
                            <span className="font-normal selection:bg-white selection:text-orange-400"> {schedule.destinationCityName}</span>
                        </p>
                    </div>

                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm m-2 shadow-xl hover:bg-orange-300 hover:text-white">
                        <p className="text-lg">
                            <span className="text-sm font-light selection:bg-white selection:text-orange-400">Cmimi:</span> -
                            <span className="font-normal selection:bg-white selection:text-orange-400"> {totalPrice} &#8364;</span>
                        </p>
                    </div>
                    <button className="font-medium uppercase bg-white px-4 py-2 rounded-2xl m-2 shadow-xl text-center hover:bg-orange-300 hover:text-white" onClick={handleReservation}>Rezervo</button>
                    <button className="font-medium uppercase bg-white px-4 py-2 rounded-2xl m-2 shadow-xl text-center hover:bg-orange-300 hover:text-white" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default Line;