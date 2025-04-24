import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../features/theme/themeSlice';
import mockWebSocket from '../services/mockWebSocket';

function WebSocketDemo() {
  const darkMode = useSelector(selectDarkMode);
  const [status, setStatus] = useState(mockWebSocket.getStatus());

  useEffect(() => {
    // Subscribe to WebSocket status changes
    const unsubscribe = mockWebSocket.subscribe((event) => {
      if (event.type === 'status_change') {
        setStatus(event.status);
      }
    });

    return unsubscribe;
  }, []);

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

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-800 text-white'} border border-green-500 rounded px-3 py-2 flex items-center justify-between h-12`}>
      <div className="flex items-center">
        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getStatusColor()}`}></span>
        <span className="text-sm">WebSocket {status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
      
      <div className="flex space-x-1.5">
        <button
          onClick={handleConnect}
          disabled={status !== 'disconnected'}
          className={`px-3 py-0.5 rounded text-xs ${
            status !== 'disconnected'
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Connect
        </button>
        <button
          onClick={handleDisconnect}
          disabled={status !== 'connected'}
          className={`px-3 py-0.5 rounded text-xs ${
            status !== 'connected'
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default WebSocketDemo; 