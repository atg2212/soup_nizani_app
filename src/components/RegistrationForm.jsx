import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        full_name: '',
        phone_number: '',
        is_bringing_soup: false,
        soup_name: '',
        soup_type: '',
        can_serve: false,
        can_bring_warming_tray: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🚀 Form submission started');
        console.log('📝 Form data:', formData);

        setLoading(true);
        setError('');

        try {
            // Validation
            console.log('✅ Starting validation...');
            if (!formData.full_name || !formData.phone_number) {
                throw new Error('נא למלא את כל שדות החובה');
            }

            if (formData.is_bringing_soup && (!formData.soup_name || !formData.soup_type)) {
                throw new Error('נא למלא את פרטי המרק');
            }
            console.log('✅ Validation passed');

            // Prepare data
            const dataToSave = {
                ...formData,
                createdAt: new Date()
            };
            console.log('💾 Data to save:', dataToSave);
            console.log('🔥 Firebase DB instance:', db);
            console.log('📚 Collection reference:', collection(db, 'volunteers'));

            // Save to Firestore
            console.log('⏳ Attempting to save to Firestore...');
            const docRef = await addDoc(collection(db, 'volunteers'), dataToSave);
            console.log('✅ Document written with ID:', docRef.id);

            console.log('🎉 Success! Navigating to thank you page...');
            navigate('/thank-you');
        } catch (err) {
            console.error("❌ Error adding document: ", err);
            console.error("❌ Error code:", err.code);
            console.error("❌ Error message:", err.message);
            console.error("❌ Full error:", err);
            setError('אירעה שגיאה בשליחת הטופס. אנא נסה/י שוב. ' + (err.message || ''));
        } finally {
            setLoading(false);
            console.log('🏁 Form submission completed');
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>רישום מתנדבים: מרקי חנוכה</h1>

                {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="full_name">שם מלא *</label>
                        <input
                            type="text"
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">מספר טלפון *</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="is_bringing_soup"
                            name="is_bringing_soup"
                            checked={formData.is_bringing_soup}
                            onChange={handleChange}
                        />
                        <label htmlFor="is_bringing_soup" style={{ marginBottom: 0, marginRight: '0.5rem' }}>
                            האם אני מביא/ה מרק?
                        </label>
                    </div>

                    {formData.is_bringing_soup && (
                        <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label htmlFor="soup_name">שם המרק שאביא *</label>
                                <input
                                    type="text"
                                    id="soup_name"
                                    name="soup_name"
                                    value={formData.soup_name}
                                    onChange={handleChange}
                                    required={formData.is_bringing_soup}
                                />
                            </div>

                            <div className="form-group">
                                <label>סוג המרק *</label>
                                <div className="radio-group">
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="soup_type"
                                            value="טבעוני"
                                            checked={formData.soup_type === 'טבעוני'}
                                            onChange={handleChange}
                                        />
                                        טבעוני
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="soup_type"
                                            value="חלבי"
                                            checked={formData.soup_type === 'חלבי'}
                                            onChange={handleChange}
                                        />
                                        חלבי
                                    </label>
                                    <label className="radio-option">
                                        <input
                                            type="radio"
                                            name="soup_type"
                                            value="בשרי"
                                            checked={formData.soup_type === 'בשרי'}
                                            onChange={handleChange}
                                        />
                                        בשרי
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="can_serve"
                            name="can_serve"
                            checked={formData.can_serve}
                            onChange={handleChange}
                        />
                        <label htmlFor="can_serve" style={{ marginBottom: 0, marginRight: '0.5rem' }}>
                            מוכן/ה להגיש מרקים באירוע
                        </label>
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="can_bring_warming_tray"
                            name="can_bring_warming_tray"
                            checked={formData.can_bring_warming_tray}
                            onChange={handleChange}
                        />
                        <label htmlFor="can_bring_warming_tray" style={{ marginBottom: 0, marginRight: '0.5rem' }}>
                            יכול/ה להביא פלטת חימום
                        </label>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'שולח...' : 'אני בא/ה לתרום! (שלח/י רישום)'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <a href="/hanuka_nizanim/admin" style={{ color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>
                        כניסה למנהלים
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
