import React from 'react';
import { CallLogForm } from './CallLogForm';
import { CallLogFeed } from './CallLogFeed';

export const CallsTab = (props) => (
  <div className="space-y-4">
    <CallLogForm {...props} />

    {/* Call Logs Feed with WhatsApp Audio Playback */}
    <CallLogFeed lead={props.lead} />
  </div>
);
