import { useState, useEffect } from "react";
import axios from "axios";

const Search = ({ onSubmit, initialSearchData }) => {
    const [startCity, setStartCity] = useState(initialSearchData.startCity || "");
    const [destinationCity, setDestinationCity] = useState(initialSearchData.destinationCity || "");
    const [departureTime, setDepartureTime] = useState(initialSearchData.departureTime || "");
    const [passengerCount, setPassengerCount] = useState(initialSearchData.passengerCount || 1);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://localhost:7264/City")
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.error("Error fetching cities:", error);
            });
    }, []);

    const handleInputChanges = (e) => {
        const { name, value } = e.target;
        setError(false);
        if (name === "StartCityId") {
            setStartCity(value);
        } else if (name === "DestinationCityId") {
            setDestinationCity(value);
        } else if (name === "passengerCount") {
            setPassengerCount(Number(value));
        } else if (name === "departureTime") {
            setDepartureTime(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!startCity || !destinationCity) {
            setError(true);
            return;
        }
        onSubmit({ startCity, destinationCity, passengerCount, departureTime });
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center mt-10 px-4 selection:bg-orange-400 selection:text-white">
                <div className="max-w-sm lg:max-w-full lg:flex justify-center items-center space-x-2 overflow-hidden shadow-2xl px-6 py-4 flex rounded-lg">
                    <div>
                        <h2 className="text-2xl text-orange-400 font-extralight">Udheto lehte. Destinacioni i radhes?</h2>
                        <p className="text-gray-400 font-light">Kerko & rezervo bileta te autobusit dhe oferta te udhetimit</p>
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div>
                                <div className="flex items-center flex-wrap lg:mb-2">
                                    <input
                                        className="w-10 lg:w-10 p-1 rounded-md border border-gray-100 mb-2 lg:mb-0 lg:mr-2"
                                        type="number"
                                        name="passengerCount"
                                        id="passengerCount"
                                        min="0"
                                        max="10"
                                        value={passengerCount}
                                        onChange={handleInputChanges}
                                    />
                                    <p className="lg:ml-2 lg:mr-4 mb-2 lg:mb-0">Numri i udhetareve</p>
                                </div>
                                <div className="flex flex-col lg:flex lg:flex-row mt-2 ">
                                    <select
                                        name="StartCityId"
                                        id="StartCityId"
                                        onChange={handleInputChanges}
                                        value={startCity}
                                        className="w-full lg:w-48 p-1 rounded-md border border-gray-100 mb-2 lg:mr-2"
                                    >
                                        <option value="" disabled>Zgjedh pikenisjen</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.name}>{city.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        name="DestinationCityId"
                                        id="DestinationCityId"
                                        onChange={handleInputChanges}
                                        value={destinationCity}
                                        className="w-full lg:w-auto p-1 rounded-md border border-gray-100 mb-2 lg:mr-2"
                                    >
                                        <option value="" disabled>Zgjedh destinacionin</option>
                                        {cities.filter(city => city.name !== startCity).map(city => (
                                            <option key={city.id} value={city.name}>{city.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="date"
                                        name="departureTime"
                                        id="departureTime"
                                        onChange={handleInputChanges}
                                        value={departureTime}
                                        min={new Date().toISOString().slice(0, 10)} // Set the minimum date to the current date
                                        className="w-full lg:w-auto p-1 rounded-md border border-gray-100 mb-2 lg:mr-2"
                                    />
                                    <button type="submit" className="w-full lg:w-20 text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center lg:mt-0 mt-2 p-1">
                                        Kerko
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-5">
                    {error && (
                        <p className="text-red-500">Ju lutem zgjedhini pikenisjen dhe destinacionin tuaj.</p>
                    )}
                </div>
            </div>

        </>
    );
};

export default Search;
