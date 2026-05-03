import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShoppingCart, 
  Package, 
  Zap, 
  Sun, 
  Moon, 
  Server, 
  ShieldCheck, 
  TrendingUp,
  Terminal
} from 'lucide-react';

function App() {
  const [theme, setTheme] = useState('dark');
  const [stock, setStock] = useState(1250);
  const [orders, setOrders] = useState(452);
  const [queue, setQueue] = useState(12);
  const [logs, setLogs] = useState([
    { id: 1, time: '12:40:02', msg: 'Order #9421 processed via RabbitMQ', type: 'cyan' },
    { id: 2, time: '12:39:58', msg: 'Redis inventory atomic sync successful', type: 'green' },
    { id: 3, time: '12:39:45', msg: 'New connection from IP 192.168.1.45', type: 'purple' },
    { id: 4, time: '12:39:30', msg: 'Gateway health check: PASSED', type: 'cyan' },
  ]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const addLog = (msg, type = 'cyan') => {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0') + ':' + 
                    now.getSeconds().toString().padStart(2, '0');
    const newLog = { id: Date.now(), time: timeStr, msg, type };
    setLogs(prev => [newLog, ...prev.slice(0, 5)]);
  };

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const sold = Math.floor(Math.random() * 3);
      if (sold > 0) {
        setStock(prev => Math.max(0, prev - sold));
        setOrders(prev => prev + sold);
        addLog(`System processed ${sold} new orders`, 'green');
      }
      setQueue(prev => Math.max(0, prev + (Math.random() > 0.5 ? 2 : -2)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hud-container">
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="neon-text" style={{ fontSize: '2rem' }}>NexCore <span style={{ color: 'var(--text-main)' }}>FlashSale</span></h1>
          <p style={{ color: 'var(--text-dim)', marginTop: '0.5rem' }}>
            <span className="status-pulse"></span> SYSTEM ONLINE // REAL-TIME MONITORING
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={toggleTheme} className="btn-cyber" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="stat-grid">
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Activity className="neon-text" />
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>LIVE</span>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>SERVER LOAD</p>
          <h2 style={{ fontSize: '2.5rem' }}>{20 + Math.floor(Math.random() * 10)}<span style={{ fontSize: '1rem' }}>%</span></h2>
          <div style={{ height: '4px', background: 'var(--bg-secondary)', marginTop: '10px' }}>
            <div style={{ width: '28%', height: '100%', background: 'var(--accent-cyan)' }}></div>
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Package style={{ color: 'var(--accent-purple)' }} />
            <TrendingUp size={16} color="var(--accent-green)" />
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>TOTAL INVENTORY</p>
          <h2 style={{ fontSize: '2.5rem' }}>{stock.toLocaleString()}</h2>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <ShoppingCart className="neon-text" />
            <Zap size={16} color="var(--accent-purple)" />
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>TOTAL ORDERS</p>
          <h2 style={{ fontSize: '2.5rem' }}>{orders.toLocaleString()}</h2>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Server style={{ color: 'var(--accent-cyan)' }} />
            <ShieldCheck size={16} color="var(--accent-green)" />
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>QUEUE STATUS</p>
          <h2 style={{ fontSize: '2.5rem' }}>{queue} <span style={{ fontSize: '1rem' }}>REQS</span></h2>
        </div>
      </div>

      {/* Control Center & Recent Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal size={20} /> Control Center
          </h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-cyber" onClick={() => addLog('Manual session triggered', 'cyan')}>Start Session</button>
            <button className="btn-cyber" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }} onClick={() => addLog('Flash sale paused by admin', 'purple')}>Pause Sale</button>
            <button className="btn-cyber" style={{ borderColor: 'var(--accent-green)', color: 'var(--accent-green)' }} onClick={() => addLog('Redis cache flushed', 'green')}>Deploy Cache</button>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '10px 0' }}>SERVICE</th>
                  <th>STATUS</th>
                  <th>LATENCY</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '15px 0' }}>API Gateway</td>
                  <td><span className="status-pulse"></span> Active</td>
                  <td>12ms</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '15px 0' }}>Order Processor</td>
                  <td><span className="status-pulse"></span> Active</td>
                  <td>45ms</td>
                </tr>
                <tr>
                  <td style={{ padding: '15px 0' }}>Inventory Sync</td>
                  <td><span className="status-pulse" style={{ backgroundColor: 'orange', boxShadow: '0 0 8px orange' }}></span> Syncing</td>
                  <td>120ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '1.5rem' }}>Security Logs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {logs.map(log => (
              <div key={log.id} style={{ 
                fontSize: '0.85rem', 
                padding: '10px', 
                background: 'rgba(0,0,0,0.2)', 
                borderLeft: `2px solid var(--accent-${log.type})`,
                animation: 'fadeIn 0.5s ease-out'
              }}>
                <span style={{ color: `var(--accent-${log.type})` }}>[{log.time}]</span> {log.msg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
