import React, { useEffect, useState } from 'react';
import { Card, List, Avatar, Tag, Spin, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import api from '../../configs/api';
import MemberLayout from '../../layouts/MemberLayout';

const { Title } = Typography;

const ChildList = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState([]);
  const navigate = useNavigate();

  const fetchChildren = async () => {
    try {
      const response = await api.get('/children', {
        params: {
          page: 1,
          size: 10,
          sortBy: 'date',
          order: 'descending'
        }
      });

      if (response.data && response.data.children) {
        setChildren(response.data.children);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      message.error('Failed to load children list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Children List";
    fetchChildren();
  }, []);

  const handleChildClick = (childId) => {
    navigate(`/profile/growth-chart/${childId}`);
  };

  return (
    <MemberLayout>
      <div style={{ padding: '24px' }}>
        <Title level={2} style={{ marginBottom: '24px', color: '#0056A1' }}>
          My Children
        </Title>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={children}
            renderItem={(child) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() => handleChildClick(child._id)}
                  style={{ 
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <Avatar
                      size={80}
                      style={{
                        backgroundColor: child.gender === 1 ? '#0056A1' : '#FF69B4',
                        marginBottom: '8px'
                      }}
                    >
                      {child.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Title level={4} style={{ margin: '8px 0' }}>
                      {child.name}
                    </Title>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <strong>Birth Date:</strong>{' '}
                    {moment(child.birthDate).format('DD/MM/YYYY')}
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <strong>Gender:</strong>{' '}
                    <Tag color={child.gender === 1 ? '#0056A1' : '#FF69B4'}>
                      {child.gender === 1 ? 'Male' : 'Female'}
                    </Tag>
                  </div>

                  <div>
                    <strong>Relationship:</strong>{' '}
                    {child.relationships?.[0]?.type || 'N/A'}
                  </div>
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </MemberLayout>
  );
};

export default ChildList; 