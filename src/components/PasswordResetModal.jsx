import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Wand2 } from 'lucide-react';

const PasswordResetModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1);
    const [recoveryCode, setRecoveryCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [toastMsg, setToastMsg] = useState('');
    const [toastType, setToastType] = useState('');
    
    const { requestPasswordReset, resetPassword } = useGame();

    if (!isOpen) return null;

    const showToast = (msg, type) => {
        setToastMsg(msg);
        setToastType(type);
        setTimeout(() => setToastMsg(''), 3400); // 3s display + animation time
    };

    const handleRequestReset = (e) => {
        e.preventDefault();
        setError('');
        const code = requestPasswordReset(email);
        if (code) {
            setStep(2);
            showToast(`Se ha enviado un código a ${email}. (Simulado: ${code})`, 'success');
        } else {
            setError('No se encontró ningún mago con ese correo.');
            showToast('Correo no encontrado.', 'error');
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        setError('');
        if (resetPassword(email, recoveryCode, newPassword)) {
            showToast('¡Contraseña restaurada con éxito!', 'success');
            setTimeout(() => {
                onClose();
                setStep(1);
                setEmail('');
                setRecoveryCode('');
                setNewPassword('');
            }, 2000);
        } else {
            setError('El código ingresado no es correcto.');
            showToast('Código incorrecto.', 'error');
        }
    };

    const handleClose = () => {
        setStep(1);
        setEmail('');
        setRecoveryCode('');
        setNewPassword('');
        setError('');
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-neon">
                <button 
                    onClick={handleClose} 
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>
                
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <Wand2 size={40} color="var(--color-gold)" style={{ marginBottom: '0.5rem' }} />
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-gold)', margin: 0, fontFamily: 'var(--font-serif)' }}>
                        Recuperar Acceso
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        {step === 1 ? "Ingresa tu correo para recibir un código mágico." : "Ingresa el código que te enviamos."}
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleRequestReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div>
                            <label className="label-neon">Correo Mágico</label>
                            <input
                                type="email"
                                className="input-neon"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="alumno@astrum.edu"
                                required
                            />
                        </div>
                        {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
                        <button type="submit" className="btn-neon-violet" style={{ marginTop: '0.5rem' }}>
                            Enviar Código
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div>
                            <label className="label-neon">Código de Recuperación</label>
                            <input
                                type="text"
                                className="input-neon"
                                value={recoveryCode}
                                onChange={(e) => setRecoveryCode(e.target.value)}
                                placeholder="Ej: 123456"
                                required
                            />
                        </div>
                        <div>
                            <label className="label-neon">Nueva Contraseña</label>
                            <input
                                type="password"
                                className="input-neon"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        {error && <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
                        <button type="submit" className="btn-neon-gold" style={{ marginTop: '0.5rem' }}>
                            Restablecer Contraseña
                        </button>
                    </form>
                )}
            </div>

            {toastMsg && (
                <div className={`toast-neon ${toastType}`}>
                    {toastMsg}
                </div>
            )}
        </div>
    );
};

export default PasswordResetModal;
