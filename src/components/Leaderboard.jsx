import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy } from 'lucide-react';
import StudentProfileModal from './StudentProfileModal';

const Leaderboard = () => {
    const { gameState } = useGame();
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Sort students by XP and slice top 10
    const sortedStudents = [...gameState.students].sort((a, b) => b.xp - a.xp).slice(0, 10);

    return (
        <div className="card magic-border">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Trophy color="var(--color-gold)" />
                <h3 style={{ margin: 0 }}>Salón de la Fama</h3>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {sortedStudents.map((student, index) => (
                    <li key={student.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.5rem',
                        background: index === 0 ? 'rgba(197, 160, 89, 0.1)' : 'transparent',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '0.5rem'
                    }}>
                        <span style={{
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            width: '20px',
                            color: index === 0 ? 'var(--color-gold)' : 'var(--color-text-muted)'
                        }}>
                            {index + 1}
                        </span>
                        <img 
                            src={student.avatar} 
                            alt={student.name} 
                            style={{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', border: '1px solid #555' }} 
                            onClick={() => setSelectedStudent(student)}
                        />
                        <div style={{ flex: 1 }}>
                            <div 
                                style={{ fontWeight: 'bold', cursor: 'pointer' }}
                                onClick={() => setSelectedStudent(student)}
                            >
                                {student.name}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: `var(--color-${student.house})`, textTransform: 'capitalize' }}>
                                {student.house} • Lvl {student.level}
                            </div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--color-gold)' }}>{student.xp} XP</div>
                    </li>
                ))}
            </ul>

            <StudentProfileModal 
                isOpen={!!selectedStudent} 
                onClose={() => setSelectedStudent(null)} 
                student={selectedStudent} 
            />
        </div>
    );
};

export default Leaderboard;
