import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const ThankYou = () => {
    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
            <div className="card">
                <FaCheckCircle size={64} color="#28a745" style={{ marginBottom: '1rem' }} />
                <h1>תודה רבה!</h1>
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
