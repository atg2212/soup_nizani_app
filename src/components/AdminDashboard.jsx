import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaTrash, FaFileCsv, FaClipboardList } from 'react-icons/fa';
import { SiGooglesheets } from 'react-icons/si';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

    const fetchVolunteers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'volunteers'));

            const data = querySnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });

            setVolunteers(data);
        } catch (err) {
            setError('שגיאה בטעינת הנתונים. וודא שיש לך הרשאות מתאימות.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleDeleteClick = (id, name) => {
        setDeleteModal({ open: true, id, name });
    };

    const handleDeleteConfirm = async () => {
        const { id } = deleteModal;
        setDeleteModal({ open: false, id: null, name: '' });
        try {
            await deleteDoc(doc(db, 'volunteers', id));
            setVolunteers(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            alert('שגיאה במחיקת המתנדב');
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ open: false, id: null, name: '' });
    };

    const headers = ['שם מלא', 'טלפון', 'מביא לביבות?', 'שם הלביבות', 'סוג', 'מגיש?', 'פלטה?', 'תאריך רישום'];

    const formatVolunteerRow = (v) => {
        let dateStr = '';
        if (v.createdAt) {
            if (v.createdAt.toDate) {
                dateStr = v.createdAt.toDate().toLocaleString('he-IL');
            } else if (v.createdAt.seconds) {
                dateStr = new Date(v.createdAt.seconds * 1000).toLocaleString('he-IL');
            } else {
                dateStr = new Date(v.createdAt).toLocaleString('he-IL');
            }
        }
        return [
            v.full_name || '',
            v.phone_number || '',
            v.is_bringing_soup ? 'כן' : 'לא',
            v.soup_name || '',
            v.soup_type || '',
            v.can_serve ? 'כן' : 'לא',
            v.can_bring_warming_tray ? 'כן' : 'לא',
            dateStr
        ];
    };

    const exportToGoogleSheets = async () => {
        if (volunteers.length === 0) {
            alert('אין נתונים לייצוא');
            return;
        }

        const tsvRows = [
            headers.join('\t'),
            ...volunteers.map(v => formatVolunteerRow(v).join('\t'))
        ].join('\n');

        try {
            await navigator.clipboard.writeText(tsvRows);
            window.open('https://sheets.new', '_blank');
            setToastMessage('הנתונים הועתקו ללוח! גיליון Google Sheets חדש נפתח – יש להדביק באמצעות Ctrl+V (או Command+V).');
            setTimeout(() => setToastMessage(''), 8000);
        } catch (err) {
            exportToCSV();
        }
    };

    const exportToCSV = () => {
        if (volunteers.length === 0) {
            alert('אין נתונים לייצוא');
            return;
        }

        const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;

        const csvContent = '\uFEFF' + [
            headers.map(escapeCSV).join(','),
            ...volunteers.map(v => formatVolunteerRow(v).map(escapeCSV).join(','))
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `volunteers_levivot_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setToastMessage('קובץ CSV הורד בהצלחה! ניתן לפתוח אותו ישירות ב-Google Sheets או Excel.');
        setTimeout(() => setToastMessage(''), 6000);
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="spinner"></div>
                <p style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: '#7f8c8d' }}>טוען נתונים...</p>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h1>לוח בקרה - מתנדבים</h1>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <button
                            onClick={exportToGoogleSheets}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#0F9D58',
                                color: 'white',
                                border: 'none',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '6px',
                                fontWeight: '500',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title="העתק נתונים ופתח גיליון Google Sheets חדש"
                        >
                            <SiGooglesheets size={18} />
                            ייצוא ל-Google Sheets
                        </button>
                        <button
                            onClick={exportToCSV}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: '#185abc',
                                color: 'white',
                                border: 'none',
                                padding: '0.6rem 1.2rem',
                                borderRadius: '6px',
                                fontWeight: '500',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title="הורד קובץ CSV תואם Excel ו-Google Sheets"
                        >
                            <FaFileCsv size={18} />
                            הורדת CSV
                        </button>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <span style={{ display: 'inline-block', background: 'none', border: '1px solid #ccc', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.95rem', color: 'inherit', cursor: 'pointer' }}>
                                חזרה לרישום
                            </span>
                        </Link>
                        <button onClick={fetchVolunteers} style={{ background: 'none', border: '1px solid #ccc', padding: '0.6rem 1rem', borderRadius: '6px', fontSize: '0.95rem' }}>
                            רענן נתונים
                        </button>
                    </div>
                </div>

                {toastMessage && (
                    <div className="toast" style={{
                        background: '#e6f4ea',
                        color: '#137333',
                        padding: '0.85rem 1.25rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '1px solid #ceead6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.95rem'
                    }}>
                        <span>{toastMessage}</span>
                        <button
                            onClick={() => setToastMessage('')}
                            style={{ background: 'none', border: 'none', color: '#137333', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {error && <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ textAlign: 'center', borderBottom: '3px solid #3498db', paddingBottom: '0.5rem', minWidth: '100px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>👥</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                            {volunteers.length}
                        </div>
                        <div style={{ color: '#7f8c8d' }}>סה״כ מתנדבים</div>
                    </div>
                    <div style={{ textAlign: 'center', borderBottom: '3px solid #e67e22', paddingBottom: '0.5rem', minWidth: '100px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🫓</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                            {volunteers.filter(v => v.is_bringing_soup).length}
                        </div>
                        <div style={{ color: '#7f8c8d' }}>לביבות</div>
                    </div>
                    <div style={{ textAlign: 'center', borderBottom: '3px solid #27ae60', paddingBottom: '0.5rem', minWidth: '100px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🍽️</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                            {volunteers.filter(v => v.can_serve).length}
                        </div>
                        <div style={{ color: '#7f8c8d' }}>מגישים</div>
                    </div>
                    <div style={{ textAlign: 'center', borderBottom: '3px solid #e74c3c', paddingBottom: '0.5rem', minWidth: '100px' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🔥</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                            {volunteers.filter(v => v.can_bring_warming_tray).length}
                        </div>
                        <div style={{ color: '#7f8c8d' }}>פלטות</div>
                    </div>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th scope="col">שם מלא</th>
                                <th scope="col">טלפון</th>
                                <th scope="col">מביא לביבות?</th>
                                <th scope="col">שם הלביבות</th>
                                <th scope="col">סוג</th>
                                <th scope="col">מגיש?</th>
                                <th scope="col">פלטה?</th>
                                <th scope="col">פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: 0, border: 'none' }}>
                                        <div className="empty-state">
                                            <FaClipboardList size={48} style={{ color: '#bdc3c7', marginBottom: '1rem' }} />
                                            <h3 style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>אין מתנדבים רשומים עדיין</h3>
                                            <p style={{ color: '#95a5a6' }}>כאשר מתנדבים יירשמו, הם יופיעו כאן</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                volunteers.map(volunteer => (
                                    <tr key={volunteer.id}>
                                        <td data-label="שם מלא">{volunteer.full_name}</td>
                                        <td data-label="טלפון">{volunteer.phone_number}</td>
                                        <td data-label="מביא לביבות?">{volunteer.is_bringing_soup ? 'כן' : 'לא'}</td>
                                        <td data-label="שם הלביבות">{volunteer.soup_name || '-'}</td>
                                        <td data-label="סוג">{volunteer.soup_type || '-'}</td>
                                        <td data-label="מגיש?">{volunteer.can_serve ? 'כן' : 'לא'}</td>
                                        <td data-label="פלטה?">{volunteer.can_bring_warming_tray ? 'כן' : 'לא'}</td>
                                        <td data-label="פעולות">
                                            <button
                                                className="btn-danger"
                                                onClick={() => handleDeleteClick(volunteer.id, volunteer.full_name)}
                                                title="מחק מתנדב"
                                                aria-label="מחק מתנדב"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {deleteModal.open && (
                <div className="modal-overlay" onClick={handleDeleteCancel}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1rem' }}>אישור מחיקה</h3>
                        <p style={{ marginBottom: '1.5rem', color: '#555' }}>
                            האם את/ה בטוח/ה שברצונך למחוק את <strong>{deleteModal.name}</strong>?
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleDeleteCancel}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                    background: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem'
                                }}
                            >
                                ביטול
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: '#e74c3c',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    fontWeight: '500'
                                }}
                            >
                                מחק
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
