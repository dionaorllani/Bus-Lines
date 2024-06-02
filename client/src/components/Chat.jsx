import React, { useState } from "react";
import axios from "axios";
import useTokenRefresh from '../hooks/useTokenRefresh';

const Chat = () => {
    useTokenRefresh();

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!question.trim()) {
            setError(true);
            return;
        }

        try {
            const response = await axios.get(`https://localhost:7264/ChatCompletion/answer?question=${encodeURIComponent(question)}`);
            setAnswer(response.data);
            setError(false);
        } catch (error) {
            console.error("Error fetching answer:", error);
            setError(true);
        }
    };

    const handleInputChange = (e) => {
        setQuestion(e.target.value);
        setError(false);
    };

    return (
        <div className="flex flex-col justify-center items-center mt-10 px-4 selection:bg-orange-400 selection:text-white">
            <div className="max-w-sm lg:max-w-full lg:flex justify-center items-center space-x-2 overflow-hidden shadow-2xl px-6 py-4 flex rounded-lg">
                <div>
                    <h2 className="text-2xl text-orange-400 font-extralight">Ask a Question</h2>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <input
                            type="text"
                            value={question}
                            onChange={handleInputChange}
                            placeholder="Type your question here..."
                            className="w-full p-1 rounded-md border border-gray-100 mb-2"
                        />
                        <button type="submit" className="w-full text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center p-1">
                            Submit
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-2">Error fetching answer. Please try again.</p>}
                    {answer && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Answer:</h3>
                            <p className="text-gray-700">{answer}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
