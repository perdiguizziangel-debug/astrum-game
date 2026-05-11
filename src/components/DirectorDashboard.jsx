import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { resizeImage } from '../utils/imageUtils';
import { QrCode, UserPlus, Star, Link as LinkIcon, Trash2, Edit, X, Save, Camera, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const ChallengeCreatorForm = ({ onSubmit }) => {
    const [type, setType] = useState('text');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');

    const [image, setImage] = useState(null);
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
        setImage(null);

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

const DirectorDashboard = () => {
    const { gameState, addPoints, updateUser, updateDirectorStat, closeCycle, startNewCycle, resetDirectorScore, updateNoticeBoard, resetPetStreaks, resetPlantStreaks, setDailyChallenge, setDailyTrivia, triggerEvent, resolveEvent } = useGame();
    const [pointsToAdd, setPointsToAdd] = useState(10);
    const [selectedHouse, setSelectedHouse] = useState('phoenix');
    const [editingStudent, setEditingStudent] = useState(null);
    const fileInputRef = useRef(null);

    const handleAddPoints = () => {
        addPoints(selectedHouse, parseInt(pointsToAdd));
        alert(`${pointsToAdd} puntos añadidos a ${selectedHouse}`);
    };

    const handleEditClick = (student) => {
        setEditingStudent({ ...student });
    };

    const handleSaveStudent = () => {
        if (editingStudent) {
            updateUser(editingStudent.id, editingStudent);
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                                style={{ display: 'none' }}
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
                                    style={{ display: 'none' }}
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
                                style={{ display: 'none' }}
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
                        <h3>Otorgar Puntos</h3>
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
                                    // Use context function updateNoticeBoard (must be destructured from useGame)
                                    // Oh wait, I need to make sure updateNoticeBoard is available in the component scope.
                                    // It is not currently destructured in line 91. I will assume it is injected or I need to update imports.
                                    // I'll update line 91 in a separate edit or use window/alert if failed? No, I should fix line 91.
                                    // Let's rely on the next Replace call to fix line 91.
                                    // For now, I'll assume `updateNoticeBoard` is available.
                                    updateNoticeBoard(msg, active);
                                    alert("Tablón actualizado.");
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
                    </div>
                </div>

            </div >

            {/* 4. Student Management */}
            < div className="card" >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3>Estudiantes</h3>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--color-vipera)', border: 'none', borderRadius: '4px', color: 'white' }}>
                        <UserPlus size={16} /> Añadir
                    </button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #444', textAlign: 'left' }}>
                            <th style={{ padding: '0.5rem' }}>Nombre</th>
                            <th style={{ padding: '0.5rem' }}>Casa</th>
                            <th style={{ padding: '0.5rem' }}>Nivel</th>
                            <th style={{ padding: '0.5rem' }}>XP</th>
                            <th style={{ padding: '0.5rem' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gameState.students.filter(s => s.role !== 'director').map(std => (
                            <tr key={std.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '0.5rem' }}>{std.name}</td>
                                <td style={{ padding: '0.5rem', textTransform: 'capitalize', color: `var(--color-${std.house})` }}>{std.house}</td>
                                <td style={{ padding: '0.5rem' }}>{std.level}</td>
                                <td style={{ padding: '0.5rem' }}>{std.xp}</td>
                                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditClick(std)} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }}>
                                        <Edit size={16} />
                                    </button>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {/* Edit Modal */}
            {
                editingStudent && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                    }}>
                        <div className="card magic-border" style={{ width: '400px', background: 'var(--color-surface)', padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h3>Editar Estudiante</h3>
                                <button onClick={() => setEditingStudent(null)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}><X /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label>
                                    Nombre:
                                    <input
                                        type="text"
                                        value={editingStudent.name}
                                        onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={editingStudent.email}
                                        onChange={e => setEditingStudent({ ...editingStudent, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                    />
                                </label>
                                <label>
                                    Casa:
                                    <select
                                        value={editingStudent.house}
                                        onChange={e => setEditingStudent({ ...editingStudent, house: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                    >
                                        <option value="phoenix">Phoenix</option>
                                        <option value="hipocampus">Hipocampus</option>
                                        <option value="unicornius">Unicornius</option>
                                        <option value="vipera">Vipera</option>
                                    </select>
                                </label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <label style={{ flex: 1 }}>
                                        Nivel:
                                        <input
                                            type="number"
                                            value={editingStudent.level}
                                            onChange={e => setEditingStudent({ ...editingStudent, level: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                        />
                                    </label>
                                    <label style={{ flex: 1 }}>
                                        XP:
                                        <input
                                            type="number"
                                            value={editingStudent.xp}
                                            onChange={e => setEditingStudent({ ...editingStudent, xp: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                        />
                                    </label>
                                </div>

                                <button
                                    onClick={handleSaveStudent}
                                    style={{
                                        marginTop: '1rem',
                                        background: 'var(--color-gold)',
                                        color: 'black',
                                        padding: '0.8rem',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                    }}
                                >
                                    <Save size={18} /> Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

        </div >
    );
};

export default DirectorDashboard;

const TriviaCreatorForm = () => {
    const { setDailyTrivia, gameState } = useGame();
    const [question, setQuestion] = React.useState('');
    const [options, setOptions] = React.useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = React.useState(0);
    const [image, setImage] = React.useState(null);
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
            image
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
