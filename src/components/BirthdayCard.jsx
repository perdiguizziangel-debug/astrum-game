import React from 'react';
import { useGame } from '../context/GameContext';
import { PartyPopper } from 'lucide-react';

const BirthdayCard = () => {
    const { gameState, congratulateUser } = useGame();
    const students = gameState.students;

    const today = new Date();
    const currentMonth = today.getMonth() + 1; // 0-indexed
    const currentDay = today.getDate();

    // Find students whose birthday matches today (MM-DD)
    const birthdayStudents = students.filter(s => {
        if (!s.birthday) return false;
        const [year, month, day] = s.birthday.split('-').map(Number);
        return month === currentMonth && day === currentDay;
    });

    if (birthdayStudents.length === 0) return null;

    return (
        <div className="card magic-border" style={{
            marginTop: '1rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #2c1a3d 0%, #1a1a1a 100%)', // Purple/Dark celebratory gradient
            border: '2px solid #e0b0ff',
            textAlign: 'center'
        }}>
            <h3 style={{
                color: '#e0b0ff',
                fontFamily: 'var(--font-serif)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1.8rem',
                marginBottom: '0.5rem'
            }}>
                <PartyPopper /> ¡FELIX NATALIS!
            </h3>
            <div style={{
                color: 'var(--color-gold)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.2rem',
                marginBottom: '1.5rem'
            }}>
                ¡Carpe diem!
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                {birthdayStudents.map(student => (
                    <div key={student.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <img
                                src={student.avatar}
                                alt={student.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid #e0b0ff',
                                    boxShadow: '0 0 20px rgba(224, 176, 255, 0.4)'
                                }}
                            />
                        </div>

                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>{student.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'capitalize' }}>{student.house}</div>
                        </div>

                        <button
                            onClick={() => {
                                congratulateUser(student.id);
                                alert(`¡Has felicitado a ${student.name}!`);
                            }}
                            className="button-primary"
                            style={{
                                background: '#1a1a1a',
                                border: '2px solid var(--color-gold)',
                                color: 'var(--color-gold)',
                                padding: '0.5rem 1.5rem',
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            🎉 FELICITAR
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BirthdayCard;
