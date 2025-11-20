import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchVolunteers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'volunteers'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setVolunteers(data);
        } catch (err) {
            console.error("Error fetching volunteers: ", err);
            setError('שגיאה בטעינת הנתונים. וודא שיש לך הרשאות מתאימות.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('האם את/ה בטוח/ה שברצונך למחוק מתנדב זה?')) {
            try {
                await deleteDoc(doc(db, 'volunteers', id));
                setVolunteers(prev => prev.filter(v => v.id !== id));
            } catch (err) {
                console.error("Error deleting document: ", err);
                alert('שגיאה במחיקת המתנדב');
            }
        }
    };

    if (loading) return <div className="container">טוען נתונים...</div>;

    return (
        <div className="container" style={{ maxWidth: '1200px' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>לוח בקרה - מתנדבים</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <a href="/hanuka_nizanim/" style={{ textDecoration: 'none' }}>
                            <button style={{ background: 'none', border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
                                חזרה לרישום
                            </button>
                        </a>
                        <button onClick={fetchVolunteers} style={{ background: 'none', border: '1px solid #ccc', padding: '0.5rem', borderRadius: '4px' }}>
                            רענן נתונים
                        </button>
                    </div>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>שם מלא</th>
                                <th>טלפון</th>
                                <th>מביא מרק?</th>
                                <th>שם המרק</th>
                                <th>סוג</th>
                                <th>מגיש?</th>
                                <th>פלטה?</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {volunteers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center' }}>אין נתונים להצגה</td>
                                </tr>
                            ) : (
                                volunteers.map(volunteer => (
                                    <tr key={volunteer.id}>
                                        <td>{volunteer.full_name}</td>
                                        <td>{volunteer.phone_number}</td>
                                        <td>{volunteer.is_bringing_soup ? 'כן' : 'לא'}</td>
                                        <td>{volunteer.soup_name || '-'}</td>
                                        <td>{volunteer.soup_type || '-'}</td>
                                        <td>{volunteer.can_serve ? 'כן' : 'לא'}</td>
                                        <td>{volunteer.can_bring_warming_tray ? 'כן' : 'לא'}</td>
                                        <td>
                                            <button
                                                className="btn-danger"
                                                onClick={() => handleDelete(volunteer.id)}
                                                title="מחק מתנדב"
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
        </div>
    );
};

export default AdminDashboard;
