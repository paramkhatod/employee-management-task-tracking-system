import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, Briefcase, Bell, CheckCircle, Info, X } from 'lucide-react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Establish WebSocket connection via SockJS & STOMP
    const socket = new SockJS('/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // Global Broadcast Subscription
        stompClient.subscribe('/topic/notifications', (message) => {
          if (message.body) {
            const data = JSON.parse(message.body);
            addNotification(data);
          }
        });

        // User Specific Subscription
        if (user?.id) {
          stompClient.subscribe(`/topic/notifications/${user.id}`, (message) => {
            if (message.body) {
              const data = JSON.parse(message.body);
              addNotification(data);
            }
          });
        }
      },
      onStompError: (frame) => {
        console.warn('STOMP Connection Notice:', frame.headers['message']);
      }
    });

    stompClient.activate();

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [user]);

  const addNotification = (item) => {
    setNotifications((prev) => [item, ...prev.slice(0, 9)]);
    setUnreadCount((prev) => prev + 1);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>
          Workspace Overview
        </h2>
      </div>

      <div className="navbar-user">
        {/* Real-time Notifications Bell */}
        <div style={{ position: 'relative', marginRight: '0.5rem' }}>
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setUnreadCount(0);
            }}
            className="btn btn-outline"
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '45px',
                width: '320px',
                backgroundColor: 'white',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                  Live Notifications
                </span>
                <button
                  onClick={() => setShowDropdown(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    No recent notifications
                  </div>
                ) : (
                  notifications.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start'
                      }}
                    >
                      <Info size={16} color="#4f46e5" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                          {item.message}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
            {user?.fullName || user?.email}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.25rem' }}>
            {isAdmin ? (
              <span style={{ color: '#4f46e5', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Shield size={12} /> Administrator
              </span>
            ) : (
              <span style={{ color: '#0284c7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Briefcase size={12} /> Employee
              </span>
            )}
          </div>
        </div>

        <div className="user-avatar">{getInitials(user?.fullName || user?.email)}</div>

        <button
          onClick={logout}
          className="btn btn-outline"
          style={{ padding: '0.5rem 0.75rem', marginLeft: '0.5rem' }}
          title="Logout"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
