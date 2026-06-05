import React, { useState } from 'react';
import { PartyPopper, Send, Trash2, User } from 'lucide-react';
import { useGame } from '../context/GameContext';

const CelebrationBoard = () => {
    const { gameState, postCelebrationMessage, deleteCelebrationMessage } = useGame();
    const { celebrationMessages, currentUser } = gameState;
    const [newMessage, setNewMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser) return;

        postCelebrationMessage({
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: newMessage,
            avatar: currentUser.avatar,
            house: currentUser.house
        });
        setNewMessage('');
    };

    const getHouseColor = (house) => {
        const colors = {
            phoenix: '#e74c3c',
            hipocampus: '#3498db',
            unicornius: '#f1c40f',
            vipera: '#2ecc71',
            default: '#999'
        };
        return colors[house] || colors.default;
    };

    return (
        <div className="card magic-border" style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: '2px solid #7c3aed',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <PartyPopper size={28} color="#7c3aed" />
                <h2 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: '#a78bfa' }}>Tablón de Celebración</h2>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
                ¡Deja un mensaje lindo para compartir la alegría con toda la escuela! ✨
            </p>

            {/* Message Input */}
            {currentUser && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe algo lindo..."
                        style={{
                            flex: 1,
                            background: '#0f172a',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: 'white',
                            fontSize: '0.9rem'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: '#7c3aed',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Send size={18} />
                    </button>
                </form>
            )}

            {/* Messages List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '0.5rem'
            }}>
                {celebrationMessages?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#475569', fontStyle: 'italic', padding: '2rem' }}>
                        Aún no hay mensajes... ¡Sé el primero!
                    </div>
                ) : (
                    celebrationMessages?.map((msg) => (
                        <div key={msg.id} style={{
                            background: 'rgba(15, 23, 42, 0.6)',
                            border: `1px solid ${getHouseColor(msg.house)}44`,
                            borderRadius: '12px',
                            padding: '1rem',
                            display: 'flex',
                            gap: '1rem',
                            position: 'relative'
                        }}>
                            <img
                                src={msg.avatar}
                                alt={msg.senderName}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: `2px solid ${getHouseColor(msg.house)}`
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: 'bold', color: getHouseColor(msg.house), fontSize: '0.9rem' }}>
                                        {msg.senderName}
                                    </span>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.4' }}>
                                    {msg.text}
                                </p>
                            </div>

                            {/* Delete Button (Director Only) */}
                            {currentUser?.role === 'director' && (
                                <button
                                    onClick={() => deleteCelebrationMessage(msg.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        background: 'rgba(231, 76, 60, 0.1)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#e74c3c',
                                        cursor: 'pointer'
                                    }}
                                    title="Borrar Mensaje"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CelebrationBoard;
