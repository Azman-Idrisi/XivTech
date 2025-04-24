import { store } from '../app/store';
import { bulkUpdateAssets } from '../features/crypto/cryptoSlice';


class MockWebSocket {
  constructor() {
    this.status = 'disconnected'; 
    this.listeners = [];
    this.updateInterval = null;
    this.connectionTimeout = null;
    this.subscribers = [];
    this.updateIntervalTime = 1500; 
  }

  
  connect() {
    if (this.status !== 'disconnected') return;
    
    this.status = 'connecting';
    this.notifyListeners({ type: 'status_change', status: this.status });
    
    // Simulate connection delay
    this.connectionTimeout = setTimeout(() => {
      this.status = 'connected';
      this.notifyListeners({ type: 'status_change', status: this.status });
      
      // Start sending updates when connected
      this.startUpdates();
    }, 1500);
  }

  
  disconnect() {
    if (this.status === 'disconnected') return;
    
    // Clear any pending timeouts or intervals
    clearTimeout(this.connectionTimeout);
    clearInterval(this.updateInterval);
    
    this.status = 'disconnected';
    this.notifyListeners({ type: 'status_change', status: this.status });
  }


  startUpdates() {
    if (this.updateInterval) return;
    
    this.updateInterval = setInterval(() => {
      if (this.status === 'connected') {
        this.notifyListeners({ 
          type: 'data', 
          data: {
            timestamp: new Date().toISOString(),
            message: `Update at ${new Date().toLocaleTimeString()}`
          }
        });
      }
    }, this.updateIntervalTime);
  }

  
  stopUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

 
  sendMarketUpdates() {
    if (!this.status === 'connected') return;
    
    const state = store.getState();
    const { assets } = state.crypto;
    
    
    const updates = assets.map(asset => {
      
      const priceChangePercent = (Math.random() * 3 - 1.5) / 100;
      
      // Calculate new price
      const newPrice = asset.price * (1 + priceChangePercent);
      
      
      const percentChange1h = asset.percentChange1h + (Math.random() * 0.4 - 0.2);
      const percentChange24h = asset.percentChange24h + (Math.random() * 0.8 - 0.4);
      const percentChange7d = asset.percentChange7d + (Math.random() * 1.2 - 0.6);
      
      // Random volume change between -5% and +5%
      const volumeChangePercent = 1 + (Math.random() * 0.1 - 0.05);
      const newVolume = asset.volume24h * volumeChangePercent;
      
      return {
        id: asset.id,
        price: newPrice,
        percentChange1h,
        percentChange24h,
        percentChange7d,
        volume24h: newVolume
      };
    });
    
    
    store.dispatch(bulkUpdateAssets(updates));
    
    
    this.notifySubscribers({ 
      type: 'market_update', 
      updates,
      timestamp: new Date().toISOString()
    });
  }

  
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  
  notifyListeners(event) {
    this.listeners.forEach(listener => listener(event));
  }

 
  getStatus() {
    return this.status;
  }

  
  setUpdateFrequency(milliseconds) {
    if (milliseconds < 500) {
      console.warn('Update frequency cannot be less than 500ms');
      milliseconds = 500;
    }
    
    this.updateIntervalTime = milliseconds;
    
    
    if (this.updateInterval) {
      this.stopUpdates();
      this.startUpdates();
    }
  }
}


const mockWebSocket = new MockWebSocket();

export default mockWebSocket; 