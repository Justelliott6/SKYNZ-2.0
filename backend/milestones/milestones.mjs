/** Pure milestone decision logic. The backend must supply a transactionally committed sale ordinal. */
export const PAGE_SALE_MILESTONES = Object.freeze([1000, 5000, 10000, 100000, 1000000]);

export function selectMilestone({ saleOrdinal, saleId, creatorId, status }) {
  if (status !== 'confirmed') return null;
  if (!Number.isSafeInteger(saleOrdinal) || saleOrdinal < 1) throw new TypeError('Invalid sale ordinal');
  if (typeof saleId !== 'string' || !saleId.trim() || typeof creatorId !== 'string' || !creatorId.trim()) throw new TypeError('Missing sale or creator identity');
  if (!PAGE_SALE_MILESTONES.includes(saleOrdinal)) return null;
  return Object.freeze({
    eventId: `page-sale-milestone:${saleOrdinal}`,
    saleId,
    creatorId,
    milestone: saleOrdinal,
    animationId: saleOrdinal === 1000 ? 'purple-rabbit-beans-hole-v1' : `purple-rabbit-milestone-${saleOrdinal}-pending`,
    replayPolicy: 'creator-opt-in-generated-animation-only',
  });
}
