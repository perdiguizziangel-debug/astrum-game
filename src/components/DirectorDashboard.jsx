import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { resizeImage } from '../utils/imageUtils';
import { QrCode, UserPlus, Star, Link as LinkIcon, Trash2, Edit, X, Save, Camera, Sparkles, Feather, Zap, ToggleLeft, ToggleRight, ArrowUpDown, ChevronUp, ChevronDown, Scroll, BookOpen, Mail, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import HouseCupHistory from './HouseCupHistory';

const ChallengeCreatorForm = ({ onSubmit }) => {
    const { gameState } = useGame();
    const [type, setType] = useState('text');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const [image, setImage] = useState(gameState.dailyChallenge?.image || null);
    const challengeImageRef = useRef(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const resized = await resizeImage(file, 800, 800);
            setImage(resized);
        } catch (err) {
            console.error("Error resizing image:", err);
            alert("Error al procesar la imagen.");
        }
    };

    const handleSubmit = () => {
        if (!question || !correctAnswer) return alert("Completa la pregunta y la respuesta correcta.");

        onSubmit({
            type,
            question,
            options: type === 'choice' ? options : [],
            correctAnswer,
            image,
            active: true,
            id: Date.now()
        });

        // Visual feedback instead of alert
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        setShowSuccess(true);
        setQuestion('');
        setCorrectAnswer('');
        setOptions(['', '', '']);
        // Image stays fixed until changed

        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Pregunta / Desafío</label>
                <input
                    type="text"
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    placeholder="Escribe la consigna..."
                    style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid #444', color: 'white', borderRadius: '4px' }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <div style={{
                    width: '60px', height: '60px', borderRadius: '8px',
                    border: '1px dashed #ca8a04', background: '#111',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {image ? (
                        <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Camera size={20} color="#854d0e" />
                    )}
                </div>
                <div>
                    <button
                        onClick={() => challengeImageRef.current.click()}
                        style={{
                            padding: '0.4rem 0.8rem', background: '#111',
                            border: '1px solid #854d0e', color: '#eab308',
                            borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem'
                        }}
                    >
                        Imagen del Desafío
                    </button>
                    <input
                        type="file"
                        ref={challengeImageRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" checked={type === 'text'} onChange={() => setType('text')} />
                    Respuesta Corta
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" checked={type === 'choice'} onChange={() => setType('choice')} />
                    Múltiple Choice (3 Opciones)
                </label>
            </div>

            {type === 'choice' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    {options.map((opt, idx) => (
                        <input
                            key={idx}
                            type="text"
                            value={opt}
                            onChange={e => {
                                const newOpts = [...options];
                                newOpts[idx] = e.target.value;
                                setOptions(newOpts);
                            }}
                            placeholder={`Opción ${idx + 1}`}
                            style={{ padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '4px' }}
                        />
                    ))}
                </div>
            )}

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                    {type === 'choice' ? 'Respuesta Correcta (debe coincidir exactamente con una opción)' : 'Respuesta Correcta (Frase exacta)'}
                </label>
                <input
                    type="text"
                    value={correctAnswer}
                    onChange={e => setCorrectAnswer(e.target.value)}
                    placeholder="Respuesta secreta..."
                    style={{ width: '100%', padding: '0.8rem', background: '#222', border: '1px solid var(--color-gold-dim)', color: 'var(--color-gold)', borderRadius: '4px' }}
                />
            </div>

            <button onClick={handleSubmit} className="button-primary" style={{ marginTop: '1rem' }}>
                PUBLICAR DESAFÍO
            </button>
            {showSuccess && (
                <div style={{
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    background: 'rgba(46, 204, 113, 0.2)',
                    border: '1px solid #2ecc71',
                    color: '#2ecc71',
                    borderRadius: '4px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    ✨ ¡Desafío publicado en el Hall Central! ✨
                </div>
            )}
        </div>
    );
};

// --- Subcomponent: Arcane Glossary Editor ---
const ArcaneGlossaryEditor = () => {
    const { gameState, updateArcaneGlossary } = useGame();
    const [glossary, setGlossary] = React.useState(gameState.arcaneGlossary || []);
    const [newTerm, setNewTerm] = React.useState('');
    const [newDesc, setNewDesc] = React.useState('');
    const [editingId, setEditingId] = React.useState(null);
    const [editTerm, setEditTerm] = React.useState('');
    const [editDesc, setEditDesc] = React.useState('');

    const inputStyle = {
        background: '#1a1a2e', border: '1px solid #555', color: 'white',
        padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', outline: 'none'
    };

    const handleAdd = () => {
        if (!newTerm.trim() || !newDesc.trim()) return;
        const updated = [...glossary, { id: Date.now(), term: newTerm.trim(), description: newDesc.trim() }];
        setGlossary(updated);
        updateArcaneGlossary(updated);
        setNewTerm('');
        setNewDesc('');
    };

    const handleDelete = (id) => {
        const updated = glossary.filter(g => g.id !== id);
        setGlossary(updated);
        updateArcaneGlossary(updated);
    };

    const startEdit = (g) => {
        setEditingId(g.id);
        setEditTerm(g.term);
        setEditDesc(g.description);
    };

    const saveEdit = () => {
        const updated = glossary.map(g => g.id === editingId ? { ...g, term: editTerm, description: editDesc } : g);
        setGlossary(updated);
        updateArcaneGlossary(updated);
        setEditingId(null);
    };

    return (
        <div className="card" style={{ border: '1px solid #c084fc', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#c084fc' }}>
                <Scroll size={20} />
                <h3 style={{ margin: 0 }}>Glosario Arcano</h3>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888' }}>{glossary.length} términos</span>
            </div>

            {/* Add new term */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
                <input value={newTerm} onChange={e => setNewTerm(e.target.value)} placeholder="Término (ej: Aethelgard)" style={inputStyle} />
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Descripción del término mágico..." style={inputStyle} />
                <button
                    onClick={handleAdd}
                    disabled={!newTerm.trim() || !newDesc.trim()}
                    style={{
                        padding: '0.5rem 0.75rem', background: '#7c3aed', border: 'none',
                        color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                        opacity: (!newTerm.trim() || !newDesc.trim()) ? 0.5 : 1
                    }}
                >
                    <PlusCircle size={16} /> Añadir
                </button>
            </div>

            {/* List of terms */}
            <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {glossary.length === 0 ? (
                    <div style={{ color: '#666', textAlign: 'center', padding: '1rem', fontStyle: 'italic' }}>
                        El Glosario está vacío. Añade términos mágicos para que los alumnos los usen en sus relatos.
                    </div>
                ) : glossary.map(g => (
                    <div key={g.id} style={{
                        background: 'rgba(192, 132, 252, 0.08)', border: '1px solid #3d2060',
                        borderRadius: '8px', padding: '0.75rem'
                    }}>
                        {editingId === g.id ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <input value={editTerm} onChange={e => setEditTerm(e.target.value)} style={inputStyle} />
                                <input value={editDesc} onChange={e => setEditDesc(e.target.value)} style={inputStyle} />
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={saveEdit} style={{ padding: '0.3rem 0.75rem', background: '#2ecc71', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <Save size={14} /> Guardar
                                    </button>
                                    <button onClick={() => setEditingId(null)} style={{ padding: '0.3rem 0.75rem', background: '#555', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                        <X size={14} /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                                <div>
                                    <span style={{ color: '#c084fc', fontWeight: 'bold', fontSize: '0.9rem' }}>{g.term}</span>
                                    <span style={{ color: '#999', margin: '0 0.5rem' }}>—</span>
                                    <span style={{ color: '#ccc', fontSize: '0.85rem' }}>{g.description}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                                    <button onClick={() => startEdit(g)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}><Edit size={14} /></button>
                                    <button onClick={() => handleDelete(g.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Subcomponent: Director Messages Panel ---
const DirectorMessagesPanel = () => {
    const { gameState, sendDirectMessage, markDirectMessageRead } = useGame();
    const { directMessages = [], students, currentUser } = gameState;
    const [selectedStudentId, setSelectedStudentId] = React.useState(null);
    const [messageInput, setMessageInput] = React.useState('');
    const messagesEndRef = React.useRef(null);

    const studentContacts = students.filter(s => s.role !== 'director' && s.role !== 'guardian');

    const chatMessages = selectedStudentId ? directMessages.filter(msg =>
        (msg.senderId === currentUser.id && msg.recipientId === selectedStudentId) ||
        (msg.senderId === selectedStudentId && msg.recipientId === currentUser.id)
    ) : [];

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        chatMessages.forEach(msg => {
            if (msg.recipientId === currentUser.id && !msg.read) {
                markDirectMessageRead(msg.id);
            }
        });
    }, [chatMessages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedStudentId) return;
        sendDirectMessage(selectedStudentId, messageInput.trim());
        setMessageInput('');
    };

    return (
        <div className="card" style={{ border: '1px solid var(--color-gold)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>
                <Mail size={20} />
                <h3 style={{ margin: 0 }}>Mensajes Directos</h3>
            </div>
            <div style={{ display: 'flex', height: '400px', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                {/* Contact list */}
                <div style={{ width: '220px', borderRight: '1px solid #333', overflowY: 'auto', background: 'rgba(0,0,0,0.3)' }}>
                    {studentContacts.map(s => {
                        const unread = directMessages.filter(m => m.senderId === s.id && m.recipientId === currentUser.id && !m.read).length;
                        return (
                            <div
                                key={s.id}
                                onClick={() => setSelectedStudentId(s.id)}
                                style={{
                                    padding: '0.75rem',
                                    borderBottom: '1px solid #2a2a2a',
                                    cursor: 'pointer',
                                    background: selectedStudentId === s.id ? 'rgba(255,215,0,0.08)' : 'transparent',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}
                            >
                                <img src={s.avatar} alt={s.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: unread > 0 ? 'white' : '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: `var(--color-${s.house})`, textTransform: 'capitalize' }}>{s.house}</div>
                                </div>
                                {unread > 0 && (
                                    <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{unread}</span>
                                )}
                            </div>
                        );
                    })}
                    {studentContacts.length === 0 && (
                        <div style={{ padding: '1rem', color: '#666', fontSize: '0.8rem', textAlign: 'center' }}>Sin estudiantes registrados</div>
                    )}
                </div>

                {/* Chat area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {!selectedStudentId ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', flexDirection: 'column', gap: '0.5rem' }}>
                            <Mail size={40} opacity={0.3} />
                            <span style={{ fontSize: '0.85rem' }}>Selecciona un estudiante</span>
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #333', background: 'rgba(0,0,0,0.2)', fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>
                                {students.find(s => s.id === selectedStudentId)?.name}
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {chatMessages.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: '#555', fontSize: '0.85rem', marginTop: '2rem' }}>Sin mensajes aún.</div>
                                ) : chatMessages.map(msg => {
                                    const isMine = msg.senderId === currentUser.id;
                                    return (
                                        <div key={msg.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                                            <div style={{
                                                maxWidth: '75%',
                                                background: isMine ? 'rgba(255,215,0,0.15)' : '#2a2a2a',
                                                border: `1px solid ${isMine ? 'var(--color-gold)' : '#444'}`,
                                                color: 'white', padding: '0.6rem 0.9rem', borderRadius: '10px', fontSize: '0.85rem'
                                            }}>
                                                <div>{msg.text}</div>
                                                <div style={{ fontSize: '0.65rem', color: '#888', textAlign: 'right', marginTop: '0.2rem' }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <form onSubmit={handleSend} style={{ padding: '0.75rem', borderTop: '1px solid #333', display: 'flex', gap: '0.5rem' }}>
                                <input
                                    value={messageInput}
                                    onChange={e => setMessageInput(e.target.value)}
                                    placeholder="Escribe un mensaje al estudiante..."
                                    style={{ flex: 1, padding: '0.6rem', background: '#1a1a2e', border: '1px solid #555', color: 'white', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                                />
                                <button type="submit" disabled={!messageInput.trim()} style={{
                                    padding: '0.6rem 1rem', background: 'var(--color-gold)', border: 'none',
                                    color: 'black', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem',
                                    opacity: messageInput.trim() ? 1 : 0.5
                                }}>Enviar</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const DirectorDashboard = () => {
    const { 
        gameState, addPoints, updateUser, editStudent, deleteStudent, restoreEnergy, advanceSchoolYear, 
        toggleHouseChatStatus, toggleMagicClassroom, updateDirectorStat, closeCycle, 
        startNewCycle, resetDirectorScore, updateNoticeBoard, resetPetStreaks, 
        resetPlantStreaks, setDailyChallenge, setDailyTrivia, triggerEvent, resolveEvent,
        toggleActivity, adjustStudentXP, addHouseCupRecord
    } = useGame();
    const [pointsToAdd, setPointsToAdd] = useState(10);
    const [selectedHouse, setSelectedHouse] = useState('phoenix');
    const [studentToDelete, setStudentToDelete] = useState(null);

    const handleDeleteClick = (student) => {
        setStudentToDelete(student);
    };

    const confirmDelete = () => {
        if (studentToDelete) {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
            showToast('🗑 Estudiante eliminado', '#e74c3c');
        }
    };

    const cancelDelete = () => setStudentToDelete(null);
    const fileInputRef = useRef(null);

    // Toast Feedback
    const [toast, setToast] = useState(null);
    const showToast = (msg, color = '#2ecc71') => {
        setToast({ msg, color });
        setTimeout(() => setToast(null), 2500);
    };

    // Student sort state
    const [sortKey, setSortKey] = useState('name');
    const [sortDir, setSortDir] = useState('asc');
    const handleSort = (key) => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortKey(key); setSortDir('asc'); }
    };
    const sortedStudents = [...(gameState.students || [])].sort((a, b) => {
        let va, vb;
        if (sortKey === 'name') { va = (a.name || '').split(' ').slice(-1)[0].toLowerCase(); vb = (b.name || '').split(' ').slice(-1)[0].toLowerCase(); }
        else if (sortKey === 'house') { va = a.house || ''; vb = b.house || ''; }
        else if (sortKey === 'course') { va = a.course || 0; vb = b.course || 0; }
        else if (sortKey === 'xp') { va = a.xp || 0; vb = b.xp || 0; }
        else { va = ''; vb = ''; }
        if (va < vb) return sortDir === 'asc' ? -1 : 1;
        if (va > vb) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });

    const SortIcon = ({ col }) => {
        if (sortKey !== col) return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
        return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
    };


    const handleAddPoints = () => {
        addPoints(selectedHouse, parseInt(pointsToAdd));
        showToast(`✅ ${pointsToAdd} puntos añadidos a ${selectedHouse}`);
    };

    const handleEditClick = (student) => {
        setEditingStudent({ ...student });
    };

    const handleRoleCourseChange = (val) => {
        if (!editingStudent) return;
        if (val === 'director') {
            setEditingStudent({ ...editingStudent, role: 'director', course: 1 });
        } else if (val === 'graduado') {
            setEditingStudent({ ...editingStudent, role: 'guardian', course: 'graduado' });
        } else {
            setEditingStudent({ ...editingStudent, role: 'student', course: parseInt(val) });
        }
    };

    const handleSaveStudent = () => {
        if (editingStudent) {
            editStudent(editingStudent.id, editingStudent);
            setEditingStudent(null);
        }
    };

    const handleDirectorPhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resized = await resizeImage(file, 300, 300);
                updateDirectorStat('avatar', resized);
            } catch (error) {
                console.error("Resize failed", error);
            }
        }
    };

    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    };
    const modalContentStyle = { background: '#1a1a1a', padding: '2rem', borderRadius: '8px', border: '1px solid #444', width: '300px' };
    const confirmButtonStyle = { padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
    const cancelButtonStyle = { padding: '0.5rem 1rem', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
                    background: toast.color, color: 'black', padding: '0.75rem 1.5rem',
                    borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    animation: 'slideInRight 0.3s ease',
                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}>
                    {toast.msg}
                </div>
            )}
            <style>{`
                @keyframes slideInRight {
                    from { transform: translateX(100px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
            <h2>Panel de Dirección</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* 0. Identity Card */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Camera color="var(--color-gold)" />
                        <h3>Imagen del Magister</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        {/* Director Image */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <img
                                src={gameState.directorStats.avatar}
                                alt="Director"
                                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)' }}
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#333',
                                    border: '1px solid #555',
                                    color: 'white',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Cambiar Foto
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ 
                                    position: 'absolute',
                                    width: '1px',
                                    height: '1px',
                                    padding: '0',
                                    margin: '-1px',
                                    overflow: 'hidden',
                                    clip: 'rect(0,0,0,0)',
                                    border: '0'
                                }}
                                accept="image/*"
                                onChange={handleDirectorPhotoUpload}
                            />
                        </div>

                        {/* Pet Image */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                {gameState.directorStats.pet ? (
                                    <img src={gameState.directorStats.pet} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontSize: '2rem' }}>🐾</span>
                                )}
                            </div>
                            <label style={{
                                padding: '0.5rem 1rem',
                                background: '#333',
                                border: '1px solid #555',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}>
                                Subir Mascota
                                <input
                                    type="file"
                                    style={{ 
                                        position: 'absolute',
                                        width: '1px',
                                        height: '1px',
                                        padding: '0',
                                        margin: '-1px',
                                        overflow: 'hidden',
                                        clip: 'rect(0,0,0,0)',
                                        border: '0'
                                    }}
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            try {
                                                const resized = await resizeImage(file, 200, 200);
                                                updateDirectorStat('pet', resized);
                                            } catch (error) {
                                                console.error("Resize failed", error);
                                            }
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    {/* Pet Name Editor */}
                    <div style={{ width: '100%', marginTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Nombre de la Mascota:</label>
                        <input
                            type="text"
                            value={gameState.directorStats.petName || ''}
                            onChange={(e) => updateDirectorStat('petName', e.target.value)}
                            placeholder="Ej: Hipogrifo"
                            style={{
                                width: '100%', background: '#222', border: '1px solid #444', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    {/* Pet Story Editor */}
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Historia de la Mascota:</label>
                        <textarea
                            value={gameState.directorStats.petStory || ''}
                            onChange={(e) => updateDirectorStat('petStory', e.target.value)}
                            placeholder="Describe a la criatura..."
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                background: '#222',
                                border: '1px solid #444',
                                color: 'white',
                                padding: '0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <button
                        onClick={() => {
                            if (confirm('¿Resetear todos los niveles de la Mascota del Mes?')) {
                                resetPetStreaks();
                                alert('Niveles reseteados');
                            }
                        }}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Resetear Niveles Mascota
                    </button>
                </div>

                {/* Plant of the Month */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Camera color="var(--color-gold)" />
                        <h3>Planta del Mes</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px dashed #4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {gameState.directorStats.plant ? (
                                <img src={gameState.directorStats.plant} alt="Plant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem' }}>🌿</span>
                            )}
                        </div>
                        <label style={{
                            padding: '0.5rem 1rem',
                            background: '#333',
                            border: '1px solid #555',
                            color: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}>
                            Subir Planta
                            <input
                                type="file"
                                style={{ 
                                    position: 'absolute',
                                    width: '1px',
                                    height: '1px',
                                    padding: '0',
                                    margin: '-1px',
                                    overflow: 'hidden',
                                    clip: 'rect(0,0,0,0)',
                                    border: '0'
                                }}
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            const resized = await resizeImage(file, 200, 200);
                                            updateDirectorStat('plant', resized);
                                        } catch (error) {
                                            console.error("Resize failed", error);
                                        }
                                    }
                                }}
                            />
                        </label>

                        {/* Plant Name Editor */}
                        <div style={{ width: '100%', marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Nombre de la Planta:</label>
                            <input
                                type="text"
                                value={gameState.directorStats.plantName || ''}
                                onChange={(e) => updateDirectorStat('plantName', e.target.value)}
                                placeholder="Ej: Mandrágora"
                                style={{
                                    width: '100%', background: '#222', border: '1px solid #444', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem'
                                }}
                            />
                        </div>

                        {/* Plant Story Editor */}
                        <div style={{ width: '100%', marginTop: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Historia de la Planta:</label>
                            <textarea
                                value={gameState.directorStats.plantStory || ''}
                                onChange={(e) => updateDirectorStat('plantStory', e.target.value)}
                                placeholder="Describe a la planta mágica..."
                                style={{
                                    width: '100%',
                                    minHeight: '80px',
                                    background: '#222',
                                    border: '1px solid #444',
                                    color: 'white',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                if (confirm('¿Resetear todos los niveles de la Planta del Mes?')) {
                                    resetPlantStreaks();
                                    alert('Niveles reseteados');
                                }
                            }}
                            style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Resetear Niveles Planta
                        </button>
                    </div>
                </div>

                {/* Magic Breakfast */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Camera color="var(--color-gold)" />
                        <h3>Desayuno Mágico</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px dashed #60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {gameState.directorStats.magicBreakfast ? (
                                <img src={gameState.directorStats.magicBreakfast} alt="Breakfast" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem' }}>☕</span>
                            )}
                        </div>
                        <label style={{
                            padding: '0.5rem 1rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
                        }}>
                            Subir Desayuno
                            <input
                                type="file" style={{ display: 'none' }} accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const resized = await resizeImage(file, 200, 200);
                                        updateDirectorStat('magicBreakfast', resized);
                                    }
                                }}
                            />
                        </label>

                        {/* Breakfast Story Editor */}
                        <div style={{ width: '100%', marginTop: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Historia del Desayuno:</label>
                            <textarea
                                value={gameState.directorStats.magicBreakfastStory || ''}
                                onChange={(e) => updateDirectorStat('magicBreakfastStory', e.target.value)}
                                placeholder="Describe el desayuno mágico..."
                                style={{
                                    width: '100%', minHeight: '80px', background: '#222', border: '1px solid #444', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Wisdom Candle */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Camera color="var(--color-gold)" />
                        <h3>Vela de Sabiduría</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px dashed #a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {gameState.directorStats.wisdomCandle ? (
                                <img src={gameState.directorStats.wisdomCandle} alt="Candle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem' }}>🕯️</span>
                            )}
                        </div>
                        <label style={{
                            padding: '0.5rem 1rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
                        }}>
                            Subir Vela
                            <input
                                type="file" style={{ display: 'none' }} accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const resized = await resizeImage(file, 200, 200);
                                        updateDirectorStat('wisdomCandle', resized);
                                    }
                                }}
                            />
                        </label>

                        {/* Candle Story Editor */}
                        <div style={{ width: '100%', marginTop: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Historia de la Vela:</label>
                            <textarea
                                value={gameState.directorStats.wisdomCandleStory || ''}
                                onChange={(e) => updateDirectorStat('wisdomCandleStory', e.target.value)}
                                placeholder="Describe el aura de la vela..."
                                style={{
                                    width: '100%', minHeight: '80px', background: '#222', border: '1px solid #444', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Artistic Moment */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Camera color="var(--color-gold)" />
                        <h3>Momento Artístico</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px dashed #f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {gameState.directorStats.artisticMoment ? (
                                <img src={gameState.directorStats.artisticMoment} alt="Art" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem' }}>🎨</span>
                            )}
                        </div>
                        <label style={{
                            padding: '0.5rem 1rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
                        }}>
                            Subir Arte
                            <input
                                type="file" style={{ display: 'none' }} accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const resized = await resizeImage(file, 200, 200);
                                        updateDirectorStat('artisticMoment', resized);
                                    }
                                }}
                            />
                        </label>

                        {/* Art Story Editor */}
                        <div style={{ width: '100%', marginTop: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Historia del Arte:</label>
                            <textarea
                                value={gameState.directorStats.artisticMomentStory || ''}
                                onChange={(e) => updateDirectorStat('artisticMomentStory', e.target.value)}
                                placeholder="Describe la inspiración del día..."
                                style={{
                                    width: '100%', minHeight: '80px', background: '#222', border: '1px solid #444', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Lectura Encantada */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Camera color="var(--color-gold)" />
                        <h3>Lectura Encantada</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px dashed #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {gameState.directorStats.lecturaEncantada ? (
                                <img src={gameState.directorStats.lecturaEncantada} alt="Book" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '2rem' }}>📖</span>
                            )}
                        </div>
                        <label style={{
                            padding: '0.5rem 1rem', background: '#333', border: '1px solid #555', color: 'white', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem'
                        }}>
                            Subir Libro
                            <input
                                type="file" style={{ display: 'none' }} accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const resized = await resizeImage(file, 200, 200);
                                        updateDirectorStat('lecturaEncantada', resized);
                                    }
                                }}
                            />
                        </label>

                        {/* Book Story Editor */}
                        <div style={{ width: '100%', marginTop: '0.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Historia del Libro:</label>
                            <textarea
                                value={gameState.directorStats.lecturaEncantadaStory || ''}
                                onChange={(e) => updateDirectorStat('lecturaEncantadaStory', e.target.value)}
                                placeholder="Describe el libro del día..."
                                style={{
                                    width: '100%', minHeight: '80px', background: '#222', border: '1px solid #444', color: 'white', padding: '0.5rem', borderRadius: '4px', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 1. Points Granter */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Star color="var(--color-gold)" />
                        <h3>Otorgar Puntos Rápidos</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <select
                            value={selectedHouse}
                            onChange={(e) => setSelectedHouse(e.target.value)}
                            style={{ padding: '0.5rem', background: '#333', color: 'white', border: '1px solid #555' }}
                        >
                            <option value="phoenix">Phoenix</option>
                            <option value="hipocampus">Hipocampus</option>
                            <option value="unicornius">Unicornius</option>
                            <option value="vipera">Vipera</option>
                        </select>
                        <input
                            type="number"
                            value={pointsToAdd}
                            onChange={(e) => setPointsToAdd(e.target.value)}
                            style={{ padding: '0.5rem', background: '#333', color: 'white', border: '1px solid #555' }}
                        />
                        <button
                            onClick={handleAddPoints}
                            style={{ padding: '0.5rem', background: 'var(--color-gold)', color: 'black', border: 'none', fontWeight: 'bold' }}
                        >
                            Otorgar
                        </button>
                    </div>
                </div>

                {/* --- NUEVO: Historial de Copas --- */}
                <div className="card" style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Trophy color="var(--color-gold)" />
                        <h3>Registrar Copa Anterior</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Año</label>
                                <input type="number" id="cupYear" defaultValue={new Date().getFullYear() - 1} style={{ padding: '0.5rem', background: '#333', color: 'white', border: '1px solid #555', width: '100%' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Casa Ganadora</label>
                                <select id="cupWinner" style={{ padding: '0.5rem', background: '#333', color: 'white', border: '1px solid #555', width: '100%' }}>
                                    <option value="phoenix">Phoenix</option>
                                    <option value="hipocampus">Hipocampus</option>
                                    <option value="unicornius">Unicornius</option>
                                    <option value="vipera">Vipera</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Puntos</label>
                                <input type="number" id="cupPoints" defaultValue={4000} style={{ padding: '0.5rem', background: '#333', color: 'white', border: '1px solid #555', width: '100%' }} />
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                const year = document.getElementById('cupYear').value;
                                const winner = document.getElementById('cupWinner').value;
                                const points = document.getElementById('cupPoints').value;
                                if(year && winner && points) {
                                    addHouseCupRecord({ year: parseInt(year), winner, points: parseInt(points) });
                                    alert('Copa registrada correctamente.');
                                }
                            }}
                            className="button-primary"
                        >
                            Guardar Registro
                        </button>
                    </div>
                </div>

                {/* --- SECCIÓN 3: Desafío del Director --- */}
                <div className="card magic-border" style={{ marginTop: '2rem' }}>
                    <h3>🧙‍♂️ Desafío del Director (Diario)</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <ChallengeCreatorForm onSubmit={setDailyChallenge} />
                    </div>
                </div>

                {/* --- SECCIÓN 3B: Incógnita Diaria --- */}
                <TriviaCreatorForm />

                {/* --- SECCIÓN 3C: Eventos Globales (Raids) --- */}
                <div className="card magic-border" style={{ marginTop: '2rem' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>🐉 Eventos Globales (Raid System)</h3>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={() => triggerEvent('dragon')}
                            disabled={gameState.activeEvent}
                            style={{
                                flex: 1, padding: '0.8rem',
                                background: gameState.activeEvent ? '#444' : 'linear-gradient(45deg, #e74c3c, #c0392b)',
                                color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: gameState.activeEvent ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            Activar Ataque de Dragón
                        </button>
                        <button
                            onClick={() => triggerEvent('cleanup')}
                            disabled={gameState.activeEvent}
                            style={{
                                flex: 1, padding: '0.8rem',
                                background: gameState.activeEvent ? '#444' : 'linear-gradient(45deg, #27ae60, #2ecc71)',
                                color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: gameState.activeEvent ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            Activar Limpieza Cooperativa
                        </button>
                    </div>

                    {gameState.activeEvent && (
                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid #555' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Evento Activo:</span>
                                    <strong style={{ marginLeft: '0.5rem', color: 'var(--color-gold)', textTransform: 'uppercase' }}>
                                        {gameState.activeEvent.type === 'dragon' ? 'Ataque de Dragón' : 'Limpieza Cooperativa'}
                                    </strong>
                                </div>
                                <div style={{ color: gameState.activeEvent.status === 'active' ? '#f1c40f' : '#2ecc71', fontWeight: 'bold' }}>
                                    ESTADO: {gameState.activeEvent.status.toUpperCase()}
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                                    <span>Progreso/HP: {gameState.activeEvent.hp} / {gameState.activeEvent.maxHp}</span>
                                    <span>{Math.round((gameState.activeEvent.hp / gameState.activeEvent.maxHp) * 100)}%</span>
                                </div>
                                <div style={{ height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(gameState.activeEvent.hp / gameState.activeEvent.maxHp) * 100}%`,
                                        height: '100%',
                                        background: gameState.activeEvent.type === 'dragon' ? '#e74c3c' : '#27ae60',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>

                            <button
                                onClick={resolveEvent}
                                style={{
                                    width: '100%', marginTop: '1rem', padding: '0.8rem',
                                    background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                {gameState.activeEvent.status === 'active' ? 'Finalizar Manualmente (Derrota)' : 'Resolver y Otorgar Recompensas'}
                            </button>
                        </div>
                    )}
                </div>


                {/* --- SECCIÓN 4: Tablón de Anuncios --- */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Edit color="var(--color-gold)" />
                        <h3>Tablón de Anuncios</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <textarea
                            defaultValue={gameState.noticeBoard?.message}
                            placeholder="Escribe un anuncio para el Hall..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                padding: '0.8rem',
                                background: '#222',
                                border: '1px solid #444',
                                color: 'white',
                                borderRadius: '4px',
                                fontFamily: 'inherit'
                            }}
                            id="noticeMessage"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    defaultChecked={gameState.noticeBoard?.active}
                                    id="noticeActive"
                                />
                                Mostrar en el Hall
                            </label>
                        <button
                            onClick={() => {
                                const msg = document.getElementById('noticeMessage').value;
                                const active = document.getElementById('noticeActive').checked;
                                updateNoticeBoard(msg, active);
                                showToast('✅ Tablón actualizado.');
                            }}
                            className="button-primary"
                        >
                            ACTUALIZAR TABLÓN
                        </button>
                        </div>
                    </div>
                </div>

                {/* 2. QR Generator */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <QrCode color="var(--color-text-main)" />
                        <h3>QR del Día</h3>
                    </div>
                    <div style={{ textAlign: 'center', background: 'white', padding: '1rem', borderRadius: '8px' }}>
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Astrum-Attendance-${new Date().toISOString().split('T')[0]}`}
                            alt="QR"
                        />
                        <p style={{ color: 'black', marginTop: '0.5rem', fontSize: '0.8rem' }}>Muestra este código para la asistencia de hoy</p>
                    </div>
                </div>

                {/* 3. Google Integrations */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <LinkIcon color="var(--color-hipocampus)" />
                        <h3>Integraciones</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button style={{ padding: '0.75rem', textAlign: 'left', background: '#333', border: '1px solid #444', color: '#ccc' }}>
                            Conectar Google Classroom
                        </button>
                        <button style={{ padding: '0.75rem', textAlign: 'left', background: '#333', border: '1px solid #444', color: '#ccc' }}>
                            Vincular Formulario de Puntos
                        </button>
                    </div>
                </div>

                {/* 4. Cycle Management (Admin) */}
                <div className="card" style={{ border: '1px solid var(--color-danger)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-danger)' }}>
                        <Trash2 /> {/* Using Trash2 as generic danger/reset icon for now */}
                        <h3>Gestión de Ciclo (Zona de Peligro)</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            onClick={() => {
                                if (window.confirm("¿Seguro que quieres CERRAR el CICLO? Esto reseteará los puntos de las casas y guardará al ganador.")) {
                                    closeCycle();
                                    confetti({
                                        particleCount: 300,
                                        spread: 100,
                                        origin: { y: 0.6 }
                                    });
                                    alert("Ciclo Cerrado. ¡Gloria al ganador!");
                                }
                            }}
                            style={{ padding: '0.8rem', background: '#444', border: '1px solid #666', color: 'white', cursor: 'pointer' }}
                        >
                            🏆 Cerrar Ciclo (Reset Puntos Casas)
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm("¿INICIAR NUEVO AÑO ESCOLAR? Esto borrará EXP y Niveles de todos los alumnos.")) {
                                    startNewCycle();
                                    alert("Nuevo ciclo iniciado. Tabula Rasa.");
                                }
                            }}
                            style={{ padding: '0.8rem', background: '#5a0000', border: '1px solid #ff4444', color: 'white', cursor: 'pointer' }}
                        >
                            🔥 Nuevo Año (Reset Alumnos)
                        </button>

                        <button
                            onClick={() => {
                                if (window.confirm("¿Resetear Reloj del Director a 50%?")) {
                                    resetDirectorScore();
                                }
                            }}
                            style={{ padding: '0.8rem', background: '#333', border: '1px solid #555', color: '#ccc', cursor: 'pointer' }}
                        >
                            ⏳ Resetear Reloj Director
                        </button>
                        
                        <button
                            onClick={() => {
                                if (window.confirm("¿Ejecutar Ceremonia de Paso de Año Escolar? Esto avanzará el año/curso de todos los alumnos activos en 1 grado, y graduará a los de 6º año a Guardianes.")) {
                                    advanceSchoolYear();
                                    alert("¡La ceremonia ha concluido! Los alumnos han avanzado de año.");
                                }
                            }}
                            style={{ padding: '0.8rem', background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)', border: 'none', color: 'black', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}
                        >
                            ✨ Ceremonia de Paso de Año Escolar
                        </button>
                    </div>
                </div>

                {/* 5. Magic Classroom Management */}
                <div className="card" style={{ border: '1px solid var(--color-gold)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>
                        <Sparkles />
                        <h3>Aula de Magia</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
                            Estado actual: <strong>{gameState.magicClassroomActive ? '🟢 ACTIVA' : '🔒 DESACTIVADA'}</strong>
                        </p>
                        <button
                            onClick={toggleMagicClassroom}
                            style={{
                                padding: '0.8rem',
                                background: gameState.magicClassroomActive ? 'var(--color-danger)' : 'var(--color-gold)',
                                color: gameState.magicClassroomActive ? 'white' : 'black',
                                border: 'none',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            {gameState.magicClassroomActive ? 'Desactivar Aula de Magia' : 'Activar Aula de Magia'}
                        </button>
                    </div>
                </div>

                {/* --- SECCIÓN: Interruptores de Actividades --- */}
                <div className="card" style={{ border: '1px solid #7c3aed' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#c084fc' }}>
                        <ToggleRight size={20} />
                        <h3 style={{ margin: 0 }}>Actividades Activas</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {[
                            { key: 'plant', label: '🌿 Planta del Mes' },
                            { key: 'pet', label: '🐾 Mascota' },
                            { key: 'breakfast', label: '☕ Desayuno' },
                            { key: 'art', label: '🎨 Momento Artístico' },
                            { key: 'candle', label: '🕯️ Vela de Sabiduría' },
                            { key: 'reading', label: '📖 Lectura Encantada' },
                            { key: 'challenge', label: '🧙‍♂️ Desafío del Director' },
                            { key: 'trivia', label: '🔮 Incógnita Diaria' },
                            { key: 'pergamino', label: '📜 Pergamino Mágico' },
                        ].map(({ key, label }) => {
                            const isOn = gameState.activityToggles?.[key] !== false;
                            return (
                                <button
                                    key={key}
                                    onClick={() => {
                                        toggleActivity(key);
                                        showToast(`${isOn ? '🔴' : '🟢'} ${label} ${isOn ? 'desactivada' : 'activada'}`, isOn ? '#e74c3c' : '#2ecc71');
                                    }}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '0.6rem 0.8rem',
                                        background: isOn ? 'rgba(46,204,113,0.1)' : 'rgba(231,76,60,0.1)',
                                        border: `1px solid ${isOn ? '#2ecc71' : '#e74c3c'}`,
                                        borderRadius: '6px', cursor: 'pointer', color: 'white',
                                        fontSize: '0.82rem', fontWeight: 500,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span>{label}</span>
                                    {isOn ? <ToggleRight size={18} color="#2ecc71" /> : <ToggleLeft size={18} color="#e74c3c" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 6. Communications / Chats Management */}
                <div className="card" style={{ border: '1px solid var(--color-hipocampus)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-hipocampus)' }}>
                        <Feather />
                        <h3>Chats de las Casas</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['phoenix', 'vipera', 'unicornius', 'hipocampus'].map(house => {
                            const isActive = gameState.houseChatsStatus?.[house] !== false;
                            return (
                                <div key={house} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #333' }}>
                                    <span style={{ textTransform: 'capitalize', fontWeight: 'bold', color: `var(--color-${house})` }}>
                                        {house}: {isActive ? '🟢 Activo' : '🔴 Inactivo'}
                                    </span>
                                    <button
                                        onClick={() => {
                                            toggleHouseChatStatus(house);
                                            showToast(`${isActive ? '🔴' : '🟢'} Chat ${house} ${isActive ? 'desactivado' : 'activado'}`, isActive ? '#e74c3c' : '#2ecc71');
                                        }}
                                        style={{
                                            padding: '0.4rem 0.8rem',
                                            background: '#333', border: '1px solid #555',
                                            color: isActive ? 'var(--color-danger)' : 'var(--color-gold)',
                                            borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                        }}
                                    >
                                        {isActive ? 'Desactivar' : 'Activar'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div >

                {/* --- SECCIÓN: Glosario Arcano --- */}
                <ArcaneGlossaryEditor />

                {/* --- SECCIÓN: Mensajes Directos del Director --- */}
                <DirectorMessagesPanel />

                {/* --- SECCIÓN: Historial de Copa de las Casas --- */}
                <HouseCupHistory isDirector={true} />

            {/* 4. Student Management */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3>Estudiantes ({gameState.students?.length || 0})</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>Ordenar por:</span>
                        {[{ k: 'name', l: 'Apellido' }, { k: 'house', l: 'Casa' }, { k: 'course', l: 'Curso' }, { k: 'xp', l: 'XP' }].map(({ k, l }) => (
                            <button key={k} onClick={() => handleSort(k)} style={{
                                display: 'flex', alignItems: 'center', gap: '0.25rem',
                                padding: '0.3rem 0.6rem', fontSize: '0.75rem',
                                background: sortKey === k ? '#7c3aed' : '#333',
                                border: `1px solid ${sortKey === k ? '#a855f7' : '#555'}`,
                                color: 'white', borderRadius: '4px', cursor: 'pointer'
                            }}>
                                {l} <SortIcon col={k} />
                            </button>
                        ))}
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '620px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                            <th style={{ padding: '0.5rem' }}>Nombre</th>
                            <th style={{ padding: '0.5rem' }}>Casa</th>
                            <th style={{ padding: '0.5rem' }}>Curso</th>
                            <th style={{ padding: '0.5rem' }}>XP</th>
                            <th style={{ padding: '0.5rem' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStudents.map(std => (
                            <tr key={std.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '0.5rem', fontSize: '0.85rem' }}>{std.name}</td>
                                <td style={{ padding: '0.5rem', textTransform: 'capitalize', color: `var(--color-${std.house})`, fontSize: '0.85rem' }}>{std.house}</td>
                                <td style={{ padding: '0.5rem', fontSize: '0.85rem' }}>{std.course || '-'}</td>
                                <td style={{ padding: '0.5rem', fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '0.85rem' }}>{std.xp}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <button
                                            onClick={() => { adjustStudentXP(std.id, 10); showToast(`+10 XP → ${std.name}`); }}
                                            style={{ padding: '0.2rem 0.5rem', background: 'rgba(46,204,113,0.2)', border: '1px solid #2ecc71', color: '#2ecc71', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}
                                            title="+10 XP"
                                        >+10</button>
                                        <button
                                            onClick={() => { adjustStudentXP(std.id, -10); showToast(`-10 XP → ${std.name}`, '#e74c3c'); }}
                                            style={{ padding: '0.2rem 0.5rem', background: 'rgba(231,76,60,0.2)', border: '1px solid #e74c3c', color: '#e74c3c', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.75rem' }}
                                            title="-10 XP"
                                        >-10</button>
                                        <button onClick={() => handleEditClick(std)} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }} title="Editar">
                                            <Edit size={15} />
                                        </button>
                                        <button
                                            onClick={() => { restoreEnergy(std.id); showToast(`⚡ Energía restaurada: ${std.name}`); }}
                                            style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer' }}
                                            title="Restaurar Energía"
                                        >
                                            <Zap size={15} fill="#c084fc" />
                                        </button>
                                        {std.role !== 'director' && (
                                            <button onClick={() => handleDeleteClick(std)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }} title="Eliminar">
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            {studentToDelete && (
                <div className="modal-overlay">
                    <div className="modal-neon">
                        <h3 style={{ color: 'var(--color-primary)', marginTop: 0 }}>Confirmar eliminación</h3>
                        <p style={{ color: 'var(--color-text-main)' }}>¿Está seguro de eliminar al estudiante {studentToDelete.name}?</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={cancelDelete} className="btn-neon-violet">Cancelar</button>
                            <button onClick={confirmDelete} className="btn-neon-gold" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)', border: '1px solid #ff4d4d', boxShadow: '0 0 8px rgba(231,76,60,0.5)', color: 'white' }}>Sí, eliminar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {
                editingStudent && (
                    <div className="modal-overlay">
                        <div className="modal-neon">
                            <button onClick={() => setEditingStudent(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}><X size={24} /></button>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <Edit color="var(--color-primary)" />
                                <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Editar Estudiante</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label className="label-neon">Nombre</label>
                                    <input
                                        type="text"
                                        className="input-neon"
                                        value={editingStudent.name}
                                        onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label-neon">Email</label>
                                    <input
                                        type="email"
                                        className="input-neon"
                                        value={editingStudent.email}
                                        onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label className="label-neon">Nivel</label>
                                        <input
                                            type="number"
                                            className="input-neon"
                                            value={editingStudent.level}
                                            onChange={e => setEditingStudent({ ...editingStudent, level: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label className="label-neon">XP</label>
                                        <input
                                            type="number"
                                            className="input-neon"
                                            value={editingStudent.xp}
                                            onChange={e => setEditingStudent({ ...editingStudent, xp: parseInt(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label-neon">Avatar URL</label>
                                    <input
                                        type="text"
                                        className="input-neon"
                                        value={editingStudent.avatar || ''}
                                        onChange={e => setEditingStudent({ ...editingStudent, avatar: e.target.value })}
                                    />
                                </div>

                                <button
                                    onClick={handleSaveStudent}
                                    className="btn-neon-gold"
                                    style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                >
                                    <Save size={18} /> Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* 5. Flying Messages (Director Only) */}
            <div className="card" style={{ marginTop: '2rem', border: '1px solid var(--color-gold)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Feather color="var(--color-gold)" size={24} />
                    <h3 style={{ margin: 0, color: 'var(--color-gold)' }}>Mensajes Voladores Recibidos</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {gameState.flyingMessages?.length === 0 ? (
                        <div style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '2rem' }}>
                            No hay mensajes nuevos en la torre...
                        </div>
                    ) : (
                        gameState.flyingMessages?.map((msg) => (
                            <div key={msg.id} style={{
                                background: 'rgba(255,215,0,0.05)',
                                border: '1px solid rgba(255,215,0,0.2)',
                                borderRadius: '12px',
                                padding: '1rem',
                                display: 'flex',
                                gap: '1rem',
                                position: 'relative'
                            }}>
                                <img
                                    src={msg.avatar}
                                    alt={msg.senderName}
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--color-gold)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 'bold', color: 'var(--color-gold)', fontSize: '0.9rem' }}>
                                            {msg.senderName}
                                        </span>
                                        <span style={{ fontSize: '0.7rem', color: '#666' }}>
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, color: '#ddd', fontSize: '0.95rem' }}>
                                        {msg.text}
                                    </p>
                                </div>
                                <button
                                    onClick={() => deleteFlyingMessage(msg.id)}
                                    style={{
                                        background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer',
                                        alignSelf: 'flex-start', padding: '0.2rem'
                                    }}
                                    title="Archivar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div >
    );
};

export default DirectorDashboard;

const TriviaCreatorForm = () => {
    const { setDailyTrivia, gameState } = useGame();
    const [question, setQuestion] = React.useState('');
    const [options, setOptions] = React.useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = React.useState(0);
    const [image, setImage] = React.useState(gameState.dailyTrivia?.image || null);
    const [saved, setSaved] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
    const triviaImageRef = React.useRef(null);

    const handleAiGenerate = async () => {
        setLoading(true);
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error('NO_API_KEY');

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Genera una pregunta de trivia para un juego de rol de escuela de magia (estilo Harry Potter / Solo Leveling). 
                                La pregunta debe ser sobre cultura general, mitología o fantasía. 
                                Formato JSON: 
                                {
                                  "question": "texto de la pregunta",
                                  "options": ["opción A", "opción B", "opción C", "opción D"],
                                  "correctAnswer": 0
                                }
                                Responde solo con el JSON.`
                            }]
                        }]
                    })
                }
            );

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleaned = text.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            setQuestion(parsed.question);
            setOptions(parsed.options);
            setCorrectAnswer(parsed.correctAnswer);
        } catch (err) {
            console.error("Gemini Trivia Error", err);
            alert("No se pudo generar con IA. Verifica tu VITE_GEMINI_API_KEY.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resized = await resizeImage(file, 400, 400);
                setImage(resized);
            } catch (error) {
                console.error("Trivia Image Resize failed", error);
            }
        }
    };

    const handleSubmit = () => {
        if (!question.trim() || options.some(o => !o.trim())) return;
        setDailyTrivia({
            id: Date.now(),
            question,
            options,
            correctAnswer,
            image,
            createdAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const inputStyle = {
        width: '100%', padding: '0.65rem',
        background: '#0f0f1f', border: '1px solid #4c1d95',
        color: '#e9d5ff', borderRadius: '6px', fontFamily: 'inherit', fontSize: '0.9rem',
        marginBottom: '0.5rem', boxSizing: 'border-box'
    };

    const answerLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="card" style={{ marginTop: '2rem', border: '1px solid #581c87', background: 'linear-gradient(145deg, #0d0d1f, #1a0a33)' }}>
            <h3 style={{ color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                🔮 Incógnita Diaria
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1rem' }}>
                Actual: "{gameState.dailyTrivia?.question || 'Sin pregunta'}"
            </p>
            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    onClick={handleAiGenerate}
                    disabled={loading}
                    style={{
                        width: '100%', padding: '0.6rem', marginBottom: '1rem',
                        background: 'rgba(192, 132, 252, 0.1)', border: '1px dashed #c084fc',
                        color: '#c084fc', borderRadius: '6px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        fontSize: '0.8rem', fontFamily: '"Orbitron", sans-serif'
                    }}
                >
                    {loading ? 'GENERANDO...' : <><Sparkles size={14} /> GENERACIÓN MÁGICA (IA)</>}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        border: '2px dashed #6d28d9', background: '#0a0a0f',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {image ? (
                            <img src={image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Camera size={24} color="#4c1d95" />
                        )}
                    </div>
                    <div>
                        <button
                            onClick={() => triviaImageRef.current.click()}
                            style={{
                                padding: '0.5rem 1rem', background: '#1e1e2e',
                                border: '1px solid #4c1d95', color: '#c084fc',
                                borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem'
                            }}
                        >
                            Subir Imagen Personalizada
                        </button>
                        <input
                            type="file"
                            ref={triviaImageRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <label style={{ color: '#d8b4fe', fontSize: '0.85rem' }}>Pregunta:</label>
                <textarea
                    value={question} onChange={e => setQuestion(e.target.value)}
                    placeholder="¿Cuál es...?"
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                />
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
                {options.map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#8b5cf6', minWidth: '20px', fontWeight: 'bold' }}>{answerLabels[idx]}</span>
                        <input
                            value={opt}
                            onChange={e => { const o = [...options]; o[idx] = e.target.value; setOptions(o); }}
                            placeholder={`Opción ${answerLabels[idx]}`}
                            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        />
                        <input
                            type="radio" name="correct" checked={correctAnswer === idx}
                            onChange={() => setCorrectAnswer(idx)}
                            title="Respuesta correcta"
                            style={{ accentColor: '#a855f7', cursor: 'pointer' }}
                        />
                    </div>
                ))}
                <p style={{ fontSize: '0.75rem', color: '#6d28d9' }}>● = Respuesta correcta</p>
            </div>
            <button
                onClick={handleSubmit}
                style={{
                    padding: '0.7rem 1.5rem', background: 'linear-gradient(90deg,#7c3aed,#9333ea)',
                    border: 'none', borderRadius: '6px', color: '#fff',
                    fontWeight: 'bold', cursor: 'pointer', fontFamily: '"Orbitron",sans-serif', fontSize: '0.8rem'
                }}
            >
                {saved ? '✓ GUARDADO' : 'PUBLICAR INCÓGNITA'}
            </button>
        </div>
    );
};
