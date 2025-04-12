// components/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../index.css';

const COLORS = ['#00C49F', '#FF8042'];

function Dashboard() {
  const [scanResult, setScanResult] = useState(null);
  const [amount, setAmount] = useState('');
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('upi_user');
    if (!username) return navigate('/login');

    const user = JSON.parse(localStorage.getItem(`upi_${username}`));
    setUserData(user);
    updateChart(user);
  }, [navigate]);

  const updateChart = (user) => {
    const pie = [
      { name: 'Needs', value: user.needs || 0 },
      { name: 'Wants', value: user.wants || 0 }
    ];
    setData(pie);
  };

  const startScanner = () => {
    setShowScanner(true);
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 });
    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      try {
        const parsed = JSON.parse(result);
        setScanResult(parsed);
        alert('✅ QR Code scanned successfully.');
      } catch (e) {
        alert('❌ Invalid QR format.');
      }
    }

    function error(err) {
      console.warn(err);
    }
  };

  const handlePay = () => {
    if (!scanResult || !amount) {
      alert('Please scan a QR and enter amount.');
      return;
    }
  
    const username = localStorage.getItem('upi_user');
    const updated = { ...userData };
    const type = scanResult.type;
    const amt = parseFloat(amount);
  
    if (type === 'Want' && updated.wants + amt > updated.wantLimit) {
      alert('⚠️ Want limit exceeded!');
      return;
    }
  
    if (updated.needs + updated.wants + amt > updated.monthlyLimit) {
      alert('⚠️ Monthly limit exceeded!');
      return;
    }
  
    // Update spending
    if (type === 'Want') updated.wants += amt;
    else updated.needs += amt;
  
    // Save updated data
    localStorage.setItem(`upi_${username}`, JSON.stringify(updated));
    setUserData(updated);
    updateChart(updated);
  
    // UPI App Redirection
    const upiIntent = `upi://pay?pa=${encodeURIComponent(scanResult.upiId)}&pn=${encodeURIComponent(scanResult.name)}&am=${encodeURIComponent(amt)}&cu=INR`;
  
    // Open UPI app (like GPay)
    window.location.href = upiIntent;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('upi_user');
    navigate('/login');
  };

  return (
    <div className="container dashboard">
      <h2>Smart UPI Dashboard</h2>
      <button onClick={handleLogout} className="logout-btn">Logout</button>

      {userData && (
        <div className="stats">
          <p><strong>Total Monthly Limit:</strong> ₹{userData.monthlyLimit}</p>
          <p><strong>Wants Limit:</strong> ₹{userData.wantLimit}</p>
          <p><strong>Spent on Needs:</strong> ₹{userData.needs}</p>
          <p><strong>Spent on Wants:</strong> ₹{userData.wants}</p>
          <p><strong>Remaining:</strong> ₹{userData.monthlyLimit - userData.needs - userData.wants}</p>
        </div>
      )}

      <button onClick={startScanner} className="scan-btn">Start Scan</button>
      {showScanner && <div id="qr-reader" style={{ width: '100%', maxWidth: 400, margin: '20px auto' }}></div>}

      {scanResult && (
        <div className="form-group">
          <p><strong>Vendor:</strong> {scanResult.name}</p>
          <p><strong>Type:</strong> {scanResult.type}</p>
          <p><strong>UPI ID:</strong> {scanResult.upiId}</p>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handlePay}>Pay</button>
        </div>
      )}

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;
