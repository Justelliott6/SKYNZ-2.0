import React from 'react';

const AddonSlot = ({ addon }) => <div className="addon-slot" data-addon-id={addon.id}><span className="section-kicker">Future add-on</span><strong>{addon.label || addon.id}</strong><span>{addon.description || 'Reserved for a future SKYNZ creator app.'}</span></div>;

export default AddonSlot;
