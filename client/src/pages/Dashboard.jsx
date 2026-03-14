
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { 
    LayoutDashboard, BookOpen, Beaker, Library, Briefcase, 
    Home, Coffee, Bus, Building, Zap, Music, Users, 
    Trash2, Smile, CheckCircle, TrendingUp, Star,
    ChevronRight, GraduationCap
} from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, categories: 0, avgRating: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/feedback/my-feedback');
                const feedbacks = response.data;
                
                if (feedbacks && feedbacks.length > 0) {
                    const uniqueCategories = new Set(feedbacks.map(f => f.category)).size;
                    const totalRating = feedbacks.reduce((acc, curr) => acc + curr.overallRating, 0);
                    const reviewedCount = feedbacks.filter(f => f.status === 'Reviewed').length;
                    
                    setStats({
                        total: feedbacks.length,
                        categories: uniqueCategories,
                        reviewed: reviewedCount,
                        avgRating: (totalRating / feedbacks.length).toFixed(1)
                    });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    const categoryGroups = [
        {
            title: 'Academics & Learning',
            icon: <BookOpen size={20} />,
            items: [
                { id: 'Academic', name: 'Academic', icon: <GraduationCap size={18} /> },
                { id: 'Laboratories', name: 'Laboratories', icon: <Beaker size={18} /> },
                { id: 'Library', name: 'Library', icon: <Library size={18} /> },
                { id: 'Placements', name: 'Placements', icon: <Briefcase size={18} /> }
            ]
        },
        {
            title: 'Facilities',
            icon: <Home size={20} />,
            items: [
                { id: 'Hostel', name: 'Hostel', icon: <Home size={18} /> },
                { id: 'Food', name: 'Food', icon: <Coffee size={18} /> },
                { id: 'Transport', name: 'Transport', icon: <Bus size={18} /> },
                { id: 'Infrastructure', name: 'Infrastructure', icon: <Building size={18} /> }
            ]
        },
        {
            title: 'Activities & Support',
            icon: <Zap size={20} />,
            items: [
                { id: 'Sports', name: 'Sports', icon: <Zap size={18} /> },
                { id: 'Culturals', name: 'Culturals', icon: <Music size={18} /> },
                { id: 'Administration', name: 'Administration', icon: <Users size={18} /> },
                { id: 'Cleanliness', name: 'Cleanliness', icon: <Trash2 size={18} /> },
                { id: 'Clubs', name: 'Clubs', icon: <Smile size={18} /> }
            ]
        }
    ];

    const handleCategoryClick = (category) => {
        navigate(`/feedback/${category}/select`);
    };

    return (
        <div className="fade-in px-4 py-4" style={{ backgroundColor: '#FAF9F6', minHeight: '100vh' }}>
            <div className="mb-5">
                <h1 className="display-6 fw-bold mb-1" style={{ color: '#111F35' }}>Welcome, {user?.name}</h1>
                <p className="text-muted mb-0">Select a category to share your valuable feedback</p>
            </div>

            {/* Summary Row */}
            {!loadingStats && (
                <Row className="g-4 mb-5">
                    <Col md={6} lg={4}>
                        <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100 d-flex flex-column justify-content-between">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="text-muted small fw-bold text-uppercase">Total Feedbacks Submitted</span>
                                <div className="bg-light p-2 rounded-circle text-primary-custom" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                                    <CheckCircle size={24} className="mx-auto" />
                                </div>
                            </div>
                            <h2 className="display-6 fw-bold mb-0" style={{ color: '#111F35' }}>{stats.total}</h2>
                        </div>
                    </Col>
                    <Col md={6} lg={4}>
                        <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100 d-flex flex-column justify-content-between">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="text-muted small fw-bold text-uppercase">Categories Covered</span>
                                <div className="bg-light p-2 rounded-circle text-info" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                                    <TrendingUp size={24} className="mx-auto" />
                                </div>
                            </div>
                            <h2 className="display-6 fw-bold mb-0" style={{ color: '#111F35' }}>{stats.categories} <small className="text-muted h5">/ 13</small></h2>
                        </div>
                    </Col>
                    <Col md={6} lg={4}>
                        <div className="bg-white p-4 rounded-4 shadow-sm border-0 h-100 d-flex flex-column justify-content-between">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <span className="text-muted small fw-bold text-uppercase">Admin Reviews</span>
                                <div className="bg-light p-2 rounded-circle text-warning" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                                    <Star size={24} className="mx-auto" />
                                </div>
                            </div>
                            <h2 className="display-6 fw-bold mb-0" style={{ color: '#111F35' }}>{stats.reviewed || 0}</h2>
                        </div>
                    </Col>
                </Row>
            )}

            <h5 className="fw-bold mb-4 text-dark px-2">Browse Categories</h5>
            <Row className="g-4 mb-4 px-2">
                {categoryGroups.map((group, idx) => (
                    <Col lg={4} key={idx}>
                        <div className="bg-white rounded-4 shadow-sm border-0 h-100 overflow-hidden card-custom">
                            <div className="p-4 border-bottom bg-white d-flex align-items-center">
                                <span className="text-primary-custom me-2">{group.icon}</span>
                                <h6 className="fw-bold mb-0">{group.title}</h6>
                            </div>
                            <div className="p-4 pt-0 mt-3">
                                <div className="d-flex flex-column gap-2">
                                    {group.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="d-flex align-items-center p-3 rounded-3 border bg-light category-item-hover w-100"
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            onClick={() => handleCategoryClick(item.id)}
                                        >
                                            <div className="p-2 bg-white rounded-circle shadow-sm me-3 text-secondary d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                                                {item.icon}
                                            </div>
                                            <span className="fw-semibold text-dark flex-grow-1">{item.name}</span>
                                            <ChevronRight size={16} className="text-muted opacity-50" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default Dashboard;
