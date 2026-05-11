import React, { useState } from 'react';
import { Camera, CheckCircle, XCircle, Upload } from 'lucide-react';
import { resizeImage } from '../../utils/imageUtils';
import { useGame } from '../../context/GameContext';

const ObjectHunt = ({ onComplete, onClose }) => {
    const { completeActivity, gameState } = useGame();
    const [targetObject] = useState(() => {
        const objects = ['Tenedor', 'Cuchara', 'Taza', 'Libro', 'Planta', 'Lámpara', 'Llave', 'Zapato'];
        return objects[Math.floor(Math.random() * objects.length)];
    });
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null); // 'success' | 'fail'

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAnalyzing(true);
        try {
            const resized = await resizeImage(file, 400, 400);
            setImage(resized);

            // Simulation of AI analysis
            setTimeout(() => {
                // In a real app, we would send 'resized' to an API (OpenAI/Vision)
                // Here we simulate success for demo purposes
                const isSuccess = true;

                if (isSuccess) {
                    setResult('success');
                    completeActivity(gameState.currentUser.id, 'objectHunt', 10);
                } else {
                    setResult('fail');
                }
                setAnalyzing(false);
            }, 2000);

        } catch (err) {
            console.error(err);
            setAnalyzing(false);
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Caza de Reliquias</h2>
            <p style={{ marginBottom: '2rem' }}>El Profesor necesita ver un: <strong style={{ fontSize: '1.2rem', color: '#e0b0ff' }}>{targetObject}</strong></p>

            {!image ? (
                <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '200px',
                    border: '2px dashed #444',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: 'rgba(0,0,0,0.2)'
                }}>
                    <Camera size={48} color="#666" />
                    <span style={{ marginTop: '1rem', color: '#888' }}>Tomar foto del objeto</span>
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} />
                </label>
            ) : (
                <div style={{ marginBottom: '1rem' }}>
                    <img src={image} alt="Upload" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px', border: '1px solid #444' }} />
                </div>
            )}

            {analyzing && (
                <div style={{ marginTop: '1rem', color: 'var(--color-gold)' }}>
                    <div className="magic-spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p>Analizando reliquia mágica...</p>
                </div>
            )}

            {result === 'success' && (
                <div style={{ marginTop: '1rem', animation: 'fadeIn 0.5s' }}>
                    <CheckCircle size={48} color="#2ecc71" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#2ecc71' }}>¡Correcto!</h3>
                    <p>Has ganado 10 puntos para {gameState.currentUser.house}.</p>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Volver al Aula</button>
                </div>
            )}
        </div>
    );
};

export default ObjectHunt;
