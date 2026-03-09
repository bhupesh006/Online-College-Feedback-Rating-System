
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { Container, Row, Col } from 'react-bootstrap';
import { FaUniversity, FaFlask, FaBook, FaBriefcase, FaBuilding, FaUtensils, FaBus, FaWifi, FaFutbol, FaTheaterMasks, FaUserTie, FaBroom, FaLaptopCode, FaDumbbell, FaPaintBrush, FaUsers, FaRecycle, FaBed, FaGraduationCap } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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
