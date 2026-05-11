import React, { useRef, useState } from 'react';
import { useGame } from '../context/GameContext';
import { Shield, Sparkles, Wand2, Edit, Camera, X, Save, Calendar } from 'lucide-react';

const CharacterSheet = () => {
    const { gameState, updateUser } = useGame();
    const user = gameState.currentUser;
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({});

    const nextLevelXp = user.level * 100;
    const progress = (user.xp / nextLevelXp) * 100;

    const handleEditClick = () => {
        setEditData({
            name: user.name,
            birthday: user.birthday || '',
            wandWood: user.wand?.wood || '',
            wandCore: user.wand?.core || ''
        });
        setIsEditing(true);
    };

    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser(user.id, { avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateUser(user.id, {
            name: editData.name,
            birthday: editData.birthday,
            wand: {
                wood: editData.wandWood,
                core: editData.wandCore
            }
        });
        setIsEditing(false);
    };

    return (
        <div className="card magic-border" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick} title="Cambiar foto">
                <img
                    src={user.avatar}
                    alt={user.name}
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        border: `4px solid var(--color-${user.house})`,
                        boxShadow: `0 0 20px var(--color-${user.house})`,
                        objectFit: 'cover'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    background: 'var(--color-gold)',
                    color: 'black',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '2px solid white'
                }}>
                    <Camera size={20} />
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{user.name}</h2>
                    <button onClick={handleEditClick} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                        <Edit size={20} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: `var(--color-${user.house})` }}>
                        <Shield size={20} />
                        <span style={{ textTransform: 'capitalize', fontSize: '1.2rem' }}>{user.house}</span>
                    </div>
                    {user.wand && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)' }}>
                            <Wand2 size={20} />
                            <span>{user.wand.wood}, {user.wand.core}</span>
                        </div>
                    )}
                    {user.birthday && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                            <Calendar size={20} />
                            <span>{user.birthday}</span>
                        </div>
                    )}
                </div>

                <div style={{ background: '#333', height: '20px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, var(--color-gold-dim), var(--color-gold))',
                        height: '100%'
                    }} />
                    <span style={{
                        position: 'absolute',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'black',
                        fontWeight: 'bold',
                        top: 0,
                        lineHeight: '20px'
                    }}>
                        {user.xp} / {nextLevelXp} XP (Nvl {user.level})
                    </span>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
                }}>
                    <div className="card magic-border" style={{ width: '400px', background: 'var(--color-surface)', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3>Editar Perfil</h3>
                            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}><X /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label>
                                Nombre:
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                />
                            </label>
                            <label>
                                Cumpleaños:
                                <input
                                    type="date"
                                    value={editData.birthday}
                                    onChange={e => setEditData({ ...editData, birthday: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                />
                            </label>
                            <label>
                                Madera de Varita:
                                <input
                                    type="text"
                                    value={editData.wandWood}
                                    onChange={e => setEditData({ ...editData, wandWood: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                />
                            </label>
                            <label>
                                Núcleo de Varita:
                                <input
                                    type="text"
                                    value={editData.wandCore}
                                    onChange={e => setEditData({ ...editData, wandCore: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.2rem', background: '#333', border: '1px solid #555', color: 'white' }}
                                />
                            </label>

                            <button
                                onClick={handleSave}
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
            )}
        </div>
    );
};

export default CharacterSheet;
