import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Brain, CheckCircle, RefreshCw, Send, AlertCircle } from 'lucide-react';

/**
 * AITriviaGenerator - Panel del Director para generar Incógnita Diaria con IA Gemini.
 * El director puede elegir un tema y la IA genera una pregunta de 4 opciones,
 * la cual queda activa con caducidad de 24 horas para todos los alumnos.
 */
const FALLBACK_QUESTIONS = [
    {
        question: "¿Qué elemento químico tiene el símbolo Au?",
        options: ["Oro", "Plata", "Cobre", "Hierro"],
        correctAnswer: 0,
        funFact: "El oro es extremadamente maleable y conduce la electricidad de forma excelente."
    },
    {
        question: "¿Cuál es el planeta más grande de nuestro sistema solar?",
        options: ["Marte", "Tierra", "Júpiter", "Saturno"],
        correctAnswer: 2,
        funFact: "Júpiter es tan grande que en él podrían caber todos los demás planetas juntos."
    },
    {
        question: "¿Cuál es el animal terrestre más rápido del mundo?",
        options: ["León", "Guepardo", "Tigre", "Antílope"],
        correctAnswer: 1,
        funFact: "El guepardo puede alcanzar velocidades de hasta 120 km/h en carreras cortas."
    },
    {
        question: "¿Cómo se llama el ave legendaria que renace de sus propias cenizas?",
        options: ["Grifo", "Fénix", "Pegaso", "Hipogrifo"],
        correctAnswer: 1,
        funFact: "El fénix simboliza la resiliencia y el renacimiento en múltiples mitologías."
    },
    {
        question: "¿Qué criatura mitológica es mitad humana y mitad pez?",
        options: ["Sirena", "Arpía", "Quimera", "Esfinge"],
        correctAnswer: 0,
        funFact: "Las sirenas atraían a los marineros con sus hermosos cantos en las leyendas antiguas."
    },
    {
        question: "¿Cuál es el animal mitológico con el cuerpo de caballo y un cuerno en la frente?",
        options: ["Minotauro", "Grifo", "Unicornio", "Centauro"],
        correctAnswer: 2,
        funFact: "Los unicornios representan la pureza y la fuerza indomable."
    },
    {
        question: "¿Cuál es la capital de Italia?",
        options: ["Roma", "Venecia", "Milán", "Nápoles"],
        correctAnswer: 0,
        funFact: "Roma es conocida como la Ciudad Eterna."
    },
    {
        question: "¿Quién pintó la famosa obra 'La Mona Lisa'?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswer: 2,
        funFact: "La Mona Lisa es uno de los retratos más famosos y valiosos del mundo, expuesto en el museo del Louvre."
    }
];

const AITriviaGenerator = () => {
    const { gameState, setDailyTrivia } = useGame();
    const { dailyTrivia } = gameState;

    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('medio');
    const [generatedQuestion, setGeneratedQuestion] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublished, setIsPublished] = useState(false);
    const [error, setError] = useState(null);

    const quickTopics = [
        '🧪 Ciencias Naturales',
        '📚 Literatura',
        '🌍 Geografía',
        '📐 Matemáticas',
        '🏛️ Historia',
        '🎨 Arte',
        '🔭 Astronomía',
        '🐾 Animales',
        '⚗️ Química',
        '🌿 Biología',
    ];

    const isExpired = dailyTrivia?.expiresAt
        ? Date.now() > dailyTrivia.expiresAt
        : true;
    const hasActiveTrivia = dailyTrivia?.question && !isExpired;
    const expiresIn = dailyTrivia?.expiresAt
        ? Math.max(0, Math.ceil((dailyTrivia.expiresAt - Date.now()) / (1000 * 60 * 60)))
        : 0;

    const generateQuestion = async () => {
        if (!topic.trim()) {
            setError('Por favor ingresa un tema para la pregunta.');
            return;
        }
        setIsGenerating(true);
        setError(null);
        setGeneratedQuestion(null);
        setIsPublished(false);

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            // Simular retraso de carga
            await new Promise(resolve => setTimeout(resolve, 800));
            const randomIndex = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
            const question = FALLBACK_QUESTIONS[randomIndex];
            setGeneratedQuestion(question);
            setError('⚠️ Usando preguntas de respaldo locales. Agrega VITE_GEMINI_API_KEY al archivo .env para habilitar generación en tiempo real con IA.');
            setIsGenerating(false);
            return;
        }

        try {
            const prompt = `Genera una pregunta de trivia educativa sobre el tema "${topic}" con dificultad ${difficulty}.
La pregunta debe ser interesante, educativa y apropiada para alumnos de escuela primaria/secundaria.

Devuelve ÚNICAMENTE un JSON estrictamente con este formato, sin texto adicional:
{
  "question": "Pregunta en español aquí (máximo 120 caracteres, clara y concisa)",
  "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
  "correctAnswer": 0,
  "funFact": "Dato curioso relacionado con la respuesta correcta (50 palabras máximo)"
}

Donde "correctAnswer" es el ÍNDICE (0-3) de la opción correcta dentro del array "options".
Las opciones incorrectas deben ser plausibles pero claramente distintas de la correcta.`;

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 0.7,
                            maxOutputTokens: 512,
                        }
                    })
                }
            );

            if (!res.ok) throw new Error(`API Error: ${res.status}`);

            const data = await res.json();
            const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const cleaned = responseText.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleaned);

            if (!parsed.question || !Array.isArray(parsed.options) || parsed.options.length !== 4 || parsed.correctAnswer === undefined) {
                throw new Error('Formato de respuesta inesperado de la IA.');
            }

            setGeneratedQuestion(parsed);
        } catch (err) {
            console.error('AI Trivia generation error:', err);
            if (err.message === 'NO_API_KEY') {
                setError('⚠️ No se encontró VITE_GEMINI_API_KEY. Configura tu API key de Gemini en el archivo .env del proyecto.');
            } else if (err instanceof SyntaxError) {
                setError('La IA devolvió un formato inesperado. Intenta nuevamente.');
            } else {
                setError(`Error al generar: ${err.message}`);
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const publishQuestion = () => {
        if (!generatedQuestion) return;
        setDailyTrivia({
            question: generatedQuestion.question,
            options: generatedQuestion.options,
            correctAnswer: generatedQuestion.correctAnswer,
            image: null,
        });
        setIsPublished(true);
    };

    const cardStyle = {
        background: 'rgba(15, 10, 30, 0.95)',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        borderRadius: '16px',
        padding: '1.5rem',
        color: 'white',
    };

    return (
        <div style={cardStyle}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{
                    width: '44px', height: '44px',
                    background: 'linear-gradient(135deg, #6d28d9, #00f2fe)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(109, 40, 217, 0.4)',
                    flexShrink: 0,
                }}>
                    <Brain size={22} color="white" />
                </div>
                <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#e2e8f0' }}>
                        Incógnita Diaria con IA
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                        Gemini genera la pregunta automáticamente
                    </p>
                </div>
            </div>

            {/* Current trivia status */}
            {hasActiveTrivia && (
                <div style={{
                    background: 'rgba(0, 242, 254, 0.08)',
                    border: '1px solid rgba(0, 242, 254, 0.3)',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00f2fe', fontWeight: '600', marginBottom: '0.3rem' }}>
                        <CheckCircle size={14} />
                        INCÓGNITA ACTIVA
                    </div>
                    <div style={{ color: '#94a3b8', lineHeight: 1.4 }}>
                        "{dailyTrivia.question}"
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.4rem' }}>
                        ⏱ Expira en {expiresIn}h · {dailyTrivia.solvedBy?.length || 0} alumnos respondieron
                    </div>
                </div>
            )}

            {/* Topic input */}
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                    TEMA DE LA PREGUNTA
                </label>
                <input
                    type="text"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generateQuestion()}
                    placeholder="Ej: Planetas del sistema solar, Revolución Francesa..."
                    style={{
                        width: '100%',
                        padding: '0.7rem 1rem',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#a855f7'}
                    onBlur={e => e.target.style.borderColor = 'rgba(139, 92, 246, 0.4)'}
                />
            </div>

            {/* Quick topics */}
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>TEMAS RÁPIDOS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {quickTopics.map(t => (
                        <button
                            key={t}
                            onClick={() => setTopic(t)}
                            style={{
                                padding: '0.3rem 0.6rem',
                                background: topic === t ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${topic === t ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '20px',
                                color: topic === t ? '#e2e8f0' : '#94a3b8',
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty selector */}
            <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                    DIFICULTAD
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[
                        { value: 'fácil', label: '🟢 Fácil' },
                        { value: 'medio', label: '🟡 Medio' },
                        { value: 'difícil', label: '🔴 Difícil' },
                    ].map(d => (
                        <button
                            key={d.value}
                            onClick={() => setDifficulty(d.value)}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                background: difficulty === d.value ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                border: `1px solid ${difficulty === d.value ? '#a855f7' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '8px',
                                color: difficulty === d.value ? '#e2e8f0' : '#64748b',
                                fontSize: '0.8rem',
                                fontWeight: difficulty === d.value ? '700' : '400',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                        >
                            {d.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate button */}
            <button
                onClick={generateQuestion}
                disabled={isGenerating || !topic.trim()}
                style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: isGenerating || !topic.trim()
                        ? '#1e293b'
                        : 'linear-gradient(90deg, #6d28d9, #00f2fe)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    letterSpacing: '1px',
                    cursor: isGenerating || !topic.trim() ? 'not-allowed' : 'pointer',
                    opacity: !topic.trim() ? 0.4 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    transition: 'all 0.3s',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                }}
            >
                {isGenerating ? (
                    <>
                        <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Generando con IA...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        Generar Incógnita
                    </>
                )}
            </button>

            {/* Error message */}
            {error && (
                <div style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    color: '#fca5a5',
                    fontSize: '0.85rem',
                    display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                    marginBottom: '1rem',
                }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
                    {error}
                </div>
            )}

            {/* Generated question preview */}
            {generatedQuestion && (
                <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(139, 92, 246, 0.5)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                }}>
                    <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: '700', letterSpacing: '1px', marginBottom: '0.75rem' }}>
                        VISTA PREVIA
                    </div>

                    <p style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '0.95rem', margin: '0 0 1rem', lineHeight: 1.5 }}>
                        {generatedQuestion.question}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                        {generatedQuestion.options.map((opt, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    background: idx === generatedQuestion.correctAnswer
                                        ? 'rgba(16, 185, 129, 0.15)'
                                        : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${idx === generatedQuestion.correctAnswer ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    color: idx === generatedQuestion.correctAnswer ? '#6ee7b7' : '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                <span style={{ color: '#64748b', fontWeight: '700' }}>{String.fromCharCode(65 + idx)}.</span>
                                {opt}
                                {idx === generatedQuestion.correctAnswer && <CheckCircle size={12} color="#10b981" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                            </div>
                        ))}
                    </div>

                    {generatedQuestion.funFact && (
                        <div style={{
                            background: 'rgba(251, 191, 36, 0.08)',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '8px',
                            padding: '0.6rem 0.8rem',
                            fontSize: '0.8rem',
                            color: '#fbbf24',
                        }}>
                            💡 {generatedQuestion.funFact}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                            onClick={generateQuestion}
                            disabled={isGenerating}
                            style={{
                                flex: 1,
                                padding: '0.6rem',
                                background: 'transparent',
                                border: '1px solid rgba(139, 92, 246, 0.4)',
                                borderRadius: '8px',
                                color: '#a855f7',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                            }}
                        >
                            <RefreshCw size={13} />
                            Regenerar
                        </button>

                        <button
                            onClick={publishQuestion}
                            disabled={isPublished}
                            style={{
                                flex: 2,
                                padding: '0.6rem',
                                background: isPublished
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'linear-gradient(90deg, #6d28d9, #00f2fe)',
                                border: isPublished ? '1px solid #10b981' : 'none',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                cursor: isPublished ? 'default' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                                transition: 'all 0.3s',
                            }}
                        >
                            {isPublished ? (
                                <>
                                    <CheckCircle size={14} color="#10b981" />
                                    ¡Publicada!
                                </>
                            ) : (
                                <>
                                    <Send size={14} />
                                    Publicar (24h)
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AITriviaGenerator;
