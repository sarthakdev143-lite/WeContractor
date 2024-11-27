"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import { AuthUtils } from '@/components/utils/auth';
import LoadingSpinner from '@/components/LoadingSpinner'

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (!AuthUtils.isAuthenticated()) {
                    router.push('/form/login');
                    return;
                }

                setLoading(true);
                setError(null);

                const AuthenticatedAxios = AuthUtils.createAuthenticatedAxios();
                const response = await AuthenticatedAxios.get('/api/user');

                setUserData(response.data);

                // Process transaction data if available
                if (response.data.transactions?.length) {
                    const last7Days = response.data.transactions
                        .slice(0, 7)
                        .map(transaction => ({
                            name: new Date(transaction.transactionDate).toLocaleDateString('en-IN', {
                                weekday: 'short'
                            }),
                            activity: transaction.transactionAmount
                        }));
                    setActivityData(last7Days);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);

                if (error.redirect) {
                    router.push('/form/login');
                    return;
                }

                const errorMessage = error.response?.data?.message
                    || error.response?.data?.error
                    || error.message
                    || "Failed to load user data";

                setError(errorMessage);
                console.log(errorMessage)
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    // Loading state with spinner
    if (loading) {
        return (
            <LoadingSpinner
                type="dots"
                text="Fetching Data.."
            />
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    // Main dashboard view
    return (
        <div className="max-w-7xl mx-auto">
            {userData && (
                <>
                    {/* Header Section */}
                    <div className="flex justify-between gap-8 mb-8">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="relative w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                                {userData.profilePictureUrl ? (
                                    <Image
                                        src={userData.profilePictureUrl}
                                        alt={userData.fullName}
                                        width={64}
                                        height={64}
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-xl">
                                        {userData.username?.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Welcome back, {userData.fullName}!</h1>
                                <p className="text-gray-500">
                                    Member since: {new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.forward('/settings')}
                            className="px-3 py-[0.5rem] h-fit text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <i className="ri-list-settings-line text-xl"></i>
                        </button>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* User Info Card */}
                        <div className="bg-white rounded-lg shadow-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="text-gray-500">Username:</div>
                                    <div className="text-gray-900">{userData.username}
                                        {userData.verified && (
                                            <i className="ri-verified-badge-fill text-blue-500 text-xl ml-1"></i>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Email:</span>
                                    <span>{userData.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Phone:</span>
                                    <span>{userData.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Roles:</span>
                                    {userData.roles?.join(', ')}
                                </div>
                            </div>
                        </div>

                        {/* Account Summary Card */}
                        <div className="bg-white rounded-lg shadow-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Plots</p>
                                        <p className="text-xl font-bold">{userData.plotCount || 0}</p>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Favourites</p>
                                        <p className="text-xl font-bold">{userData.favouriteCount || 0}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-black mb-2">Recent Transactions</p>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={activityData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Line
                                                    type="monotone"
                                                    dataKey="activity"
                                                    stroke="#2563eb"
                                                    strokeWidth={2}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-base font-bold text-black mb-2">Recent Activities</p>
                                    <div>
                                        {userData.recentActivities?.length === 0 || !userData.recentActivities && <p className="text-gray-500">No recent activities found.</p>}

                                        {userData.recentActivities?.map((activity, index) => (
                                            <div key={index} className="flex justify-between items-center gap-2 mb-2">
                                                <span className="text-gray-800">{activity.activityName}</span>
                                                <span className="text-gray-500">{activity.activityTime}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-white rounded-lg shadow-2xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                            <div className="space-y-2">
                                <button
                                    className="w-full px-4 py-2 text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        console.log("Forwarding to bank accounts...");
                                        router.push("/user-dashboard/bank-accounts");
                                    }}
                                >
                                    Manage Bank Accounts
                                </button>
                                <button
                                    className="w-full px-4 py-2 text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        console.log("Forwarding to plots...");
                                        router.push("/user-dashboard/plots");
                                    }}
                                >
                                    View Plots
                                </button>
                                <button
                                    className="w-full px-4 py-2 text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        console.log("Forwarding to transactions...");
                                        router.push("/user-dashboard/transactions");
                                    }}
                                >
                                    Transaction History
                                </button>
                                <button
                                    className="w-full px-4 py-2 text-left text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => {
                                        console.log("Forwarding to favourites...");
                                        router.push("/user-dashboard/favourites");
                                    }}
                                >
                                    View Favourites
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div >
    );
};

export default UserDashboard;