import test from 'node:test';
import assert from 'node:assert/strict';
import {selectMilestone, PAGE_SALE_MILESTONES} from './milestones.mjs';
const sale = (saleOrdinal, status='confirmed') => ({saleOrdinal, status, saleId:'sale-abc', creatorId:'creator-xyz'});
test('all five milestones select exactly', () => {for (const n of PAGE_SALE_MILESTONES) assert.equal(selectMilestone(sale(n)).milestone,n)});
test('ordinary and unconfirmed sales do not trigger', () => {assert.equal(selectMilestone(sale(999)),null);assert.equal(selectMilestone(sale(1000,'pending')),null)});
test('invalid input is rejected', () => {assert.throws(()=>selectMilestone(sale(1.5)));assert.throws(()=>selectMilestone({...sale(1000),creatorId:''}))});
test('first animation and replay are explicitly scoped',()=>{const e=selectMilestone(sale(1000));assert.equal(e.animationId,'purple-rabbit-beans-hole-v1');assert.equal(e.replayPolicy,'creator-opt-in-generated-animation-only');assert.equal(e.eventId,'page-sale-milestone:1000')});
