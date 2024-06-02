import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from "../../../components/NavBar";
import withAuthorization from '../../../HOC/withAuthorization';
import { Link } from 'react-router-dom';

const EditQuestion = () => {
    const { id } = useParams();
    const [userQuestion, setUserQuestion] = useState(null); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUserQuestion();
    }, []);

    const fetchUserQuestion = async () => {
        try {
            const response = await axios.get(`https://localhost:7264/ChatCompletion/questions/${id}`);
            setUserQuestion(response.data); 
        } catch (error) {
            console.error('Error fetching user question:', error);
        }
    };

    const updateQuestion = async (event) => {
        event.preventDefault(); 

        try {
            
            setError('');

            await axios.put(`https://localhost:7264/ChatCompletion/questions/${id}`, userQuestion, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            setSuccess('Question updated successfully.');
        } catch (error) {
            setError('Error updating question. Please try again.');
            console.error('Error updating question:', error);
        }
    };

    const handleChange = (e) => {
        setUserQuestion({ ...userQuestion, [e.target.name]: e.target.value });
    };

    if (!userQuestion) {
        return null;
    }

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-[400px] lg:w-[700px]">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <form onSubmit={updateQuestion} className="p-6">
                        <p className="block text-gray-700 text-xl font-medium mb-2">Edit Question</p>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
                        <div className="mb-4">
                            <label htmlFor="question" className="block text-gray-700 text-sm font-bold mb-2">Question:</label>
                            <input
                                type="text"
                                id="question"
                                name="question"
                                value={userQuestion.question}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-orange-400 text-white font-medium py-2 px-4 rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-orange-400 hover:bg-orange-500"
                        >
                            Update
                        </button>
                        <Link
                            to="/admin/questions"
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

export default withAuthorization(EditQuestion, ["Admin"]);
