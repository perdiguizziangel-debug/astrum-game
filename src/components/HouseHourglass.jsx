import React from 'react';
import phoenixImg from '../assets/hourglass_phoenix_1768520437599.png';
import hipocampusImg from '../assets/hourglass_hipocampus_1768520454912.png';
import unicorniusImg from '../assets/hourglass_unicornius_1768520472390.png';
import viperaImg from '../assets/hourglass_vipera_1768520507106.png';

const IMAGES = {
    phoenix: phoenixImg,
    hipocampus: hipocampusImg,
    unicornius: unicorniusImg,
    vipera: viperaImg
};

const HouseHourglass = ({ house, name, color, points }) => {
    // Normalize height. Max 500 for visualization
    const heightPercentage = Math.min((points / 500) * 100, 100);

    return (
        <div className="flex flex-col items-center" style={{ position: 'relative', width: '120px', height: '300px' }}>
            {/* Background Image Hourglass */}
            <img src={IMAGES[house]} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, position: 'relative' }} />

            {/* Sand Effect (Behind the image, masked via CSS or simpler overlay approach) */}
            {/* For simplicity with complex images, we will add a glowing orb below/behind */}

            <div style={{
                position: 'absolute',
                bottom: '15%',
                left: '20%',
                right: '20%',
                height: `${heightPercentage * 0.4}%`, // Scale to fit bottom bulb approximately
                background: color,
                opacity: 0.6,
                filter: 'blur(10px)',
                borderRadius: '50% 50% 40% 40%',
                zIndex: 1,
                transition: 'height 1s ease'
            }} />

            <h3 style={{ marginTop: '0.5rem', fontFamily: 'var(--font-serif)', color: color, textAlign: 'center', zIndex: 3 }}>{name}</h3>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', display: 'block', zIndex: 3 }}>{points}</span>
        </div>
    );
};

export default HouseHourglass;
