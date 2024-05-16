import { Link } from 'react-router-dom';
import NavBar from "../components/NavBar";


const Admin = () => {
    return (
        <>
            <NavBar />
            <div className="flex justify-center items-center my-10">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    <div className="flex-col flex items-center bg-white shadow-md rounded-md px-16 py-6">
                        <h3 className="text-xl font-semibold mb-2">Cities</h3>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold"></h2>
                            <Link to="/admin/cities">
                                <button className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 rounded-md w-20">
                                    See All
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-col flex items-center px-16 py-6 bg-white shadow-md rounded-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Stops</h3>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold"></h2>
                            <Link to="/admin/stops">
                                <button className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 rounded-md w-20">
                                    See All
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-col flex items-center px-16 py-6 bg-white shadow-md rounded-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Operators</h3>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold"></h2>
                            <Link to="/admin/operators">
                                <button className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 rounded-md w-20">
                                    See All
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-col flex items-center px-16 py-6 bg-white shadow-md rounded-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Bus Lines</h3>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold"></h2>
                            <Link to="/admin/lines/">
                                <button className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 rounded-md w-20">
                                    See All
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-col flex items-center px-16 py-6 bg-white shadow-md rounded-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Bus Schedules</h3>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold"></h2>
                            <Link to="/admin/schedules">
                                <button className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 rounded-md w-20">
                                    See All
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-col flex items-center px-16 py-6 bg-white shadow-md rounded-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Users</h3>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold"></h2>
                            <Link to="/admin/users/">
                                <button className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 rounded-md w-20">
                                    See All
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex-col flex items-center px-16 py-6 bg-white shadow-md rounded-md p-6">
                        <h3 className="text-xl font-semibold mb-2">Tickets</h3>
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold"></h2>
                            <Link to="/admin/tickets">
                                <button className="text-orange-400 hover:text-white border border-orange-400 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-orange-400 font-medium rounded-lg text-sm text-center flex-grow dark:border-orange-400 dark:text-orange-400 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900 mt-2 p-1 rounded-md w-20">
                                    See All
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin;