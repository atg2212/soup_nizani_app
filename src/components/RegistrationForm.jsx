import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const updated = {
                ...prev,
                [name]: newValue
            };
            // R5: When is_bringing_soup is unchecked, clear soup fields
            if (name === 'is_bringing_soup' && newValue === false) {
                updated.soup_name = '';
                updated.soup_type = '';
            }
            return updated;
        });

        // Clear field error when user edits a field
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            // Validation - U2: field-level errors
            const errors = {};

            // Strip dashes, spaces, dots, and parentheses for validation
            // Also handle +972 / 972 international prefix
            let cleanPhone = formData.phone_number.replace(/[\s\-\.\(\)]/g, '');
            if (cleanPhone.startsWith('+972')) {
                cleanPhone = '0' + cleanPhone.slice(4);
            } else if (cleanPhone.startsWith('972')) {
                cleanPhone = '0' + cleanPhone.slice(3);
            }
            const phoneRegex = /^0[2-9]\d{7,8}$/;

            if (!formData.full_name) {
                errors.full_name = 'נא למלא שם מלא';
            }
            if (!formData.phone_number) {
                errors.phone_number = 'נא למלא מספר טלפון';
            } else if (!phoneRegex.test(cleanPhone)) {
                errors.phone_number = 'מספר טלפון לא תקין';
            }



            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                throw new Error('נא לתקן את השגיאות בטופס');
            }

            // Prepare data - B2: use serverTimestamp
            const dataToSave = {
                ...formData,
                createdAt: serverTimestamp()
            };

            // Save to Firestore
            await addDoc(collection(db, 'volunteers'), dataToSave);

            navigate('/thank-you');
        } catch (err) {
            setError('אירעה שגיאה בשליחת הטופס. אנא נסה/י שוב. ' + (err.message || ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>רישום מתנדבים: לביבות חנוכה</h1>

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
                            aria-required="true"
                            aria-invalid={!!fieldErrors.full_name}
                        />
                        {fieldErrors.full_name && <span style={{ color: 'red', fontSize: '0.85rem' }}>{fieldErrors.full_name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">מספר טלפון *</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            aria-required="true"
                            aria-invalid={!!fieldErrors.phone_number}
                        />
                        {fieldErrors.phone_number && <span style={{ color: 'red', fontSize: '0.85rem' }}>{fieldErrors.phone_number}</span>}
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
                            האם אני מביא/ה לביבות?
                            <span style={{ fontSize: '0.85rem', color: '#888', marginRight: '0.4rem' }}>(מינימום 25)</span>
                        </label>
                    </div>

                    <div className={`conditional-fields ${formData.is_bringing_soup ? 'conditional-fields-open' : 'conditional-fields-closed'}`}>
                        {formData.is_bringing_soup && (
                            <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                                <div className="form-group">
                                    <label htmlFor="soup_name">שם הלביבות שאביא</label>
                                    <input
                                        type="text"
                                        id="soup_name"
                                        name="soup_name"
                                        value={formData.soup_name}
                                        onChange={handleChange}
                                    />
                                    {fieldErrors.soup_name && <span style={{ color: 'red', fontSize: '0.85rem' }}>{fieldErrors.soup_name}</span>}
                                </div>

                                <div className="form-group">
                                    <label>סוג הלביבות</label>
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
                                                value="צמחוני"
                                                checked={formData.soup_type === 'צמחוני'}
                                                onChange={handleChange}
                                            />
                                            צמחוני
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

                                    </div>
                                    {fieldErrors.soup_type && <span style={{ color: 'red', fontSize: '0.85rem' }}>{fieldErrors.soup_type}</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="can_serve"
                            name="can_serve"
                            checked={formData.can_serve}
                            onChange={handleChange}
                        />
                        <label htmlFor="can_serve" style={{ marginBottom: 0, marginRight: '0.5rem' }}>
                            מוכן/ה להגיש לביבות באירוע
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

                    <button type="submit" className="btn-primary" disabled={loading} aria-label="שלח טופס רישום">
                        {loading ? 'שולח...' : 'אני בא/ה לתרום! (שלח/י רישום)'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/admin" style={{ color: '#999', textDecoration: 'none', fontSize: '0.9rem' }}>
                        כניסה למנהלים
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
