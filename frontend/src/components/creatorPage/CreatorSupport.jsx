import React from 'react';
import { FiArrowUpRight, FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';

const CreatorSupport = ({ support }) => {
  const links = [
    ['supportLink', 'Support creator', FiHeart],
    ['affiliateLink', 'Shop / affiliate', FiShoppingBag],
    ['merchandiseLink', 'Merchandise', FiShoppingBag],
    ['membershipLink', 'Memberships', FiStar]
  ];

  return <section className="support-area"><div className="section-heading"><div><span className="section-kicker">Keep the channel moving</span><h2>Creator support</h2></div></div><div className="support-grid">{links.map(([key, label, Icon]) => support[key] ? <a className="support-link" href={support[key]} target="_blank" rel="noreferrer" key={key}><Icon /><span>{label}</span><FiArrowUpRight /></a> : <div className="support-link support-link-disabled" key={key}><Icon /><span>{label}<small>Not connected</small></span></div>)}{(support.externalLinks || []).map((link) => <a className="support-link" href={link.url} target="_blank" rel="noreferrer" key={link.url}><FiArrowUpRight /><span>{link.label}</span><FiArrowUpRight /></a>)}</div></section>;
};

export default CreatorSupport;
