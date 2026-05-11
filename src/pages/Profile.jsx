import { useGame } from '../context/GameContext';
import { Shield, Star, Wand2, Award, Orbit, Scroll, Gem, Eye, Coins, Puzzle, Calendar, Cat, Sprout, Vote } from 'lucide-react';
import AttendanceCard from '../components/AttendanceCard';

const Profile = () => {
    const { gameState } = useGame();
    const user = gameState.currentUser;

    if (!user) return null;

    const houseColors = {
        phoenix: { main: '#e74c3c', glow: '#ff6b6b' },
        hipocampus: { main: '#3498db', glow: '#5dade2' },
        unicornius: { main: '#f1c40f', glow: '#f7dc6f' },
        vipera: { main: '#2ecc71', glow: '#58d68d' },
        default: { main: '#9b59b6', glow: '#d7bde2' }
    };

    const theme = houseColors[user.house] || houseColors.default;

    // Simulate Rewards Data
    const rewards = [
        { type: 'Diario', amount: 500, color: '#d946ef', label: 'Premio Diario', icon: '🧪' },
        { type: 'Semanal', amount: 200, color: '#3b82f6', label: 'Premio Semanal', icon: '⚗️' },
        { type: 'Mensual', amount: 50, color: '#10b981', label: 'Premio Mensual', icon: '🏺' }
    ];

    const currentYear = new Date().getFullYear();

    return (
        <div className="profile-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            color: '#e0e7ff',
            fontFamily: '"Orbitron", sans-serif',
            maxWidth: '100%',
            overflowX: 'hidden'
        }}>

            {/* --- HEADER SECTION (Avatar + ID Card) --- */}
            <div className="profile-header">

                {/* Avatar Circle with Neon Ring */}
                <div style={{
                    position: 'relative',
                    width: '200px',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        border: `4px solid #2d1b4e`,
                        boxShadow: `0 0 20px ${theme.main}, inset 0 0 20px ${theme.main}`
                    }} />
                    <img
                        src={user.avatar}
                        alt={user.name}
                        style={{
                            width: '180px',
                            height: '180px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            zIndex: 1
                        }}
                    />
                    {/* Decorative Elements */}
                    <div style={{ position: 'absolute', bottom: -10, background: '#1a0b2e', padding: '0.2rem 1rem', border: `1px solid ${theme.glow}`, borderRadius: '12px', color: theme.glow, fontWeight: 'bold', boxShadow: `0 0 10px ${theme.glow}` }}>
                        {user.house.toUpperCase()}
                    </div>
                </div>

                {/* ID Card Stats */}
                <div className="id-card" style={{
                    background: 'rgba(20, 10, 40, 0.9)',
                    border: '1px solid #a855f7',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%'
                }}>
                    {/* Tech Decor Lines */}
                    <div style={{ position: 'absolute', top: 0, left: 30, right: 30, height: '2px', background: '#d946ef', boxShadow: '0 0 10px #d946ef' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '50px', height: '50px', borderTop: '2px solid #a855f7', borderLeft: '2px solid #a855f7', transform: 'rotate(180deg)' }} />

                    <h2 className="profile-name">
                        Perfil de Estudiante: {user.name}
                    </h2>

                    <div className="stats-grid">
                        <StatRow icon={<Award size={18} color="#3b82f6" />} label="Nivel" value={user.level} bar={(user.xp % 1000) / 10} barColor="#3b82f6" />
                        <StatRow icon={<Coins size={18} color="#eab308" />} label="Puntos" value={`${user.xp} pts`} />
                        <StatRow icon={<Shield size={18} color={theme.main} />} label="Casa" value={user.house} valueColor={theme.glow} />
                        <StatRow icon={<Calendar size={18} color="#ec4899" />} label="Cumpleaños" value={user.birthday || 'Unknown'} />
                        <StatRow icon={<Wand2 size={18} color="#d97706" />} label="Madera" value={user.wand?.wood || '?'} />
                        <StatRow icon={<Gem size={18} color="#ef4444" />} label="Núcleo" value={user.wand?.core || '?'} />
                    </div>
                </div>
            </div>

            {/* --- ACHIEVEMENTS SYSTEM --- */}
            <div style={{
                background: 'rgba(20, 10, 40, 0.8)',
                border: '1px solid #6366f1',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)'
            }}>
                <h3 style={{ color: '#c7d2fe', textTransform: 'uppercase', margin: '0 0 1.5rem 0', borderBottom: '1px solid #4338ca', paddingBottom: '0.5rem' }}>
                    Sistema de Logros
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <AchievementBar title="Desafío del Director" level={`${user.puzzlesSolved || 0}/10`} progress={((user.puzzlesSolved || 0) / 10) * 100} icon={<Puzzle size={24} color="#f472b6" />} color="#f472b6" />
                    <AchievementBar title="Participante Activo" level={`${user.streakVoting || 0}/10`} progress={Math.min((user.streakVoting / 10) * 100, 100)} icon={<Vote size={24} color="#a78bfa" />} color="#a78bfa" />
                    <AchievementBar title="Incógnita Diaria" level={`${Object.keys(user.challengeHistory || {}).length}/10`} progress={Math.min((Object.keys(user.challengeHistory || {}).length / 10) * 100, 100)} icon={<Eye size={24} color="#60a5fa" />} color="#60a5fa" />
                    <AchievementBar title="Botánico" level={`${user.streakPlant || 0}/10`} progress={Math.min((user.streakPlant / 10) * 100, 100)} icon={<Sprout size={24} color="#34d399" />} color="#34d399" />
                    <AchievementBar title="Asistencia" level={`${user.totalAttendance || 0}/100`} progress={Math.min((user.totalAttendance / 100) * 100, 100)} icon={<Orbit size={24} color="#f87171" />} color="#f87171" />
                    <AchievementBar title="Animal Friendly" level={`${user.streakAnimal || 0}/10`} progress={Math.min((user.streakAnimal / 10) * 100, 100)} icon={<Cat size={24} color="#fbbf24" />} color="#fbbf24" />
                </div>
            </div>

            {/* --- XP & DAILY PROGRESS --- */}
            <div className="xp-section">

                {/* XP Bar */}
                <div className="tech-card" style={{ padding: '1.5rem', background: '#1e1b4b', borderRadius: '12px', border: '1px solid #4f46e5' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#a5b4fc' }}>
                        <span>Nivel Actual: {user.level}</span>
                        <span>XP: {user.xp}/{(user.level + 1) * 1000}</span>
                    </div>
                    <div style={{ width: '100%', height: '20px', background: '#312e81', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}>
                        <div style={{
                            width: `${Math.min((user.xp / ((user.level + 1) * 1000)) * 100, 100)}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                            boxShadow: '0 0 10px #a855f7'
                        }} />
                    </div>
                </div>

                {/* Progress Circle (Mockup) */}
                <div className="tech-card" style={{
                    padding: '1rem',
                    background: '#1e1b4b',
                    borderRadius: '12px',
                    border: '1px solid #4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <h4 style={{ margin: 0, color: '#a5b4fc', marginBottom: '0.5rem' }}>Progreso Diario</h4>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399', textShadow: '0 0 10px #34d399' }}>40%</div>
                </div>
            </div>

            {/* --- REWARDS SECTION --- */}
            <div className="rewards-section" style={{
                background: 'rgba(20, 10, 40, 0.9)',
                border: '1px solid #c084fc',
                borderRadius: '16px',
                padding: '1.5rem',
            }}>
                {rewards.map((reward, i) => (
                    <div key={i} className="reward-item">
                        <div style={{
                            fontSize: '3rem',
                            filter: `drop-shadow(0 0 15px ${reward.color})`,
                            animation: `float ${3 + i}s ease-in-out infinite`
                        }}>
                            {reward.icon}
                        </div>
                        <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 'bold' }}>{reward.label}</div>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.8rem',
                            color: '#fbbf24',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <Coins size={12} /> {reward.amount}
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Styles & Media Queries */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }

                /* Desktop Layout (Default) */
                .profile-header {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 2rem;
                    align-items: start;
                }
                .profile-name {
                    margin: 0 0 1rem 0;
                    color: #e0b0ff;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 1.8rem;
                    text-shadow: 0 0 10px #e0b0ff;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .xp-section {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 1.5rem;
                }
                .rewards-section {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                }
                .reward-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                /* Mobile Layout */
                @media (max-width: 768px) {
                    .profile-container {
                        padding: 1rem !important;
                    }
                    .profile-header {
                        grid-template-columns: 1fr;
                        justify-items: center;
                        text-align: center;
                        gap: 1.5rem;
                    }
                    .id-card, .rewards-section, .tech-card, .achievements-container {
                        padding: 1rem !important;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    .profile-name {
                        font-size: 1.5rem;
                        margin-top: 1rem;
                        word-break: break-word; /* Prevent long names from overflowing */
                    }
                    .stats-grid {
                        grid-template-columns: 1fr;
                        gap: 0.8rem;
                        text-align: left;
                    }
                    .xp-section {
                        grid-template-columns: 1fr;
                    }
                    .rewards-section {
                        flex-direction: column;
                        gap: 2rem;
                    }
                    /* Force single column for achievements on mobile to prevent overflow */
                    .achievements-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            {/* QR Access - Retained functionality */}
            <div className="card" style={{ background: '#111', border: '1px solid #333' }}>
                <AttendanceCard />
            </div>
        </div>
    );
};

// --- Helper Components ---

const StatRow = ({ icon, label, value, valueColor = '#fff', bar, barColor }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            {icon} {label}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: valueColor, fontWeight: 'bold', fontSize: '1.1rem' }}>{value}</div>
            {bar !== undefined && (
                <div style={{ flex: 1, height: '6px', background: '#334155', borderRadius: '3px', maxWidth: '100px' }}>
                    <div style={{ width: `${bar}%`, height: '100%', background: barColor, borderRadius: '3px', boxShadow: `0 0 5px ${barColor}` }} />
                </div>
            )}
        </div>
    </div>
);

const AchievementBar = ({ title, level, progress, icon, color }) => (
    <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', fontWeight: '500' }}>
                {icon}
                {title}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Nivel {level}</span>
        </div>
        <div style={{ width: '100%', height: '10px', background: '#1e293b', borderRadius: '5px', overflow: 'hidden', border: '1px solid #334155' }}>
            <div style={{
                width: `${progress}%`,
                height: '100%',
                background: color,
                borderRadius: '5px',
                boxShadow: `0 0 8px ${color}`
            }} />
        </div>
    </div>
);


export default Profile;
