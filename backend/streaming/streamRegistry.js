// Stream control-plane prototype. No stream keys are stored in page metadata.
// In-memory state intentionally resets on server restart; replace with durable
// streaming sessions and a relay service before production.
export const supportedDestinations = Object.freeze({
  youtube: { label: 'YouTube Live', protocol: 'RTMPS', analytics: 'provider-api-required' },
  twitch: { label: 'Twitch', protocol: 'RTMPS', analytics: 'provider-api-required' },
  facebook: { label: 'Facebook Live', protocol: 'RTMPS', analytics: 'provider-api-required' }
});
const sessions = new Map();
export function getStreamSession(creatorId) {
  return sessions.get(creatorId) || { status: 'NOT_CONFIGURED', destinations: [], metrics: {}, updatedAt: null };
}
export function configureStream(creatorId, destinations) {
  if (!Array.isArray(destinations) || destinations.length > 3 ||
      destinations.some(d => !Object.hasOwn(supportedDestinations, d)) ||
      new Set(destinations).size !== destinations.length) {
    throw new Error('Select unique supported streaming destinations');
  }
  const session = {
    status: 'CONFIGURED_NOT_LIVE',
    destinations,
    metrics: {},
    updatedAt: new Date().toISOString()
  };
  sessions.set(creatorId, session);
  return session;
}
export function summarizeMetrics(metrics) {
  const platforms = Object.entries(metrics || {}).map(([platform, value]) => ({
    platform,
    viewers: Number.isFinite(value.viewers) ? value.viewers : null,
    engagement: Number.isFinite(value.engagement) ? value.engagement : null,
    updatedAt: value.updatedAt || null
  }));
  return {
    platforms,
    viewersReportedTotal: platforms.reduce((sum, p) => sum + (p.viewers || 0), 0),
    missingPlatforms: platforms.filter(p => p.viewers === null).map(p => p.platform)
  };
}
