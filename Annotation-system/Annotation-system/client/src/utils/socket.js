import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://doc-annotation-backend.onrender.com/');

export const useSocket = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Disconnected from server');
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    return { socket, isConnected };
};

export default socket;


