import { useEffect, useState } from 'react';

const AdModal = ({ duration, onComplete, onClose }) => {
  const [seconds, setSeconds] = useState(duration);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  return (
    <div className="ad-modal-overlay">
      <div className="ad-modal">
        <p className="meta-label">SPONSORED AD</p>
        <h2>Watch to earn +10 DP</h2>
        <p className="text-secondary" style={{ marginTop: 8 }}>
          This is a mock ad placeholder. A real ad will be shown once a provider is connected.
        </p>

        <div className="ad-timer">
          {seconds > 0 ? `Reward in ${seconds}s` : 'Reward ready'}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            className="btn btn-primary"
            disabled={seconds > 0}
            onClick={onComplete}
          >
            Claim Reward
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdModal;