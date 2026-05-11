import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Send, User as UserIcon, Shield } from 'lucide-react';

// Import House Shields
import phoenixShield from '../assets/shields/phoenix.jpg';
import unicorniusShield from '../assets/shields/unicornius.jpg';
import hipocampusShield from '../assets/shields/hipocampus.jpg';
import viperaShield from '../assets/shields/vipera.jpg';

const HouseChat = () => {
    const { gameState, sendMessage } = useGame();
    const { currentUser, houseChats = {} } = gameState;
    const [activeHouse, setActiveHouse] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const messagesEndRef = useRef(null);

    // Determine which houses user can access
    const accessibleHouses = currentUser?.role === 'director'
        ? ['phoenix', 'vipera', 'unicornius', 'hipocampus']
        : [currentUser?.house];

    // Set initial active house
    useEffect(() => {
        if (!activeHouse && accessibleHouses.length > 0) {
            setActiveHouse(accessibleHouses[0]);
        }
    }, [accessibleHouses, activeHouse]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [houseChats[activeHouse]]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !activeHouse) return;

        sendMessage(activeHouse, messageInput.trim());
        setMessageInput('');
    };

    const houseNames = {
        phoenix: 'Phoenix',
        vipera: 'Vipera',
        unicornius: 'Unicornius',
        hipocampus: 'Hipocampus'
    };

    const houseColors = {
        phoenix: { bg: '#2c0b0e', accent: '#e74c3c', text: '#ecf0f1', shield: phoenixShield },
        vipera: { bg: '#0f291e', accent: '#27ae60', text: '#ecf0f1', shield: viperaShield },
        unicornius: { bg: '#2c2c54', accent: '#9b59b6', text: '#ecf0f1', shield: unicorniusShield },
        hipocampus: { bg: '#1a3c5e', accent: '#3498db', text: '#ecf0f1', shield: hipocampusShield }
    };

    if (!currentUser) return null;
    if (!activeHouse) return <div>Cargando...</div>;

    const userHouse = activeHouse; // The currently active house for chat
    // Fallback if house not found (guest/director)
    const currentTheme = houseColors[userHouse] || houseColors.phoenix;

    const messages = houseChats[activeHouse] || [];

    return (
        <div style={{
            minHeight: '100vh',
            // Default bg if specific house image fails
            backgroundImage: `url(/house-rooms/${activeHouse}.jpg), linear-gradient(to bottom, #111, #222)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            position: 'relative'
        }}>
            {/* Dark overlay for readability */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                {/* House selector tabs (if director) */}
                {currentUser.role === 'director' && (
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        {accessibleHouses.map(house => (
                            <button
                                key={house}
                                onClick={() => setActiveHouse(house)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: activeHouse === house ? houseColors[house].accent : 'rgba(0,0,0,0.6)',
                                    color: 'white',
                                    border: `2px solid ${houseColors[house].accent}`,
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                            >
                                {houseNames[house]}
                            </button>
                        ))}
                    </div>
                )}

                {/* Chat header */}
                <div className="card magic-border" style={{
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    background: 'rgba(0,0,0,0.8)',
                    borderColor: currentTheme.accent,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem'
                }}>
                    <img
                        src={currentTheme.shield}
                        alt={`Escudo de ${userHouse}`}
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.2))'
                        }}
                    />
                    <div>
                        <h2 style={{
                            margin: 0,
                            color: currentTheme.accent,
                            fontFamily: 'var(--font-serif)',
                            fontSize: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            Sala Común de {houseNames[activeHouse]}
                        </h2>
                        <p style={{ margin: 0, color: '#ccc', fontSize: '1.1rem' }}>
                            Conecta con tus compañeros de la casa {houseNames[activeHouse]}
                        </p>
                    </div>
                </div>

                {/* Messages container */}
                <div className="card" style={{
                    height: '60vh',
                    overflowY: 'auto',
                    padding: '1.5rem',
                    background: 'rgba(0,0,0,0.8)',
                    marginBottom: '1rem',
                    border: '1px solid #444'
                }}>
                    {messages.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
                            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} style={{
                                display: 'flex',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                alignItems: 'flex-start'
                            }}>
                                <img
                                    src={msg.avatar}
                                    alt={msg.userName}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: `2px solid ${houseColors[activeHouse].accent}`
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 'bold', color: houseColors[activeHouse].accent }}>
                                            {msg.userName}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: '#777' }}>
                                            {new Date(msg.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, color: 'white', lineHeight: '1.5' }}>
                                        {msg.text}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="card" style={{
                    padding: '1rem',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    gap: '1rem',
                    border: '1px solid #444'
                }}>
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Escribe tu mensaje magico..."
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: '#222',
                            border: `1px solid ${houseColors[activeHouse].accent}`,
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        style={{
                            padding: '0 2rem',
                            background: houseColors[activeHouse].accent,
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                            opacity: messageInput.trim() ? 1 : 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            fontSize: '1.1rem'
                        }}
                    >
                        <Send size={20} /> Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HouseChat;
