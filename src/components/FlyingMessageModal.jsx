import React, { useState } from 'react';
import { Send, X, Feather } from 'lucide-react';
import { useGame } from '../context/GameContext';

const FlyingMessageModal = ({ isOpen, onClose }) => {
    const { gameState, sendFlyingMessage } = useGame();
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        sendFlyingMessage({
            senderId: gameState.currentUser.id,
            senderName: gameState.currentUser.name,
            text: message,
            avatar: gameState.currentUser.avatar
        });

        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            setMessage('');
            onClose();
        }, 3000);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)'
        }}>
            <div className="card magic-border" style={{
                width: '90%',
                maxWidth: '400px',
                padding: '2rem',
                position: 'relative',
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #1e1e1e, #121212)',
                border: '2px solid var(--color-gold)'
            }}>
                {!isSent ? (
                    <>
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: '#888',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        <Feather size={40} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Mensaje Volador</h2>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Envía un mensaje personal al Magister Ludi. Solo él podrá leerlo.
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu mensaje aquí..."
                                style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    background: '#0a0a0a',
                                    border: '1px solid #444',
                                    borderRadius: '8px',
                                    color: 'white',
                                    padding: '1rem',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit',
                                    resize: 'none'
                                }}
                                required
                            />
                            <button
                                type="submit"
                                className="button-primary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem'
                                }}
                            >
                                <Send size={18} /> ENVIAR AL DIRECTOR
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ padding: '2rem' }}>
                        <div style={{
                            animation: 'fly-away 3s forwards',
                            display: 'inline-block'
                        }}>
                            <Feather size={60} color="var(--color-gold)" />
                        </div>
                        <h3 style={{ color: 'var(--color-gold)', marginTop: '1rem' }}>¡Mensaje Enviado!</h3>
                        <p style={{ color: '#aaa' }}>Tu mensaje vuela hacia la torre del Director...</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fly-away {
                    0% { transform: translate(0, 0) scale(1); opacity: 1; }
                    30% { transform: translate(50px, -50px) scale(1.1); opacity: 1; }
                    100% { transform: translate(500px, -500px) scale(0.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default FlyingMessageModal;
