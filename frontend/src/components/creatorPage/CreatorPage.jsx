import React from 'react';
import CreatorHeader from './CreatorHeader';
import StatusBar from './StatusBar';
import MediaPanel from './MediaPanel';
import LiveChat from './LiveChat';
import CreatorSupport from './CreatorSupport';
import AnalyticsPanel from './AnalyticsPanel';
import AddonSlot from './AddonSlot';

const CreatorPage = ({ config, messages, onSendMessage }) => <main className="creator-page">
  <CreatorHeader creator={config.creator} />
  {config.layout.showStatusBar && <StatusBar creator={config.creator} media={config.media} />}
  <div className={`creator-main creator-main-${config.layout.mediaPosition}`}>
    <MediaPanel media={config.media} />
    {config.layout.showChat && <LiveChat messages={messages} onSendMessage={onSendMessage} />}
  </div>
  <CreatorSupport support={config.support} />
  {config.layout.showAnalytics && <AnalyticsPanel analytics={config.analytics} />}
  {config.addons.length > 0 && <section className="addon-grid" aria-label="Future add-ons">{config.addons.map((addon) => <AddonSlot addon={addon} key={addon.id} />)}</section>}
</main>;

export default CreatorPage;
