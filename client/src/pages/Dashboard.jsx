
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Card from '../components/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUniversity, FaFlask, FaBook, FaBriefcase, FaBuilding, FaUtensils, FaBus, FaWifi, FaFutbol, FaTheaterMasks, FaUserTie, FaBroom, FaLaptopCode, FaDumbbell, FaPaintBrush, FaUsers, FaRecycle, FaBed, FaGraduationCap, FaCheckCircle, FaChartPie, FaStar } from 'react-icons/fa';

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
                    
                    setStats({
                        total: feedbacks.length,
                        categories: uniqueCategories,
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

    const categoryIcons = {
        'Academic': <FaGraduationCap color="#0d6efd" />,
        'Laboratories': <FaFlask color="#20c997" />,
        'Library': <FaBook color="#fd7e14" />,
        'Placements': <FaBriefcase color="#6f42c1" />,
        'Hostel': <FaBed color="#6c757d" />,
        'Food': <FaUtensils color="#dc3545" />,
        'Transport': <FaBus color="#ffc107" />,
        'Infrastructure': <FaBuilding color="#198754" />,
        'Sports': <FaFutbol color="#d63384" />,
        'Culturals': <FaTheaterMasks color="#6610f2" />,
        'Administration': <FaUserTie color="#0dcaf0" />,
        'Cleanliness': <FaRecycle color="#20c997" />,
        'Clubs': <FaUsers color="#fd7e14" />
    };

    const getIcon = (item) => categoryIcons[item] || <FaUniversity />;

    const handleCategoryClick = (category) => {
        navigate(`/feedback/${category}/select`);
    };

    const sections = [
        {
            title: 'Academic & Training',
            items: ['Academic', 'Laboratories', 'Library', 'Placements']
        },
        {
            title: 'Facilities',
            items: ['Hostel', 'Food', 'Transport', 'Infrastructure']
        },
        {
            title: 'Activities & Support',
            items: ['Sports', 'Culturals', 'Administration', 'Cleanliness', 'Clubs']
        }
    ];

    return (
        <Container className="py-5">
            <div className="text-center mb-5">
                <h1 className="display-5 fw-bold" style={{ color: '#111F35' }}>Welcome, {user?.name}</h1>
                <p className="text-muted lead">Select a category to submit feedback</p>
            </div>

            {/* Summary Cards */}
            {!loadingStats && (
                <Row className="mb-5 g-4 text-center justify-content-center">
                    <Col md={4} sm={6}>
                        <div className="bg-white p-4 rounded-4 shadow-sm border h-100 category-card d-flex flex-column align-items-center justify-content-center">
                            <FaCheckCircle color="#20c997" className="mb-3" size={40} />
                            <h2 className="fw-bold mb-1" style={{ color: '#111F35' }}>{stats.total}</h2>
                            <p className="text-muted mb-0">Total Feedbacks</p>
                        </div>
                    </Col>
                    <Col md={4} sm={6}>
                        <div className="bg-white p-4 rounded-4 shadow-sm border h-100 category-card d-flex flex-column align-items-center justify-content-center">
                            <FaChartPie color="#0dcaf0" className="mb-3" size={40} />
                            <h2 className="fw-bold mb-1" style={{ color: '#111F35' }}>{stats.categories} / 13</h2>
                            <p className="text-muted mb-0">Categories Reviewed</p>
                        </div>
                    </Col>
                    <Col md={4} sm={6}>
                        <div className="bg-white p-4 rounded-4 shadow-sm border h-100 category-card d-flex flex-column align-items-center justify-content-center">
                            <FaStar color="#ffc107" className="mb-3" size={40} />
                            <h2 className="fw-bold mb-1" style={{ color: '#111F35' }}>{stats.avgRating}</h2>
                            <p className="text-muted mb-0">Average Rating Given</p>
                        </div>
                    </Col>
                </Row>
            )}

            {sections.map((section, index) => (
                <div key={index} className="mb-5">
                    <h3 className="mb-4 pb-2 border-bottom" style={{ color: '#8A244B' }}>{section.title}</h3>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {section.items.map((item) => (
                            <Col key={item}>
                                <Card
                                    title={item}
                                    icon={<div className="icon" style={{ fontSize: '2.5rem' }}>{getIcon(item)}</div>}
                                    onClick={() => handleCategoryClick(item)}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </Container>
    );
};


export default Dashboard;
