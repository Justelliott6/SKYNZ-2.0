import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
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

const API = process.env.REACT_APP_API_URL || 'http://localhost:3000';
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
      const response = await fetch(`${API}/api/analytics/${pageId}`, {
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

  // Backend returns event rows, not pre-aggregated visitor_count/watch_time.
  const views = analytics.filter(a => a.event_type === 'page_view');
  const today = new Date();
  const days = Array.from({length:7}, (_,i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6-i));
    return d.toLocaleDateString('en-CA');
  });
  const dailyCounts = days.map(day => views.filter(a => {
    const date = new Date(a.created_at);
    return !Number.isNaN(date.getTime()) && date.toLocaleDateString('en-CA') === day;
  }).length);
  const chartData = {
    labels: days.map(day => new Date(day + 'T12:00:00').toLocaleDateString(undefined,{month:'short',day:'numeric'})),
    datasets: [{label:'Recorded page views',data:dailyCounts,borderColor:'#34d399',backgroundColor:'rgba(52,211,153,.12)',tension:.3}]
  };
  const chartOptions = {
    responsive:true,
    plugins:{legend:{labels:{color:'#ffffff'}}},
    scales:{
      y:{beginAtZero:true,ticks:{color:'#9ca3af',precision:0},grid:{color:'rgba(52,211,153,.1)'}},
      x:{ticks:{color:'#9ca3af'},grid:{color:'rgba(52,211,153,.1)'}}
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-emerald-900 to-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-8">Analytics</h1>

        {isLoading ? (
          <p className="text-gray-400">Loading analytics...</p>
        ) : (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Total Views</p>
                <p className="text-white text-3xl font-bold mt-2">
                  {views.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Watch Time</p>
                <p className="text-white text-3xl font-bold mt-2">
                  Not tracked
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/30 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Last 7 Days</p>
                <p className="text-white text-3xl font-bold mt-2">{dailyCounts.reduce((sum,n)=>sum+n,0)}</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-gradient-to-br from-emerald-900/20 to-black border border-emerald-500/30 rounded-xl p-6">
              <h2 className="text-white text-xl font-bold mb-4">Recorded views over the last 7 days</h2>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
