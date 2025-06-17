// src/utils/analytics.js
'use client';

import { track } from '@vercel/analytics/react';

export const trackEvent = (eventName, eventData) => {
  track(eventName, eventData);
};
