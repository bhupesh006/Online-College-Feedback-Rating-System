import React, { useState } from 'react';
import { Card as BsCard } from 'react-bootstrap';

const Card = ({ title, icon, onClick }) => {
    const [hover, setHover] = useState(false);

    const cardStyle = {
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: hover ? 'translateY(-5px)' : 'none',
        boxShadow: hover ? '0 10px 20px rgba(0,0,0,0.1)' : '0 4px 6px rgba(0,0,0,0.05)',
        border: hover ? '1px solid #F63049' : '1px solid transparent',
        height: '100%',
        minHeight: '160px'
    };

    const iconStyle = {
        color: hover ? '#F63049' : '#8A244B',
        transition: 'color 0.3s ease',
        marginBottom: '1rem'
    };

    const titleStyle = {
        color: hover ? '#F63049' : '#111F35',
        fontWeight: '600',
        transition: 'color 0.3s ease'
    };

    return (
        <BsCard
            className="text-center h-100 border-0"
            style={cardStyle}
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <BsCard.Body className="d-flex flex-column align-items-center justify-content-center">
                <div style={iconStyle}>{icon}</div>
                <BsCard.Title style={titleStyle}>{title}</BsCard.Title>
            </BsCard.Body>
        </BsCard>
    );
};

export default Card;
