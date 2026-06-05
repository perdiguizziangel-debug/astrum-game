import React, { useState, useRef } from 'react';
import { X, Upload, Save, User, Wand2, Calendar } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { resizeImage } from '../utils/imageUtils';

const EditProfileModal = ({ isOpen, onClose }) => {
    const { gameState, updateUser } = useGame();
    const user = gameState.currentUser;

    // Form state initialized with user data
    const [formData, setFormData] = useState({
        name: user?.name || '',
        birthday: user?.birthday || '',
        wandWood: user?.wand?.wood || '',
        wandCore: user?.wand?.core || '',
        avatar: user?.avatar || ''
    });

    const fileInputRef = useRef(null);

    if (!isOpen || !user) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resizedImage = await resizeImage(file, 300, 300); // Resize to 300x300 max
                setFormData(prev => ({ ...prev, avatar: resizedImage }));
            } catch (error) {
                console.error("Error resizing image:", error);
                // Fallback to original if resize fails (though unlikely)
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, avatar: reader.result }));
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        updateUser(user.id, {
            name: formData.name,
            birthday: formData.birthday,
            avatar: formData.avatar,
            wand: {
                wood: formData.wandWood,
                core: formData.wandCore
            }
        });

        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="card magic-border" style={{
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                position: 'relative',
                animation: 'fadeIn 0.3s ease'
            }}>
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

                <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-serif)', color: 'var(--color-gold)', marginBottom: '2rem' }}>
                    Editar Perfil
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Avatar Upload */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            position: 'relative',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3px solid var(--color-gold)',
                            boxShadow: '0 0 20px rgba(255,215,0,0.2)'
                        }}>
                            <img
                                src={formData.avatar}
                                alt="Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <label
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    textAlign: 'center',
                                    padding: '0.3rem',
                                    fontSize: '0.7rem',
                                    cursor: 'pointer',
                                    display: 'block'
                                }}
                            >
                                Cambiar
                                <input
                                    type="file"
                                    id="avatar-input"
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
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={16} /> Nombre Mágico
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} /> Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    {/* Wand Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Wand2 size={16} /> Madera Varita
                            </label>
                            <input
                                type="text"
                                name="wandWood"
                                value={formData.wandWood}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Ej. Acebo"
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: '#aaa', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Wand2 size={16} /> Núcleo Varita
                            </label>
                            <input
                                type="text"
                                name="wandCore"
                                value={formData.wandCore}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="Ej. Pluma de Fénix"
                            />
                        </div>
                    </div>

                    <button type="submit" className="button-primary" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Save size={18} /> Guardar Cambios
                    </button>

                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
