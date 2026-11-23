import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const ThankYou = () => {
    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, #fffaf0 0%, #fff7e6 100%)' }}>
                <FaCheckCircle size={64} color="#f4a226" style={{ marginBottom: '1rem' }} />
                <h1>תודה רבה!</h1>
                <h2 style={{ color: '#f4a226', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
                    🕎 חג חנוכה שמח! 🕎
                </h2>
                <div style={{ fontSize: '1.5rem', letterSpacing: '0.3rem', margin: '0.75rem 0' }}>
                    🕯️🕯️🕯️🕯️🕎🕯️🕯️🕯️🕯️
                </div>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    הרישום שלך התקבל בהצלחה. נתראה באירוע!
                </p>
                <Link to="/">
                    <button className="btn-primary" style={{ maxWidth: '200px' }}>
                        חזרה לדף הבית
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ThankYou;
