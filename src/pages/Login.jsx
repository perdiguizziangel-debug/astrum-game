import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [isGuardian, setIsGuardian] = useState(false);
    const [schoolYear, setSchoolYear] = useState(1);
    const [error, setError] = useState('');

    const { login, register } = useGame();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isRegistering) {
            const role = isGuardian ? 'guardian' : 'student';
            if (register(email, password, name, role, schoolYear)) {
                navigate('/');
            } else {
                setError('Este correo mágico ya está en uso.');
            }
        } else {
            if (login(email, password)) {
                navigate('/');
            } else {
                setError('Credenciales mágicas inválidas.');
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/src/assets/hall_background_1768520419340.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.7)'
            }} />

            <div className="card magic-border" style={{
                position: 'relative',
                zIndex: 10,
                width: '400px',
                padding: '3rem',
                backdropFilter: 'blur(10px)',
                background: 'rgba(30, 30, 30, 0.9)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Wand2 size={48} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>ASTRUM</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>
                        {isRegistering ? "Inscribe tu nombre en el Gran Libro" : "Identifícate para entrar al reino"}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {isRegistering && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-gold)' }}>Tu Nombre</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Harry Potter"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid #444',
                                    color: 'white',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                                required
                            />
                            {!isGuardian && (
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-gold)' }}>Año de Cursada</label>
                                    <select
                                        value={schoolYear}
                                        onChange={(e) => setSchoolYear(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            background: 'rgba(0,0,0,0.3)',
                                            border: '1px solid #444',
                                            color: 'white',
                                            borderRadius: 'var(--radius-sm)'
                                        }}
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(year => (
                                            <option key={year} value={year}>{year}º Año</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer', color: '#ccc' }}>
                                <input
                                    type="checkbox"
                                    checked={isGuardian}
                                    onChange={(e) => setIsGuardian(e.target.checked)}
                                    style={{ width: 'auto' }}
                                />
                                Soy Guardián / Exalumno
                            </label>
                        </div>
                    )}

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-gold)' }}>Correo Mágico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="alumno@astrum.edu"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid #444',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-gold)' }}>Contraseña Secreta</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '1px solid #444',
                                color: 'white',
                                borderRadius: 'var(--radius-sm)'
                            }}
                            required
                        />
                    </div>

                    {error && <p style={{ color: 'var(--color-danger)', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        style={{
                            background: 'var(--color-gold)',
                            color: 'black',
                            padding: '1rem',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            marginTop: '1rem',
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}
                    >
                        {isRegistering ? "Firmar Contrato" : "Entrar"}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        {isRegistering ? "¿Ya eres un mago? Ingresa aquí" : "¿Eres nuevo? Regístrate aquí"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
