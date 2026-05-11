import React from 'react';
import { useGame } from '../context/GameContext';
import { Megaphone } from 'lucide-react';

const NoticeBoard = () => {
    const { gameState } = useGame();
    const { noticeBoard } = gameState;

    if (!noticeBoard || !noticeBoard.active || !noticeBoard.message) return null;

    return (
        <div key={noticeBoard.lastUpdated} className="card magic-border" style={{
            marginTop: '1rem',
            marginBottom: '2rem',
            background: 'linear-gradient(90deg, rgba(80, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)', // Slight red/dark gradient for attention
            borderLeft: '4px solid var(--color-gold)',
            display: 'flex',
            alignItems: 'start',
            gap: '1.5rem',
            animation: 'fadeIn 0.5s ease'
        }}>
            <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                padding: '0.8rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Megaphone size={32} color="var(--color-gold)" style={{ transform: 'rotate(-15deg)' }} />
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{
                    margin: '0 0 0.5rem',
                    fontFamily: 'var(--font-serif)',
                    color: 'var(--color-gold)',
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Anuncio del Director
                </h3>
                <p style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    color: '#eee',
                    whiteSpace: 'pre-wrap', // Preserve line breaks
                    fontStyle: 'italic'
                }}>
                    "{noticeBoard.message}"
                </p>
                <div style={{
                    marginTop: '1rem',
                    fontSize: '0.8rem',
                    color: '#aaa',
                    textAlign: 'right'
                }}>
                    Publicado: {new Date(noticeBoard.lastUpdated).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default NoticeBoard;
