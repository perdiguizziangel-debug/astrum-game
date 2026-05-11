import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, MessageSquare, Send, Award, Zap } from 'lucide-react';

const SortingHat = () => {
    const { gameState, setHouse } = useGame();
    const { currentUser } = gameState;
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignedHouse, setAssignedHouse] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState('intro'); // 'intro', 'questions', 'tiebreak', 'final'
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [scores, setScores] = useState({ phoenix: 0, hipocampus: 0, unicornius: 0, vipera: 0 });
    const [history, setHistory] = useState([]); // To record choices for Gemini
    const [leadingHouse, setLeadingHouse] = useState(null);

    const scrollRef = useRef(null);

    const sortingQuestions = [
        {
            q: "¿Qué valor consideras más importante en una persona?",
            options: [
                { text: "El entusiasmo y la valentía para enfrentar lo desconocido.", house: 'phoenix' },
                { text: "La fidelidad inquebrantable hacia sus seres queridos.", house: 'hipocampus' },
                { text: "El optimismo constante, incluso en los días más oscuros.", house: 'unicornius' },
                { text: "La astucia y la inteligencia para resolver problemas complejos.", house: 'vipera' }
            ]
        },
        {
            q: "Si pudieras elegir una habilidad mágica, ¿cuál sería?",
            options: [
                { text: "La capacidad de volverme invisible a voluntad.", house: 'phoenix' },
                { text: "La oclumancia, para proteger mi mente de intrusos.", house: 'hipocampus' },
                { text: "La velocidad sobrehumana para recorrer el mundo.", house: 'unicornius' },
                { text: "Una memoria perfecta para nunca olvidar un conocimiento.", house: 'vipera' }
            ]
        },
        {
            q: "Es tarde en la noche, ¿qué actividad prefieres realizar?",
            options: [
                { text: "Practicar algún deporte o actividad física que me llene de energía.", house: 'phoenix' },
                { text: "Disfrutar de una buena lectura o una partida estratégica de ajedrez.", house: 'hipocampus' },
                { text: "Salir a divertirme y compartir risas con mis amigos.", house: 'unicornius' },
                { text: "Estudiar un tema nuevo o reflexionar profundamente en soledad.", house: 'vipera' }
            ]
        },
        {
            q: "¿Con qué elemento de la naturaleza de los Andes te sientes más conectado?",
            options: [
                { text: "Con el calor del fuego de una fogata bajo las estrellas.", house: 'phoenix' },
                { text: "Con la serenidad del agua de un lago cristalino.", house: 'hipocampus' },
                { text: "Con la frescura del aire puro de las altas cumbres.", house: 'unicornius' },
                { text: "Con la fuerza de la tierra y la vegetación de los valles.", house: 'vipera' }
            ]
        },
        {
            q: "Tus conocidos suelen describir tu carácter como:",
            options: [
                { text: "Amistoso y siempre dispuesto a ayudar.", house: 'phoenix' },
                { text: "Misterioso y difícil de descifrar a primera vista.", house: 'hipocampus' },
                { text: "Alegre y el alma de cualquier reunión.", house: 'unicornius' },
                { text: "Pensativo y muy observador de los detalles.", house: 'vipera' }
            ]
        },
        {
            q: "Si tuvieras que elegir una joya de los tesoros de Cristóforo Nixus, ¿cuál sería?",
            options: [
                { text: "Un rubí engarzado en oro puro.", house: 'phoenix' },
                { text: "Un zafiro montado sobre plata fina.", house: 'hipocampus' },
                { text: "Un diamante brillante sobre una base de oro.", house: 'unicornius' },
                { text: "Una esmeralda profunda sobre un soporte de plata.", house: 'vipera' }
            ]
        },
        {
            q: "¿Cuál de estas asignaturas de los fundadores te atrae más?",
            options: [
                { text: "Transformaciones (con Ruperto Fórmitus).", house: 'phoenix' },
                { text: "Herbología (con Marlen Marion).", house: 'hipocampus' },
                { text: "Encantamientos (con Electra Fúlminis).", house: 'unicornius' },
                { text: "Pociones (con Bencenio Acre).", house: 'vipera' }
            ]
        },
        {
            q: "¿Cuál consideras que es tu mayor defecto?",
            options: [
                { text: "A veces soy demasiado terco cuando creo tener la razón.", house: 'phoenix' },
                { text: "Puedo ser un poco inconstante con mis planes.", house: 'hipocampus' },
                { text: "Me dicen que hablo demasiado y no sé cuándo callar.", house: 'unicornius' },
                { text: "Suelo ser muy reservado y me cuesta abrirme a los demás.", house: 'vipera' }
            ]
        },
        {
            q: "¿Qué colores elegirías para decorar tu estandarte personal?",
            options: [
                { text: "Rojo y Oro.", house: 'phoenix' },
                { text: "Azul y Plata.", house: 'hipocampus' },
                { text: "Amarillo y Oro.", house: 'unicornius' },
                { text: "Verde y Plata.", house: 'vipera' }
            ]
        },
        {
            q: "Ante una crisis en el Castillo de Astrum, tú:",
            options: [
                { text: "Te lanzas con valentía al frente para proteger a todos.", house: 'phoenix' },
                { text: "Te mantienes fiel a tu grupo, analizando el misterio desde las sombras.", house: 'hipocampus' },
                { text: "Mantienes la calma con una sonrisa para que nadie pierda la esperanza.", house: 'unicornius' },
                { text: "Utilizas tu astucia para trazar un plan perfecto antes de actuar.", house: 'vipera' }
            ]
        }
    ];

    const tieBreakQuestions = {
        question: "Casi puedo verlo... pero dos caminos se abren ante ti. Dime, ¿cuál de estos seres fantásticos resuena con el latido de tu alma?",
        options: [
            { text: "El Fénix, que renace de sus cenizas con fuego eterno.", house: 'phoenix' },
            { text: "El Hipocampo, que fluye con la gracia de las mareas.", house: 'hipocampus' },
            { text: "El Unicornio, que irradia la pureza de la luz astral.", house: 'unicornius' },
            { text: "El Basilisco, que domina desde el silencio de las sombras.", house: 'vipera' }
        ]
    };

    const handleAnswer = (choice) => {
        const newScores = { ...scores, [choice.house]: scores[choice.house] + 1 };
        setScores(newScores);
        setHistory(prev => [...prev, { q: sortingQuestions[currentQuestionIndex].q, a: choice.text, house: choice.house }]);

        // Calculate leading house
        const maxScore = Math.max(...Object.values(newScores));
        const leading = Object.keys(newScores).filter(h => newScores[h] === maxScore);
        if (leading.length === 1) setLeadingHouse(leading[0]);
        else setLeadingHouse(null);

        if (currentQuestionIndex < sortingQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Check for tie
            const finalMaxScore = Math.max(...Object.values(newScores));
            const winners = Object.keys(newScores).filter(h => newScores[h] === finalMaxScore);

            if (winners.length > 1) {
                setCurrentStep('tiebreak');
                setLeadingHouse(null);
            } else {
                handleFinalVerdict(winners[0], newScores);
            }
        }
    };

    const handleTieBreak = (choice) => {
        handleFinalVerdict(choice.house, scores);
    };

    const handleFinalVerdict = async (winner, finalScores) => {
        setCurrentStep('final');
        setAssignedHouse(winner);
        setLoading(true);

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Eres el Sombrero Seleccionador de Astrum. 
                                Has realizado un cuestionario a un estudiante. Aquí están sus respuestas y afinidades:
                                ${history.map(h => `- ${h.q}: ${h.a} (Afinidad: ${h.house})`).join('\n')}
                                
                                El resultado final es la casa: **${winner.toUpperCase()}**.
                                
                                Instrucciones:
                                1. Mantén un tono solemne, místico y sabio.
                                2. Analiza POR QUÉ pertenece a esa casa basándote en un par de sus respuestas.
                                3. Termina SIEMPRE con: "¡Ah, veo que tu corazón late con [Virtud de la Casa]! Tu lugar está en... ¡${winner.toUpperCase()}!"
                                
                                Responde en español.`
                            }]
                        }]
                    })
                }
            );

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || `Interesante... Tu camino es claro. ¡${winner.toUpperCase()}!`;
            setMessages([{ role: 'assistant', content: text }]);

            // Set house in DB/Context
            setTimeout(() => {
                setHouse(currentUser.id, winner);
                setIsComplete(true);
            }, 6000);
        } catch (err) {
            console.error(err);
            setMessages([{ role: 'assistant', content: `El destino ha hablado. ¡${winner.toUpperCase()}!` }]);
            setTimeout(() => {
                setHouse(currentUser.id, winner);
                setIsComplete(true);
            }, 6000);
        } finally {
            setLoading(false);
        }
    };

    const houseColors = {
        phoenix: '#ef4444',
        hipocampus: '#3b82f6',
        unicornius: '#fbbf24',
        vipera: '#8b5cf6'
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(5, 5, 20, 0.95)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            fontFamily: '"Orbitron", sans-serif'
        }}>
            <div style={{
                width: '90%', maxWidth: '600px', height: '80vh',
                background: '#0a0a1a',
                border: `2px solid ${assignedHouse ? houseColors[assignedHouse] : (leadingHouse ? houseColors[leadingHouse] : '#4c1d95')}`,
                borderRadius: '24px', display: 'flex', flexDirection: 'column',
                boxShadow: (assignedHouse || leadingHouse) ? `0 0 30px ${assignedHouse ? houseColors[assignedHouse] : houseColors[leadingHouse]}` : '0 0 40px rgba(76, 29, 149, 0.4)',
                overflow: 'hidden', position: 'relative',
                transition: 'all 0.5s ease'
            }}>
                {/* Content */}
                <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                    {currentStep === 'intro' && (
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <p style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                "Ah... un nuevo nombre se inscribe en los anales de Astrum. Acércate, no temas.
                                Necesito ver aquello que ocultas tras tu mirada... lo que late en tu corazón."
                            </p>
                            <button
                                onClick={() => setCurrentStep('questions')}
                                className="magic-btn"
                                style={{
                                    padding: '1rem 3rem', background: 'linear-gradient(45deg, #4c1d95, #6d28d9)',
                                    border: 'none', borderRadius: '12px', color: '#fff', fontSize: '1rem',
                                    fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 20px rgba(109, 40, 217, 0.5)'
                                }}
                            >
                                INICIAR SELECCIÓN
                            </button>
                        </div>
                    )}

                    {currentStep === 'questions' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ color: '#6d28d9', fontSize: '0.8rem', fontWeight: 'bold' }}>PREGUNTA {currentQuestionIndex + 1}/10</span>
                                <div style={{ width: '100px', height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(currentQuestionIndex + 1) * 10}%`, height: '100%', background: '#6d28d9' }} />
                                </div>
                            </div>

                            <h3 style={{ color: '#fff', fontSize: '1.2rem', lineHeight: '1.4', margin: 0 }}>
                                {sortingQuestions[currentQuestionIndex].q}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {sortingQuestions[currentQuestionIndex].options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(opt)}
                                        style={{
                                            textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                                            color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s',
                                            fontSize: '0.9rem'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(109, 40, 217, 0.1)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 'tiebreak' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ color: '#fbbf24', fontSize: '1.2rem', lineHeight: '1.4', margin: 0 }}>
                                {tieBreakQuestions.question}
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {tieBreakQuestions.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleTieBreak(opt)}
                                        style={{
                                            textAlign: 'left', padding: '1rem', background: 'rgba(251, 191, 36, 0.05)',
                                            border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '12px',
                                            color: '#e2e8f0', cursor: 'pointer', transition: 'all 0.2s',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 'final' && (
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            {loading ? (
                                <div style={{ marginTop: '3rem' }}>
                                    <Zap size={40} color="#6d28d9" style={{ animation: 'spin 1.5s linear infinite' }} />
                                    <p style={{ color: '#6d28d9', marginTop: '1rem', fontWeight: 'bold' }}>ESCRUTANDO TU ALMA...</p>
                                </div>
                            ) : (
                                <>
                                    <p style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6', fontStyle: 'italic' }}>
                                        {messages[0]?.content}
                                    </p>

                                    <div style={{
                                        width: '200px', height: '200px', position: 'relative',
                                        animation: 'float 4s ease-in-out infinite'
                                    }}>
                                        <img
                                            src={`/src/assets/shields/${assignedHouse}.jpg`}
                                            alt={assignedHouse}
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'contain',
                                                filter: `drop-shadow(0 0 20px ${houseColors[assignedHouse]})`
                                            }}
                                        />
                                    </div>

                                    <div style={{
                                        fontSize: '2rem', fontWeight: '900', color: houseColors[assignedHouse],
                                        textShadow: `0 0 10px ${houseColors[assignedHouse]}`,
                                        letterSpacing: '5px', textTransform: 'uppercase'
                                    }}>
                                        ¡{assignedHouse}!
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse { 
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .magic-btn:hover {
                    transform: scale(1.05);
                    filter: brightness(1.2);
                }
                ::-webkit-scrollbar {
                    width: 6px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(109, 40, 217, 0.3);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default SortingHat;
