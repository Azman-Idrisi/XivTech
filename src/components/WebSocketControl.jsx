import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../features/theme/themeSlice';
import mockWebSocket from '../services/mockWebSocket';

const WebSocketControl = () => {
  const [status, setStatus] = useState(mockWebSocket.getStatus());
  const darkMode = useSelector(selectDarkMode);
  
  useEffect(() => {
    // Subscribe to WebSocket status changes
    const unsubscribe = mockWebSocket.subscribe((event) => {
      if (event.type === 'status_change') {
        setStatus(event.status);
      }
    });
    
    return unsubscribe;
  }, []);

  const getStatusClass = () => {
    switch (status) {
      case 'connected':
        return `${darkMode ? 'bg-green-900/20' : 'bg-green-100'} border ${darkMode ? 'border-green-800' : 'border-green-200'}`;
      case 'disconnected':
        return `${darkMode ? 'bg-red-900/20' : 'bg-red-100'} border ${darkMode ? 'border-red-800' : 'border-red-200'}`;
      case 'connecting':
        return `${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100'} border ${darkMode ? 'border-yellow-800' : 'border-yellow-200'}`;
      default:
        return `${darkMode ? 'bg-gray-800' : 'bg-gray-100'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'WebSocket Connected';
      case 'disconnected':
        return 'WebSocket Disconnected';
      case 'connecting':
        return 'WebSocket Connecting...';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return '●';
      case 'disconnected':
        return '○';
      case 'connecting':
        return '◐';
      default:
        return '?';
    }
  };

  const getStatusIconClass = () => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-red-500';
      case 'connecting':
        return 'text-yellow-500 animate-pulse';
      default:
        return 'text-gray-500';
    }
  };

  const handleConnect = () => {
    if (status === 'disconnected') {
      mockWebSocket.connect();
    }
  };

  const handleDisconnect = () => {
    if (status === 'connected') {
      mockWebSocket.disconnect();
    }
  };

  return (
    <div className={`p-4 rounded-xl shadow-md ${getStatusClass()} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`mr-2 text-xl ${getStatusIconClass()}`}>
            {getStatusIcon()}
          </span>
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <div>
          <button
            onClick={handleConnect}
            disabled={status !== 'disconnected'}
            className={`px-3 py-1 rounded-md mr-2 ${
              status === 'disconnected'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : `${darkMode ? 'bg-gray-700' : 'bg-gray-300'} ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-not-allowed`
            }`}
          >
            Connect
          </button>
          <button
            onClick={handleDisconnect}
            disabled={status !== 'connected'}
            className={`px-3 py-1 rounded-md ${
              status === 'connected'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : `${darkMode ? 'bg-gray-700' : 'bg-gray-300'} ${darkMode ? 'text-gray-400' : 'text-gray-500'} cursor-not-allowed`
            }`}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebSocketControl; 