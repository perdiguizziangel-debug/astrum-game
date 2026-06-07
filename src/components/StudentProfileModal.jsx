import React from 'react';
import { X, Star, Zap, Crown } from 'lucide-react';

const StudentProfileModal = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    const getHouseColor = (house) => {
        const colors = {
            phoenix: 'var(--color-phoenix)',
            hipocampus: 'var(--color-hipocampus)',
            unicornius: 'var(--color-unicornius)',
            vipera: 'var(--color-vipera)',
            unassigned: '#999'
        };
        return colors[house] || colors.unassigned;
    };

    const houseColor = getHouseColor(student.house);

    return (
        <div className="modal-overlay">
            <div className="modal-neon" style={{ maxWidth: '350px', textAlign: 'center', borderColor: houseColor }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer' }}>
                    <X size={24} />
                </button>
                
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
                    <img
                        src={student.avatar}
                        alt={student.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: `3px solid ${houseColor}`,
                            boxShadow: `0 0 20px ${houseColor}`,
                            objectFit: 'cover'
                        }}
                    />
                    {student.role === 'guardian' && (
                        <div style={{ position: 'absolute', bottom: -5, right: -5, background: '#111', borderRadius: '50%', padding: '4px' }}>
                            <Crown size={24} color="var(--color-gold)" />
                        </div>
                    )}
                </div>

                <h2 style={{ margin: '0 0 0.5rem', color: 'white', textShadow: `0 0 10px ${houseColor}`, fontSize: '1.8rem' }}>
                    {student.name}
                </h2>
                
                <p style={{ color: houseColor, textTransform: 'capitalize', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.2rem' }}>
                    {student.house !== 'unassigned' ? student.house : 'Sin Casa'}
                </p>

                <p style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                    {student.role === 'guardian' ? (
                        student.course === 'graduado' ? 'Guardián Graduado' : 'Guardián'
                    ) : (
                        `Estudiante de ${student.course || 1}º Año`
                    )}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid var(--color-gold)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        color: 'var(--color-gold)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontWeight: 'bold'
                    }}>
                        <Star size={18} /> Nivel {student.level || 1}
                    </div>
                    <div style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid var(--color-primary)',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        color: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        fontWeight: 'bold'
                    }}>
                        <Zap size={18} /> {student.xp || 0} XP
                    </div>
                </div>

                {student.wand && student.wand.image && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                        <h4 style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Varita Mágica</h4>
                        <img 
                            src={student.wand.image} 
                            alt="Varita Mágica" 
                            style={{ maxWidth: '100%', height: '80px', objectFit: 'contain', filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.2))' }} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentProfileModal;
