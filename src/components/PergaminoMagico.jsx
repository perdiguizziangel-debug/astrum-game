import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Scroll, Sparkles, Send, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const PergaminoMagico = () => {
    const { gameState, submitPergaminoText } = useGame();
    const { currentUser, arcaneGlossary = [], interactionHistory = [] } = gameState;
    const [text, setText] = useState('');
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [result, setResult] = useState(null);

    if (!currentUser || currentUser.role === 'director') return null;

    const hasSubmittedToday = interactionHistory.some(
        h => h.userId === currentUser.id && h.type === 'pergamino' && (Date.now() - h.timestamp < 24 * 60 * 60 * 1000)
    );

    const handleEvaluate = async () => {
        if (!text.trim()) return;
        setIsEvaluating(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error('NO_API_KEY');

            const glossaryTerms = arcaneGlossary.map(g => `${g.term}: ${g.description}`).join('\n');

            const prompt = `Evalúa el siguiente texto mágico basándote en los criterios dados.
Texto del alumno: "${text}"

Glosario Arcano Disponible:
${glossaryTerms}

Criterios:
1. Recurso (0-40 pts): Uso e integración de términos del Glosario Arcano.
2. Palabras (0-20 pts): Vocabulario rico y longitud adecuada.
3. Creatividad (0-20 pts): Originalidad en el uso de magia.
4. Ortografía (0-10 pts): Corrección gramatical.
5. Coherencia (0-10 pts): Lógica narrativa.

Devuelve un JSON estrictamente con este formato:
{
  "recurso": 30,
  "palabras": 15,
  "creatividad": 18,
  "ortografia": 9,
  "coherencia": 8,
  "feedback": "Comentario mágico para el estudiante."
}
`;

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                }
            );

            const data = await res.json();
            const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleaned = responseText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            const totalScore = parsed.recurso + parsed.palabras + parsed.creatividad + parsed.ortografia + parsed.coherencia;

            const scoreData = {
                ...parsed,
                total: totalScore
            };

            setResult(scoreData);
            submitPergaminoText(currentUser.id, text, scoreData);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#c084fc', '#00f2fe', '#facc15']
            });

        } catch (error) {
            console.error("Gemini Evaluation Error", error);
            alert("El Pergamino se ha atascado. Verifica tu VITE_GEMINI_API_KEY o inténtalo más tarde.");
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <div style={{
            background: 'url(/house-rooms/astrum-library.jpg) center/cover', // Just a placeholder BG
            position: 'relative',
            borderRadius: '20px',
            padding: '2px',
            boxShadow: '0 0 30px rgba(192, 132, 252, 0.2)',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(15,15,25,0.95), rgba(45,20,60,0.95))',
                zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1, padding: '2rem', color: 'white', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <div style={{
                        width: '80px', height: '80px',
                        background: 'rgba(192, 132, 252, 0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '2px solid #c084fc',
                        boxShadow: '0 0 20px rgba(192, 132, 252, 0.5)'
                    }}>
                        <Scroll size={40} color="#c084fc" />
                    </div>
                </div>

                <h2 style={{ color: '#e9d5ff', fontFamily: 'var(--font-serif)', fontSize: '2rem', margin: '0 0 0.5rem' }}>
                    El Pergamino Mágico
                </h2>
                <p style={{ color: '#c084fc', marginBottom: '2rem' }}>
                    Escribe tu relato incorporando términos del Glosario Arcano. Ignis, el fuego sabio, evaluará tu obra.
                </p>

                {hasSubmittedToday && !result ? (
                    <div style={{
                        background: 'rgba(0, 242, 254, 0.1)',
                        border: '1px solid #00f2fe',
                        padding: '2rem',
                        borderRadius: '12px',
                        color: '#00f2fe'
                    }}>
                        <CheckCircle size={48} style={{ margin: '0 auto 1rem' }} />
                        <h3 style={{ margin: 0 }}>¡Relato Enviado Hoy!</h3>
                        <p style={{ marginTop: '0.5rem' }}>Vuelve mañana para escribir una nueva historia.</p>
                    </div>
                ) : result ? (
                    <div style={{
                        background: 'rgba(255, 215, 0, 0.1)',
                        border: '1px solid var(--color-gold)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ color: 'var(--color-gold)', textAlign: 'center', marginTop: 0 }}>Evaluación de Ignis</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>🌟 Recurso Arcano: <strong style={{ color: 'white' }}>{result.recurso}/40</strong></div>
                            <div>📝 Palabras: <strong style={{ color: 'white' }}>{result.palabras}/20</strong></div>
                            <div>✨ Creatividad: <strong style={{ color: 'white' }}>{result.creatividad}/20</strong></div>
                            <div>✍️ Ortografía: <strong style={{ color: 'white' }}>{result.ortografia}/10</strong></div>
                            <div>🔗 Coherencia: <strong style={{ color: 'white' }}>{result.coherencia}/10</strong></div>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '1.5rem', color: 'var(--color-gold)', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Puntaje Total: {result.total}/100 XP
                        </div>
                        <p style={{ fontStyle: 'italic', color: '#e9d5ff', borderLeft: '3px solid #c084fc', paddingLeft: '1rem', margin: 0 }}>
                            "{result.feedback}"
                        </p>
                    </div>
                ) : (
                    <>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Había una vez, en los salones de cristal de Aethelgard..."
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                background: 'rgba(0,0,0,0.5)',
                                border: '1px solid #c084fc',
                                borderRadius: '12px',
                                color: 'white',
                                padding: '1rem',
                                fontSize: '1rem',
                                resize: 'vertical',
                                marginBottom: '1.5rem',
                                outline: 'none'
                            }}
                        />

                        <button
                            onClick={handleEvaluate}
                            disabled={!text.trim() || isEvaluating}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: isEvaluating ? '#444' : 'linear-gradient(90deg, #c084fc, #7c3aed)',
                                border: 'none',
                                borderRadius: '12px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                cursor: (text.trim() && !isEvaluating) ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            {isEvaluating ? (
                                <>
                                    <Sparkles className="animate-spin" />
                                    Ignis está leyendo...
                                </>
                            ) : (
                                <>
                                    <Send size={20} />
                                    Sellar y Evaluar Relato
                                </>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PergaminoMagico;
