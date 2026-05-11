import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

const AdminGate = ({ onUnlock }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleInput = (num) => {
        if (pin.length < 6) {
            setPin(prev => prev + num);
            setError(false);
        }
    };

    const handleClear = () => {
        setPin('');
        setError(false);
    };

    const handleSubmit = () => {
        if (pin === '121179') {
            onUnlock();
        } else {
            setError(true);
            setPin('');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh'
        }}>
            <div className="card magic-border" style={{ width: '300px', padding: '2rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    {error ? <Lock color="var(--color-danger)" size={40} /> : <Lock color="var(--color-gold)" size={40} />}
                </div>

                <h3 style={{ marginBottom: '1.5rem' }}>Acceso Restringido</h3>

                <div style={{
                    background: '#333',
                    padding: '1rem',
                    fontSize: '1.5rem',
                    letterSpacing: '0.5rem',
                    marginBottom: '1.5rem',
                    borderRadius: 'var(--radius-sm)',
                    minHeight: '3rem',
                    fontFamily: 'monospace'
                }}>
                    {'*'.repeat(pin.length)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button
                            key={num}
                            onClick={() => handleInput(num)}
                            style={{
                                padding: '1rem',
                                fontSize: '1.2rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid #444',
                                borderRadius: 'var(--radius-sm)',
                                color: 'white'
                            }}
                        >
                            {num}
                        </button>
                    ))}
                    <button onClick={handleClear} style={{ background: 'var(--color-danger)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'white' }}>C</button>
                    <button onClick={() => handleInput(0)} style={{ padding: '1rem', fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid #444', borderRadius: 'var(--radius-sm)', color: 'white' }}>0</button>
                    <button onClick={handleSubmit} style={{ background: 'var(--color-vipera)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'white' }}>
                        <Unlock size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminGate;
