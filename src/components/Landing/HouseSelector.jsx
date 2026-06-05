import React, { useState } from 'react';
import HouseModal from './HouseModal';

const houses = [
    {
        id: 'phoenix',
        name: 'Phoenix',
        color: '#e74c3c',
        values: 'Coraje, Pasión y Renacimiento',
        element: 'Fuego',
        description: 'Aquellos que resurgen de sus cenizas y nunca se rinden ante la adversidad.',
        icon: '🔥' // Placeholder for Shield Image
    },
    {
        id: 'hipocampus',
        name: 'Hipocampus',
        color: '#3498db',
        values: 'Creatividad, Fluidez y Adaptabilidad',
        element: 'Agua',
        description: 'Mentes profundas como el océano y libres como las mareas.',
        icon: '🌊'
    },
    {
        id: 'unicornius',
        name: 'Unicornius',
        color: '#f1c40f',
        values: 'Pureza, Curación y Luz',
        element: 'Luz',
        description: 'Guardianes de la esperanza y sanadores del alma.',
        icon: '✨'
    },
    {
        id: 'vipera',
        name: 'Vipera',
        color: '#2ecc71',
        values: 'Astucia, Ambición y Estrategia',
        element: 'Tierra',
        description: 'Los que tejen el destino con paciencia y golpean con precisión.',
        icon: '🐍'
    }
];

const HouseSelector = () => {
    const [selectedHouse, setSelectedHouse] = useState(null);

    return (
        <div style={{ padding: '4rem 2rem', background: '#0f0f1a' }}>
            <h2 style={{ textAlign: 'center', color: '#fff', fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '3rem' }}>
                Las Casas de Astrum
            </h2>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {houses.map(house => (
                    <div
                        key={house.id}
                        onClick={() => setSelectedHouse(house)}
                        style={{
                            background: `linear-gradient(145deg, #1a1a2e, #16213e)`,
                            border: `2px solid ${house.color}`,
                            borderRadius: '50%',
                            width: '200px',
                            height: '200px',
                            margin: '0 auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            boxShadow: `0 0 15px ${house.color}40`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
                            e.currentTarget.style.boxShadow = `0 0 30px ${house.color}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            e.currentTarget.style.boxShadow = `0 0 15px ${house.color}40`;
                        }}
                    >
                        <span style={{ fontSize: '4rem' }}>{house.icon}</span>
                        <div style={{
                            position: 'absolute', bottom: '-40px',
                            color: house.color,
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.2rem',
                            textTransform: 'capitalize',
                            letterSpacing: '1px'
                        }}>
                            {house.name}
                        </div>
                    </div>
                ))}
            </div>

            <HouseModal house={selectedHouse} onClose={() => setSelectedHouse(null)} />
        </div>
    );
};

export default HouseSelector;
