import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import HourglassScoreboard from '../components/HourglassScoreboard';
import DirectorStats from '../components/DirectorStats';
import DailyChallenge from '../components/DailyChallenge';
import Leaderboard from '../components/Leaderboard';
import PetInteraction from '../components/PetInteraction';
import HouseCupHistory from '../components/HouseCupHistory';
import EditProfileModal from '../components/EditProfileModal';
import NoticeBoard from '../components/NoticeBoard';
import BirthdayCard from '../components/BirthdayCard';
import PlantInteraction from '../components/PlantInteraction';
import MagicBreakfast from '../components/MagicBreakfast';
import WisdomCandle from '../components/WisdomCandle';
import ArtisticMoment from '../components/ArtisticMoment';
import DailyTrivia from '../components/DailyTrivia';
import LecturaEncantada from '../components/LecturaEncantada';
import CastleDefense from '../components/CastleDefense';
import CleanupCoop from '../components/CleanupCoop';
import SortingHat from '../components/SortingHat';
import { UserPen, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

const Hall = () => {
    const { gameState, recordAttendance, clearAnnualCelebration } = useGame();
    const { houses, currentUser, annualCelebration } = gameState;

    React.useEffect(() => {
        if (annualCelebration) {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71']
            });
        }
    }, [annualCelebration]);
    const user = currentUser;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const getHouseColor = (house) => {
        const colors = {
            phoenix: '#e74c3c',
            hipocampus: '#3498db',
            unicornius: '#f1c40f',
            vipera: '#2ecc71',
            default: '#999'
        };
        return colors[house] || colors.default;
    };
    const houseColor = user ? getHouseColor(user.house) : '#fff';

    return (
        <>
            {currentUser?.house === 'unassigned' && <SortingHat />}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                backgroundImage: 'url(/src/assets/hall_background_1768520419340.png)',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                minHeight: '80vh',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
                position: 'relative'
            }}>

                {/* Centered User Profile Header */}
                {/* Centered User Profile Header */}
                {user ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '2rem',
                        marginBottom: '3rem',
                        position: 'relative'
                    }}>
                        {/* Edit Trigger */}
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: '25%', // Approximate placement
                                background: 'rgba(255,255,255,0.1)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#ccc',
                                transition: 'all 0.3s'
                            }}
                            title="Editar Perfil"
                        >
                            <UserPen size={20} />
                        </button>

                        <div style={{ position: 'relative', width: '180px', height: '180px', marginBottom: '1.5rem' }}>
                            <img
                                src={user.avatar}
                                alt={user.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    border: '4px solid white', // White border as requested in design
                                    boxShadow: '0 0 30px rgba(0,0,0,0.5)',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>

                        <h1 style={{
                            margin: '0 0 1rem',
                            fontFamily: 'var(--font-serif)',
                            fontSize: '3rem',
                            color: 'white',
                            textShadow: '0 4px 10px rgba(0,0,0,0.5)'
                        }}>
                            {user.name}
                        </h1>

                        <div style={{ marginBottom: '1rem', color: '#ccc', fontSize: '1.2rem', fontStyle: 'italic' }}>
                            {user.role === 'guardian' ? (
                                <span>🛡️ Guardián {user.course === 'graduado' ? 'Graduado' : ''}</span>
                            ) : (
                                <span>📚 Estudiante de {user.course}º Año</span>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{
                                background: '#7d6b28', // Gold/Brownish pill
                                color: '#ffd700',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                border: '1px solid rgba(255, 215, 0, 0.3)'
                            }}>
                                Lvl {user.level}
                            </div>
                            <div style={{
                                background: '#4b2c5e', // Purple pill
                                color: '#e0b0ff',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                border: '1px solid rgba(224, 176, 255, 0.3)'
                            }}>
                                {user.xp} pts
                            </div>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '3rem' }}>
                        <h2 style={{ color: 'var(--color-gold)', textShadow: '0 0 10px #000' }}>¡Bienvenido, Viajero!</h2>
                        <p style={{ color: '#ccc' }}>Inicia sesión para participar en las actividades de la escuela.</p>
                    </div>
                )}

                <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

                {/* Header Title (now smaller/secondary since identity is top) */}
                <header style={{ textAlign: 'center', marginBottom: '1rem', textShadow: '0 4px 10px black' }}>
                    <h1 className="magic-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hall Central</h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>Escuela de Magia y Hechicería</p>
                </header>

                {/* Birthday Card - Top Priority if active */}
                <BirthdayCard />

                {/* Annual Celebration Banner */}
                {annualCelebration && (
                    <div style={{
                        background: 'linear-gradient(45deg, #4c1d95, #7c3aed)',
                        padding: '2rem',
                        borderRadius: '20px',
                        textAlign: 'center',
                        border: '2px solid var(--color-gold)',
                        boxShadow: '0 0 30px rgba(124, 58, 237, 0.5)',
                        animation: 'pulse-slow 2s infinite',
                        color: 'white',
                        marginBottom: '2rem'
                    }}>
                        <PartyPopper size={50} style={{ marginBottom: '1rem' }} />
                        <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>¡FELIZ AÑO NUEVO EN ASTRUM!</h2>
                        <p style={{ fontSize: '1.1rem', margin: 0 }}>
                            El ciclo escolar ha avanzado. Todos los alumnos han ascendido un curso. 🎓✨
                        </p>
                        <button
                            onClick={clearAnnualCelebration}
                            style={{
                                marginTop: '1.5rem',
                                padding: '0.8rem 2rem',
                                background: 'white',
                                color: '#4c1d95',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            ¡Continuar mi Aventura!
                        </button>
                    </div>
                )}

                {/* Notice Board - High Priority */}
                <NoticeBoard />

                {/* Guardian Attendance Button */}
                {user && user.role === 'guardian' && (
                    <div style={{
                        textAlign: 'center', marginBottom: '2rem',
                        background: 'rgba(255, 215, 0, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid var(--color-gold)'
                    }}>
                        <h3 style={{ color: 'var(--color-gold)', marginBottom: '1rem' }}>🛡️ Zona de Guardianes</h3>
                        {user.lastAttendanceDate === new Date().toISOString().split('T')[0] ? (
                            <p style={{ color: '#2ecc71', fontWeight: 'bold' }}>¡Gracias por tu visita de hoy! Has sumado puntos para tu Casa.</p>
                        ) : (
                            <button
                                onClick={() => {
                                    recordAttendance(user.id);
                                    alert("¡Has firmado el Libro de Visitas! +50 Puntos para " + user.house);
                                }}
                                className="button-primary"
                                style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}
                            >
                                ✍️ Firmar Libro de Visitas
                            </button>
                        )}
                    </div>
                )}

                {/* Active Global Event - Highest Priority */}
                <CastleDefense />
                <CleanupCoop />



                {/* Section A: House Hourglasses */}
                <section style={{
                    padding: '2rem',
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: 'var(--radius-lg)',
                    backdropFilter: 'blur(5px)',
                    marginBottom: '1rem'
                }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>
                        Puntuación de las Casas
                    </h2>
                    <HourglassScoreboard houses={houses} />
                </section>

                {/* Grid for other widgets */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Section C: Director Stats */}
                    <DirectorStats />

                    {/* Daily Challenge before Pet */}
                    <DailyChallenge />

                    {/* Pet Interaction */}
                    <PetInteraction />

                    {/* Plant Interaction */}
                    <PlantInteraction />

                    {/* Daily Trivia between Plant and Breakfast */}
                    <DailyTrivia />

                    <MagicBreakfast />
                    <WisdomCandle />
                    <LecturaEncantada />
                    <ArtisticMoment />

                    {/* House Cup History */}
                    <HouseCupHistory />

                    {/* Section F: Leaderboard */}
                    <Leaderboard />
                </div>

            </div>
        </>
    );
};

export default Hall;
