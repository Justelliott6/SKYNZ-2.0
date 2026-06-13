import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyticsPage = () => {
  const { pageId } = useParams();
  const [analytics, setAnalytics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    fetchAnalytics();
  }, [pageId]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analytics/${pageId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch analytics');

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: analytics.slice(-7).map((a, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Page Views',
        data: analytics.slice(-7).map(a => a.visitor_count || 0),
        borderColor: '#9333ea',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: '#ffffff' }
      }
    },
    scales: {
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(147, 51, 234, 0.1)' }
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: 'rgba(147, 51, 234, 0.1)' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">Analytics</h1>

        {isLoading ? (
          <p className="text-gray-400">Loading analytics...</p>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {analytics.reduce((sum, a) => sum + (a.visitor_count || 0), 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Watch Time</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {Math.round(analytics.reduce((sum, a) => sum + (a.watch_time || 0), 0) / 60)}h
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Last 7 Days</p>
                <p className="text-white text-3xl font-bold mt-2">{analytics.length}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Views Over Time</h2>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
