import { ChartNoAxesCombined } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-black text-gray-800">
            {/* Hero Section */}
            <div className="container bg-black text-white mx-auto px-4 py-20 flex flex-col-reverse lg:flex-row items-center justify-between">
                {/* Text */}
                <div className="max-w-xl space-y-6">
                    <div className='mb-4 flex items-center justify-start gap-2'>
                        <ChartNoAxesCombined className='size-9 text-primary' />
                        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Analyzr</span>
                    </div>
                    <p className="text-lg opacity-50">
                        Upload Excel files, generate beautiful 2D/3D charts, analyze trends,
                        and gain insights — all in one platform.
                    </p>
                    <div className="space-x-4">
                        <Link to="/login">
                            <button className="btn btn-outline">
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn btn-outline">
                                Create Account
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Image */}
                <div className="hidden mb-10 lg:block">
                    <img
                        src="./i.png"
                        alt="Data Visualization"
                        className="w-full max-w-md"
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-100 py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-semibold text-center mb-10">What You Can Do</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-white rounded shadow">
                            <h3 className="font-bold text-lg mb-2">Upload Excel Files</h3>
                            <p className="text-sm text-gray-600">Supports .xls and .xlsx formats.</p>
                        </div>
                        <div className="p-6 bg-white rounded shadow">
                            <h3 className="font-bold text-lg mb-2">Visualize with Charts</h3>
                            <p className="text-sm text-gray-600">Generate 2D/3D charts</p>
                        </div>
                        <div className="p-6 bg-white rounded shadow">
                            <h3 className="font-bold text-lg mb-2">Download Reports</h3>
                            <p className="text-sm text-gray-600">Export visualizations as PNG or PDF instantly.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer section */}
            <div className="bg-blue-600 text-white text-center py-10">
                <h3 className="text-2xl font-semibold mb-2">Start Analyzing Your Excel Data Today</h3>
                <p className="text-sm mb-4">Join the platform and turn raw data into powerful insights</p>
                <Link to="/signup">
                    <button className="px-6 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
