import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const useSocket = (events = {}) => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, data) => {
    setNotifications((prev) => [
      { id: Date.now(), type, data, time: new Date() },
      ...prev.slice(0, 19),
    ]);
  }, []);

  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    }

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    const handlers = {
      'shipment:updated': (data) => addNotification('shipment', data),
      'vehicle:location': (data) => events.onVehicleLocation?.(data),
      'route:alert': (data) => addNotification('route', data),
      'message:new': (data) => addNotification('message', data),
      'gate:event': (data) => addNotification('gate', data),
      'delivery:bot_run': (data) => addNotification('delivery', data),
      'route:optimized': (data) => addNotification('route', data),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.keys(handlers).forEach((event) => socket.off(event));
    };
  }, [events, addNotification]);

  return { socket, connected, notifications, addNotification };
};

export const getSocket = () => socket;
