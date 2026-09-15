import React, { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api/config';

// Whether the laptop's test runner is connected to the backend. The runner
// dials out to the backend by itself, so this only reports it.
const dot = (color) => ({
    width: '9px', height: '9px', borderRadius: '50%', backgroundColor: color, flexShrink: 0,
});

const label = {
    fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.03em',
};

export default function RunnerStatus() {
    const [status, setStatus] = useState(null);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/runner/status`);
            setStatus(res.ok ? await res.json() : null);
        } catch {
            setStatus(null);
        }
    }, []);

    useEffect(() => {
        refresh();
        const id = setInterval(refresh, 5000);
        return () => clearInterval(id);
    }, [refresh]);

    const connected = !!status?.connected;

    return (
        <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={dot(connected ? '#059669' : '#DC2626')} />
                <span style={label}>TEST RUNNER</span>
                <span style={{ fontSize: '0.75rem', color: connected ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {connected ? `${status.runner} · connected` : 'not connected'}
                </span>
            </div>
            {!connected && (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    On the laptop, run <code>python -m runner</code> in the automation-testing repo,
                    with <code>BACKEND_URL</code> set to this backend.
                </div>
            )}
        </div>
    );
}
