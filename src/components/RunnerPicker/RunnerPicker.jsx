import React, { useCallback, useEffect, useState } from 'react';
import { API_BASE_URL } from '../../api/config';

// The laptops whose test runner is connected to the backend, and which one this
// screen runs on. Each laptop's runner dials out by itself; this lists and picks.
const dot = (color) => ({
    width: '9px', height: '9px', borderRadius: '50%', backgroundColor: color, flexShrink: 0,
});

const label = {
    fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.03em',
};

const describe = (runner) => [
    runner.id,
    runner.device ? runner.device : 'no phone',
    runner.busy ? 'busy' : null,
].filter(Boolean).join(' · ');

export default function RunnerPicker({ value, onChange, disabled = false }) {
    const [runners, setRunners] = useState([]);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/runner/status`);
            setRunners(res.ok ? ((await res.json()).runners || []) : []);
        } catch {
            setRunners([]);
        }
    }, []);

    useEffect(() => {
        refresh();
        const id = setInterval(refresh, 5000);
        return () => clearInterval(id);
    }, [refresh]);

    // With a single laptop there is nothing to choose.
    useEffect(() => {
        if (!value && runners.length === 1) onChange(runners[0].id);
    }, [runners, value, onChange]);

    const selected = runners.find((r) => r.id === value);
    const summary = selected
        ? (selected.device_connected ? 'phone connected' : 'no phone on this laptop')
        : runners.length
            ? `${runners.length} laptop${runners.length > 1 ? 's' : ''} online — choose one`
            : 'no laptops connected';

    return (
        <div className="dashboard-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={dot(selected ? '#059669' : '#DC2626')} />
                <span style={label}>TEST RUNNER</span>
                <span style={{ fontSize: '0.75rem', color: selected ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
                    {summary}
                </span>
            </div>
            {runners.length > 0 ? (
                <select
                    className="text-input"
                    value={selected ? value : ''}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    aria-label="Laptop to run tests on"
                    style={{ marginTop: '10px' }}
                >
                    {!selected && (
                        <option value="">{value ? `${value} is offline — choose a laptop` : 'Choose a laptop'}</option>
                    )}
                    {runners.map((r) => <option key={r.id} value={r.id}>{describe(r)}</option>)}
                </select>
            ) : (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Start the runner on a laptop (<code>python -m runner</code> in the automation-testing repo,
                    or its auto-start task) with <code>BACKEND_URL</code> set to this backend.
                </div>
            )}
        </div>
    );
}
