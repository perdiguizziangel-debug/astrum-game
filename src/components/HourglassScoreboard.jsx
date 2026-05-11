import React from 'react';
import phoenixImg from '../assets/hourglass_phoenix.jpg';
import hipocampusImg from '../assets/hourglass_hipocampus.jpg';
import unicorniusImg from '../assets/hourglass_unicornius.jpg';
import viperaImg from '../assets/hourglass_vipera.jpg';

const HourglassItem = ({ house, data, image }) => {
    return (
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* House Name Label - Floating Above */}
            <div style={{
                position: 'absolute',
                top: '-40px', // Lift well above the hourglass
                background: 'rgba(0,0,0,0.6)',
                padding: '0.3rem 0.8rem',
                borderRadius: '8px',
                border: `1px solid ${data.color}`,
                backdropFilter: 'blur(2px)',
                zIndex: 10,
                textAlign: 'center',
                minWidth: '90px'
            }}>
                <span style={{
                    color: data.color,
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    textShadow: `0 0 5px ${data.color}`,
                    letterSpacing: '1px'
                }}>
                    {house}
                </span>
            </div>

            {/* Individual Hourglass Image */}
            <img
                src={image}
                alt={`${house} Hourglass`}
                style={{
                    width: '100%',
                    maxWidth: '180px',
                    display: 'block',
                    borderRadius: '8px',
                    objectFit: 'contain'
                }}
            />

            {/* Score Badge - Below Base */}
            <div style={{
                marginTop: '15px', // Distinct separation from the metal base
                background: 'rgba(0,0,0,0.7)',
                padding: '0.2rem 1rem',
                borderRadius: '12px',
                border: `1px solid ${data.color}`,
                textAlign: 'center',
                backdropFilter: 'blur(2px)',
                minWidth: '60px'
            }}>
                <span style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontFamily: 'var(--font-serif)',
                    textShadow: `0 0 5px ${data.color}`,
                    fontWeight: 'bold'
                }}>
                    {data.points}
                </span>
            </div>
        </div>
    );
};

const HourglassScoreboard = ({ houses }) => {
    // Requested Order: Red (Phoenix), Blue (Hipocampus), Yellow (Unicornius), Green (Vipera)
    const displayOrder = [
        { key: 'phoenix', img: phoenixImg },
        { key: 'hipocampus', img: hipocampusImg },
        { key: 'unicornius', img: viperaImg }, // Swapped to fix color: viperaImg seems to be Yellow
        { key: 'vipera', img: unicorniusImg }  // Swapped to fix color: unicorniusImg seems to be Green
    ];

    return (
        <div style={{
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem', // Spacing between individual hourglasses
            padding: '3rem 1rem 2rem 1rem' // Added top/bottom padding to accommodate floating labels and dropped scores
        }}>
            {displayOrder.map(({ key, img }) => (
                <HourglassItem key={key} house={key} data={houses[key]} image={img} />
            ))}
        </div>
    );
};

export default HourglassScoreboard;
