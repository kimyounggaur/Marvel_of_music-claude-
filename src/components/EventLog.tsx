import React from 'react';

interface Props {
  logs: string[];
}

export const EventLog: React.FC<Props> = ({ logs }) => (
  <div className="event-log" aria-label="이벤트 기록">
    {logs.length === 0
      ? <div style={{ color: '#aaa' }}>아직 이벤트가 없어요.</div>
      : logs.map((log, i) => (
        <div key={i} className="event-log__item">{log}</div>
      ))
    }
  </div>
);
