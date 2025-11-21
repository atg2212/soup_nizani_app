import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchVolunteers = async () => {
        console.log('📊 Admin: Starting to fetch volunteers...');
        console.log('🔥 Firebase DB instance:', db);

        try {
            console.log('📚 Collection reference:', collection(db, 'volunteers'));
            console.log('⏳ Fetching documents from Firestore...');

            const querySnapshot = await getDocs(collection(db, 'volunteers'));
            console.log('✅ Query successful! Documents count:', querySnapshot.size);

            const data = querySnapshot.docs.map(doc => {
                console.log('📄 Document ID:', doc.id, 'Data:', doc.data());
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });

            console.log('✅ All volunteers data:', data);
            setVolunteers(data);
        } catch (err) {
            console.error("❌ Error fetching volunteers: ", err);
            console.error("❌ Error code:", err.code);
            console.error("❌ Error message:", err.message);
            console.error("❌ Full error:", err);
            setError('שגיאה בטעינת הנתונים. וודא שיש לך הרשאות מתאימות.');
        } finally {
            setLoading(false);
            console.log('🏁 Fetch volunteers completed');
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('האם את/ה בטוח/ה שברצונך למחוק מתנדב זה?')) {
            console.log('🗑️ Admin: Deleting volunteer with ID:', id);
            try {
                await deleteDoc(doc(db, 'volunteers', id));
                console.log('✅ Volunteer deleted successfully');
                setVolunteers(prev => prev.filter(v => v.id !== id));
            } catch (err) {
                console.error("❌ Error deleting document: ", err);
                console.error("❌ Error code:", err.code);
                console.error("❌ Error message:", err.message);
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
                        <a href="/" style={{ textDecoration: 'none' }}>
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

                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                            {volunteers.filter(v => v.is_bringing_soup).length}
                        </div>
                        <div style={{ color: '#7f8c8d' }}>מרקים</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
                            {volunteers.filter(v => v.can_serve).length}
                        </div>
                        <div style={{ color: '#7f8c8d' }}>מגישים</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
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
