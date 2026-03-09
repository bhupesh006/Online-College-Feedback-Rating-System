import React, { useState } from 'react';

const StarRating = ({ rating, onChange, disabled = false }) => {
    const [hover, setHover] = useState(0);

    return (
        <div style={styles.container}>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        type="button"
                        key={ratingValue}
                        style={styles.button}
                        onClick={() => !disabled && onChange(ratingValue)}
                        onMouseEnter={() => !disabled && setHover(ratingValue)}
                        onMouseLeave={() => !disabled && setHover(0)}
                        disabled={disabled}
                    >
                        <span
                            style={{
                                ...styles.star,
                                color: ratingValue <= (hover || rating) ? '#FFD700' : '#e4e5e9'
                            }}
                        >
                            ★
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        gap: '5px',
    },
    button: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
    },
    star: {
        fontSize: '2rem',
        transition: 'color 0.2s',
    }
};

export default StarRating;
