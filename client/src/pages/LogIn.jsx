import { useState } from 'react';
import axios from 'axios';
import BusLogo from "../assets/BusLogo.svg";
import { Link } from 'react-router-dom';
import Footer from "../components/Footer";

const LogIn = () => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [createPassword, setCreatePassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [message, setMessage] = useState(''); // Renamed from setError to setMessage

    const toggleMode = () => {
        setMode(prevMode => (prevMode === 'login' ? 'signup' : 'login'));
        setMessage(''); // Reset message when toggling mode
    };

    const checkExistingEmail = async (email) => {
        try {
            const response = await axios.get(`https://localhost:7264/User?email=${email}`);
            return response.data && response.data.length > 0;
        } catch (error) {
            console.error(error);
            return false; // Assume email doesn't exist on error
        }
    };

    const handleLoginSuccess = (token, userId, userRole) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userRole', userRole);
        window.location.href = userRole === 1 ? '/admin' : '/';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (mode === 'login') {
            try {
                const response = await axios.post('https://localhost:7264/user/login', { email, password });
                handleLoginSuccess(response.data.token, response.data.userId, response.data.userRole);
            } catch (error) {
                console.error(error);
                setMessage("Keni gabuar te dhenat, ju lutem provoni perseri!");
            }
        } else {
            if (createPassword !== repeatPassword) {
                setMessage("Fjalekalimi nuk perputhet!");
                return;
            }
            const emailExists = await checkExistingEmail(email);
            if (emailExists) {
                setMessage("Kjo email adrese egziston!");
                return;
            }
            try {
                const response = await axios.post('https://localhost:7264/user', {
                    firstName,
                    lastName,
                    email,
                    password: createPassword,
                });
                console.log(response.data);
                // Clear form fields and show success message
                setFirstName('');
                setLastName('');
                setEmail('');
                setCreatePassword('');
                setRepeatPassword('');
                setMessage("U regjistruat me sukses!");
            } catch (error) {
                console.error(error);
                setMessage("Ka ndodhur nje problem, ju lutem provoni me vone!");
            }
        }
    };

    return (
        <>
            <div className="min-h-screen flex justify-center items-center bg-white selection:bg-orange-400 selection:text-white">
                <div className="max-w-md w-[380px] md:w-[600px] lg:w-[750px]">
                    <div className={`bg-white py-8 px-6 rounded-lg shadow-2xl ${mode === 'login' ? 'bg-opacity-90' : 'bg-opacity-80'}`}>
                        <Link to="../">
                            <div className="flex justify-center mb-8">
                                <img src={BusLogo} alt="Buslines Logo " />
                            </div>
                        </Link>
                        <h1 className="text-3xl font-normal text-center text-black mb-8">{mode === 'login' ? 'Miresevini!' : 'Regjistrohu'}</h1>
                        {message && <div className={`mb-4 ${message.startsWith('U regjistruat') ? 'text-green-500' : 'text-orange-400'}`}>{message}</div>}
                        <form onSubmit={handleSubmit}>
                            {mode !== 'signup' && (
                                <>
                                    <div className="mb-6">
                                        <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="mb-6">
                                        <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="password" id="password" placeholder="Fjalekalimi" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                    </div>
                                </>
                            )}
                            {mode === 'signup' && (
                                <>
                                    <div className="mb-6">
                                        <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="text" id="firstname" placeholder="Emri" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                    </div>
                                    <div className="mb-6">
                                        <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="text" id="lastname" placeholder="Mbiemri" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                    </div>
                                    <div className="mb-6">
                                        <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                    </div>
                                    <div className="mb-6">
                                        <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="password" id="createpassword" placeholder="Shkruaj fjalekalimin" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} required />
                                    </div>
                                    <div className="mb-6">
                                        <input className="w-full px-4 py-3 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:bg-white transition duration-300 ease-in-out" type="password" id="repeatpassword" placeholder="Perserit fjalekalimin" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} required />
                                    </div>
                                </>
                            )}
                            <button className="w-full bg-orange-400 hover:bg-orange-500 py-3 rounded-md text-white font-semibold transition duration-300 ease-in-out" type="submit">{mode === 'login' ? 'Kyqu' : 'Regjistrohu'}</button>

                        </form>
                        <div className="mt-6 text-center text-gray-800">
                            <span>{mode === 'login' ? "Nuk keni" : 'Keni'} llogari?</span>
                            <button className="ml-2 text-orange-400 hover:underline focus:outline-none" onClick={toggleMode}>{mode === 'login' ? 'Regjistrohu' : 'Kyqu'}</button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LogIn;
