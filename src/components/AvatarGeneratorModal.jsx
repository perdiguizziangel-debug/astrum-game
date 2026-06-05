import React, { useState } from 'react';
import { X, Flame, Droplet, Sparkles, VenetianMask, Crown, Palette, User, Home, Wand2, Loader2 } from 'lucide-react';
import { resizeImage } from '../utils/imageUtils';
import { useGame } from '../context/GameContext';

const HOUSES = [
    { id: 'phoenix', icon: Flame, label: 'Phoenix' },
    { id: 'hipocampus', icon: Droplet, label: 'Hipocampus' },
    { id: 'unicornius', icon: Sparkles, label: 'Unicornius' },
    { id: 'vipera', icon: VenetianMask, label: 'Vipera' }
];

const ROLES = [
    { id: 'autoridad', icon: Crown, label: 'Autoridad' },
    { id: 'artista', icon: Palette, label: 'Artista' },
    { id: 'visitante', icon: User, label: 'Visitante' },
    { id: 'familiar', icon: Home, label: 'Familiar' }
];

const AvatarGeneratorModal = ({ isOpen, onClose, currentAvatar }) => {
    const { updateUser, gameState } = useGame();
    const [selectedHouse, setSelectedHouse] = useState(gameState.currentUser?.house || 'phoenix');
    const [selectedRole, setSelectedRole] = useState('visitante');
    const [sourceImage, setSourceImage] = useState(currentAvatar);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    if (!isOpen) return null;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const resized = await resizeImage(file, 600, 600); // Larger size for the AI
                setSourceImage(resized);
            } catch (error) {
                console.error("Error resizing image", error);
            }
        }
    };

    const handleConjure = () => {
        if (!sourceImage) return;
        setIsGenerating(true);

        // TODO: En el futuro, aquí irá la llamada real a Google AI Studio
        // Simulamos la generación con un timeout por ahora
        setTimeout(() => {
            setIsGenerating(false);
            // Muestra una alerta temporal porque aún no tenemos el backend
            alert(`¡Hechizo lanzado!\n\n(En la Fase 2, aquí se conectará Google AI Studio para transformar tu foto en la casa ${selectedHouse} con el rol de ${selectedRole})`);
        }, 3000);
    };

    const handleSave = () => {
        if (generatedImage) {
            updateUser(gameState.currentUser.id, { avatar: generatedImage });
            onClose();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.95)', // Dark blue matching screenshot
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '500px',
                height: '100%',
                maxHeight: '850px',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1.5rem',
                color: 'white',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                    <X size={28} />
                </button>

                <h2 style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px', color: '#94a3b8', marginBottom: '2rem', marginTop: '1rem' }}>
                    DESTINO Y RANGO ESPECIAL
                </h2>

                {/* Avatar Preview & Upload */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                    <label style={{
                        position: 'relative',
                        width: '180px',
                        height: '180px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '4px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)'
                    }}>
                        <img
                            src={generatedImage || sourceImage || 'https://via.placeholder.com/150'}
                            alt="Avatar"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {!generatedImage && (
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                background: 'rgba(0,0,0,0.6)', padding: '0.5rem', textAlign: 'center', fontSize: '0.8rem'
                            }}>
                                Cambiar Foto Base
                            </div>
                        )}
                        <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                {/* House Selectors */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    {HOUSES.map(house => {
                        const Icon = house.icon;
                        const isSelected = selectedHouse === house.id;
                        return (
                            <button
                                key={house.id}
                                onClick={() => setSelectedHouse(house.id)}
                                style={{
                                    width: '60px', height: '60px', borderRadius: '50%',
                                    background: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    border: isSelected ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid transparent',
                                    color: isSelected ? 'white' : '#64748b',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <Icon size={24} />
                            </button>
                        );
                    })}
                </div>

                {/* Role Selectors */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: 'auto' }}>
                    {ROLES.map(role => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;
                        return (
                            <div key={role.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <button
                                    onClick={() => setSelectedRole(role.id)}
                                    style={{
                                        width: '60px', height: '60px', borderRadius: '50%',
                                        background: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        border: isSelected ? '2px solid rgba(255, 255, 255, 0.8)' : '2px solid transparent',
                                        color: isSelected ? 'white' : '#64748b',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={24} />
                                </button>
                                <span style={{ fontSize: '0.7rem', color: isSelected ? 'white' : '#64748b', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {role.label}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1, padding: '1.2rem', borderRadius: '30px',
                            background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>

                    {generatedImage ? (
                        <button
                            onClick={handleSave}
                            style={{
                                flex: 1, padding: '1.2rem', borderRadius: '30px',
                                background: 'linear-gradient(to right, #d4af37, #f3e5ab)', // Gold
                                border: 'none', color: '#1e293b', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}
                        >
                            <Save size={20} /> Guardar Avatar
                        </button>
                    ) : (
                        <button
                            onClick={handleConjure}
                            disabled={isGenerating || !sourceImage}
                            style={{
                                flex: 1, padding: '1.2rem', borderRadius: '30px',
                                background: 'linear-gradient(to right, #6d5a2d, #8a7339)', // Dark Gold / Olive
                                border: 'none', color: '#f8fafc', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                opacity: isGenerating ? 0.7 : 1
                            }}
                        >
                            {isGenerating ? <Loader2 className="spin" size={20} /> : <Wand2 size={20} />}
                            {isGenerating ? 'Conjurando...' : 'Conjurar Selección'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvatarGeneratorModal;
