import React from 'react';
import { X } from 'lucide-react';

const HouseModal = ({ house, onClose }) => {
    if (!house) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(5px)',
            zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={onClose}>
            <div style={{
                background: '#1a1a2e',
                border: `2px solid ${house.color}`,
                boxShadow: `0 0 30px ${house.color}40`, // 40 is hex opacity
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '500px',
                width: '90%',
                position: 'relative',
                animation: 'scaleIn 0.3s ease'
            }} onClick={e => e.stopPropagation()}>

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute', top: '1rem', right: '1rem',
                        background: 'transparent', border: 'none', color: house.color, cursor: 'pointer'
                    }}
                >
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: house.color, fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {house.name}
                    </h2>
                    <div style={{ width: '100px', height: '2px', background: house.color, margin: '0 auto' }}></div>
                </div>

                <div style={{ color: '#e0e7ff', lineHeight: '1.6', fontSize: '1.1rem' }}>
                    <p style={{ marginBottom: '1rem' }}><strong>Valores:</strong> {house.values}</p>
                    <p style={{ marginBottom: '1rem' }}><strong>Elemento:</strong> {house.element}</p>
                    <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>"{house.description}"</p>
                </div>

                <div style={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#94a3b8',
                    marginTop: '2rem',
                    borderTop: '1px solid #334155',
                    paddingTop: '1rem'
                }}>
                    Origen: Fundada por los grandes archimagos de la era estelar.
                </div>
            </div>
            <style>{`
                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default HouseModal;
