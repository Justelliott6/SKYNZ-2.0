import React from 'react';
import { FiBarChart2, FiClock, FiMapPin, FiMessageSquare, FiUsers } from 'react-icons/fi';

const AnalyticsPanel = ({ analytics }) => {
  const stats = [['pageViews', 'Page views', FiBarChart2], ['uniqueVisitors', 'Unique visitors', FiUsers], ['watchTime', 'Watch time', FiClock], ['chatActivity', 'Chat activity', FiMessageSquare]];
  return <section className="analytics-panel panel-shell"><div className="panel-heading"><div><span className="section-kicker">Audience signals</span><h2>Analytics</h2></div><div className="range-tabs">{['24H', '7D', '30D', 'All Time'].map((range) => <button type="button" className={analytics.range === range ? 'is-active' : ''} key={range}>{range}</button>)}</div></div><div className="analytics-grid">{stats.map(([key, label, Icon]) => <div className="metric" key={key}><Icon /><small>{label}</small><strong>{analytics[key] || 0}</strong></div>)}</div><div className="analytics-detail-grid"><div className="chart-placeholder"><FiBarChart2 /><strong>Views over time</strong><span>Analytics history will populate from the existing page analytics API.</span></div><div className="location-placeholder"><FiMapPin /><strong>Audience locations</strong><span>Location data is not currently returned by the backend.</span></div></div></section>;
};

export default AnalyticsPanel;
