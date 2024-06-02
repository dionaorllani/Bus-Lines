import { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from "../../../components/NavBar";
import { Link } from 'react-router-dom';

const QuestionList = () => {
    const [userQuestions, setUserQuestions] = useState([]);

    useEffect(() => {
        const fetchUserQuestions = async () => {
            try {
                const response = await axios.get('https://localhost:7264/ChatCompletion/questions');
                setUserQuestions(response.data);
            } catch (error) {
                console.error('Error fetching user questions:', error);
            }
        };

        fetchUserQuestions();
    }, []);

    const deleteQuestion = async (id) => {
        try {
            await axios.delete(`https://localhost:7264/ChatCompletion/questions/${id}`);
            // After deletion, fetch the updated list of questions
            const response = await axios.get('https://localhost:7264/ChatCompletion/questions');
            setUserQuestions(response.data);
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <>
            <NavBar />
            <div className="container mx-auto w-auto">
                <div className="bg-white shadow-md rounded-xl my-6">
                    <div className="flex justify-between items-center border-b border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-700">User Questions List</h2>
                    </div>
                    <div className="w-full overflow-x-auto">
                        <table className="w-full whitespace-no-wrap">
                            <thead>
                                <tr className="text-left font-bold">
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">ID</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Question</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Asked At</th>
                                    <th className="px-6 py-3 bg-gray-100 text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {userQuestions.map((question) => (
                                    <tr key={question.id}>
                                        <td className="px-6 py-4">{question.id}</td>
                                        <td className="px-6 py-4">{question.question}</td>
                                        <td className="px-6 py-4">{question.askedAt}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => deleteQuestion(question.id)} className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                            <Link to={`/admin/questions/${question.id}/edit`} className="text-blue-600 hover:text-blue-900 ml-10">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default QuestionList;
