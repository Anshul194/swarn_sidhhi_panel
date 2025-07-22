import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnalytics } from '../../store/slices/anayltics';
import { RootState } from '../../store/store';
import { Users, UserPlus, Activity, Crown, TrendingUp, Calendar } from 'lucide-react';

const UserAnalytics: React.FC = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state: RootState) => state.analytics);

    // Add state for period filter
    const [period, setPeriod] = useState<'month' | 'year'>('month');

    useEffect(() => {
        dispatch(
            fetchAnalytics({
                baseUrl: 'YOUR_BASE_URL',
                token: 'YOUR_TOKEN',
                period,
            }) as any
        );
    }, [dispatch, period]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-100 rounded-lg p-6">
                                        <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                                        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="text-center py-12">
                            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Analytics</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button 
                                onClick={() => dispatch(fetchAnalytics({ baseUrl: 'YOUR_BASE_URL', token: 'YOUR_TOKEN' }) as any)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const analytics = data.data;

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatPercentage = (rate: number) => {
        return `${(rate * 100).toFixed(1)}%`;
    };

    const metrics = [
        {
            title: 'Total Users',
            value: formatNumber(analytics.total_users),
            icon: Users,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-700'
        },
        {
            title: 'New Users',
            value: formatNumber(analytics.new_users),
            icon: UserPlus,
            color: 'bg-green-500',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700'
        },
        {
            title: 'Active Users',
            value: formatNumber(analytics.active_users),
            icon: Activity,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-700'
        },
        {
            title: 'Premium Users',
            value: formatNumber(analytics.premium_users),
            icon: Crown,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-700'
        },
        {
            title: 'Premium Conversion Rate',
            value: formatPercentage(analytics.premium_conversion_rate),
            icon: TrendingUp,
            color: 'bg-indigo-500',
            bgColor: 'bg-indigo-50',
            textColor: 'text-indigo-700'
        },
        {
            title: 'Period',
            value: analytics.period,
            icon: Calendar,
            color: 'bg-gray-500',
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-700'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Analytics</h1>
                    <p className="text-gray-600">Track your user engagement and growth metrics</p>
                </div>

                {/* Period Filter */}
                <div className="mb-6 flex items-center gap-3">
                    <label htmlFor="period" className="text-gray-700 font-medium">
                        Period:
                    </label>
                    <select
                        id="period"
                        value={period}
                        onChange={e => setPeriod(e.target.value as 'month' | 'year')}
                        className="border border-gray-300 rounded px-3 py-1 focus:outline-none"
                    >
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {metrics.map((metric, index) => {
                        const IconComponent = metric.icon;
                        return (
                            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                                        <IconComponent className={`w-6 h-6 ${metric.textColor}`} />
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${metric.color}`}></div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Summary Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">User Engagement</span>
                                <span className="font-semibold text-gray-900">
                                    {((analytics.active_users / analytics.total_users) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(analytics.active_users / analytics.total_users) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Premium Adoption</span>
                                <span className="font-semibold text-gray-900">
                                    {formatPercentage(analytics.premium_conversion_rate)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${analytics.premium_conversion_rate * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    Last updated: {new Date().toLocaleString()}
                </div>
            </div>
        </div>
    );
};

export default UserAnalytics;