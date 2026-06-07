import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Send, MessageSquare, Users, ChevronDown } from 'lucide-react';

const DirectMessages = () => {
    const { gameState, sendDirectMessage, markDirectMessageRead, isViewingAsUser } = useGame();
    const { currentUser, directMessages = [], students } = gameState;
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [showAllStudents, setShowAllStudents] = useState(false);
    const messagesEndRef = useRef(null);

    if (!currentUser) return null;

    const isDirector = currentUser?.role === 'director' && !isViewingAsUser;

    // Find director's actual ID from students list
    const directorStudent = students.find(s => s.role === 'director');
    const directorId = directorStudent?.id || 999;

    // Active conversation target:
    // If student, the target is always the director.
    // If director, it's the selected student.
    const chatPartnerId = isDirector ? selectedStudentId : directorId;

    const chatMessages = chatPartnerId ? directMessages.filter(msg =>
        (msg.senderId === currentUser.id && msg.recipientId === chatPartnerId) ||
        (msg.senderId === chatPartnerId && msg.recipientId === currentUser.id)
    ) : [];

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        // Mark as read
        if (chatPartnerId && currentUser) {
            chatMessages.forEach(msg => {
                if (msg.recipientId === currentUser.id && !msg.read) {
                    markDirectMessageRead(msg.id);
                }
            });
        }
    }, [chatMessages.length, chatPartnerId, currentUser?.id]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !chatPartnerId) return;
        sendDirectMessage(chatPartnerId, messageInput.trim());
        setMessageInput('');
    };

    // For Director: List ALL students (not just those with existing messages)
    const allStudentContacts = isDirector
        ? students.filter(s => s.role !== 'director' && s.role !== 'guardian')
        : [];

    // Students who already have messages (highlighted at top)
    const studentsWithMessages = allStudentContacts.filter(s =>
        directMessages.some(m => m.senderId === s.id || m.recipientId === s.id)
    );
    const studentsWithoutMessages = allStudentContacts.filter(s =>
        !directMessages.some(m => m.senderId === s.id || m.recipientId === s.id)
    );

    const displayedContacts = showAllStudents
        ? allStudentContacts
        : studentsWithMessages;

    return (
        <div style={{ display: 'flex', height: '70vh', background: 'rgba(0,0,0,0.8)', border: '1px solid var(--color-gold)', borderRadius: '12px', overflow: 'hidden' }}>

            {/* Sidebar for Director */}
            {isDirector && (
                <div style={{ width: '280px', borderRight: '1px solid #444', background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #444', color: 'var(--color-gold)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>Bandeja de Entrada</span>
                        <button
                            onClick={() => setShowAllStudents(p => !p)}
                            title={showAllStudents ? 'Ver solo mensajes' : 'Ver todos los alumnos'}
                            style={{
                                background: showAllStudents ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.1)',
                                border: '1px solid #555',
                                borderRadius: '4px',
                                color: showAllStudents ? 'var(--color-gold)' : '#ccc',
                                cursor: 'pointer',
                                padding: '0.2rem 0.5rem',
                                fontSize: '0.75rem',
                                display: 'flex', alignItems: 'center', gap: '0.3rem'
                            }}
                        >
                            <Users size={12} />
                            {showAllStudents ? 'Mensajes' : 'Todos'}
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {displayedContacts.length === 0 ? (
                            <div style={{ padding: '2rem 1rem', color: '#888', textAlign: 'center', fontSize: '0.85rem' }}>
                                {showAllStudents ? 'Sin alumnos.' : (
                                    <>
                                        <p>No hay mensajes aún.</p>
                                        <button
                                            onClick={() => setShowAllStudents(true)}
                                            style={{ background: 'none', border: '1px solid #555', color: '#aaa', borderRadius: '4px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Iniciar nueva conversación
                                        </button>
                                    </>
                                )}
                            </div>
                        ) : (
                            displayedContacts.map(student => {
                                const unreadCount = directMessages.filter(m =>
                                    m.senderId === student.id &&
                                    m.recipientId === currentUser.id &&
                                    !m.read
                                ).length;
                                const hasMessages = studentsWithMessages.some(s => s.id === student.id);
                                return (
                                    <div
                                        key={student.id}
                                        onClick={() => setSelectedStudentId(student.id)}
                                        style={{
                                            padding: '0.85rem 1rem',
                                            borderBottom: '1px solid #333',
                                            cursor: 'pointer',
                                            background: selectedStudentId === student.id
                                                ? 'rgba(255,215,0,0.12)'
                                                : unreadCount > 0 ? 'rgba(255,215,0,0.05)' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <img
                                            src={student.avatar}
                                            alt={student.name}
                                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `2px solid var(--color-${student.house})` }}
                                        />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{
                                                fontWeight: unreadCount > 0 ? 'bold' : 'normal',
                                                color: unreadCount > 0 ? 'white' : '#ccc',
                                                fontSize: '0.9rem',
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                            }}>{student.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: `var(--color-${student.house})`, textTransform: 'capitalize' }}>
                                                {student.house}{!hasMessages ? ' · Sin mensajes' : ''}
                                            </div>
                                        </div>
                                        {unreadCount > 0 && (
                                            <div style={{
                                                background: 'var(--color-danger)', color: 'white',
                                                borderRadius: '50%', width: '20px', height: '20px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0
                                            }}>
                                                {unreadCount}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Main Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!chatPartnerId ? (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', flexDirection: 'column', gap: '1rem' }}>
                        <MessageSquare size={48} opacity={0.5} />
                        <div style={{ textAlign: 'center' }}>
                            {isDirector ? 'Selecciona un alumno para ver el chat' : 'Cargando chat con el Director...'}
                        </div>
                        {/* Student: automatically show director chat — if directorId is missing, show warning */}
                        {!isDirector && !directorId && (
                            <div style={{ color: '#e74c3c', fontSize: '0.85rem' }}>
                                El Director aún no está configurado en el sistema.
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{
                            padding: '1rem',
                            borderBottom: '1px solid #444',
                            background: 'rgba(0,0,0,0.4)',
                            display: 'flex', alignItems: 'center', gap: '1rem'
                        }}>
                            {isDirector ? (
                                (() => {
                                    const partner = students.find(s => s.id === selectedStudentId);
                                    return partner ? (
                                        <>
                                            <img src={partner.avatar} alt={partner.name}
                                                style={{ width: '36px', height: '36px', borderRadius: '50%', border: `2px solid var(--color-${partner.house})` }} />
                                            <h3 style={{ margin: 0, color: 'var(--color-gold)' }}>{partner.name}</h3>
                                        </>
                                    ) : null;
                                })()
                            ) : (
                                <>
                                    {directorStudent && (
                                        <img src={directorStudent.avatar || gameState.directorStats?.avatar}
                                            alt="Director"
                                            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--color-gold)' }} />
                                    )}
                                    <h3 style={{ margin: 0, color: 'var(--color-gold)' }}>Despacho del Director</h3>
                                </>
                            )}
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {chatMessages.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem', fontSize: '0.9rem' }}>
                                    ✉️ Escribe el primer mensaje...
                                </div>
                            ) : (
                                chatMessages.map(msg => {
                                    const isMine = msg.senderId === currentUser.id;
                                    return (
                                        <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                                            <div style={{
                                                maxWidth: '70%',
                                                background: isMine ? 'linear-gradient(135deg, var(--color-gold), #b8860b)' : 'rgba(255,255,255,0.08)',
                                                color: isMine ? 'black' : 'white',
                                                padding: '0.8rem 1.2rem',
                                                borderRadius: '12px',
                                                borderBottomRightRadius: isMine ? '2px' : '12px',
                                                borderBottomLeftRadius: isMine ? '12px' : '2px',
                                                boxShadow: isMine ? '0 2px 8px rgba(212,175,55,0.3)' : 'none',
                                                border: isMine ? 'none' : '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                <div style={{ fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '0.3rem' }}>{msg.text}</div>
                                                <div style={{ fontSize: '0.7rem', opacity: 0.6, textAlign: 'right' }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} style={{
                            padding: '1rem',
                            borderTop: '1px solid #444',
                            display: 'flex',
                            gap: '0.75rem',
                            background: 'rgba(0,0,0,0.6)'
                        }}>
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Escribe un mensaje al Director..."
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #555',
                                    background: '#1a1a1a',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!messageInput.trim()}
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    background: messageInput.trim()
                                        ? 'linear-gradient(135deg, var(--color-gold), #b8860b)'
                                        : '#333',
                                    color: messageInput.trim() ? 'black' : '#666',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.2s',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <Send size={16} /> Enviar
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default DirectMessages;
