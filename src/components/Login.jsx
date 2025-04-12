import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function Login() {
  const [username, setUsername] = useState('');
  const [newUser, setNewUser] = useState(false);
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [wantLimit, setWantLimit] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username) return alert('Please enter your username.');

    const userData = localStorage.getItem(`upi_${username}`);
    if (userData) {
      localStorage.setItem('upi_user', username);
      navigate('/dashboard');
    } else {
      const confirmNew = confirm('No account found. Do you want to register?');
      if (confirmNew) setNewUser(true);
    }
  };

  const handleRegister = () => {
    if (!monthlyLimit || !wantLimit) {
      alert('Please enter both limits to register.');
      return;
    }
    localStorage.setItem(
      `upi_${username}`,
      JSON.stringify({ monthlyLimit: parseFloat(monthlyLimit), wantLimit: parseFloat(wantLimit), needs: 0, wants: 0 })
    );
    localStorage.setItem('upi_user', username);
    navigate('/dashboard');
  };

  const goToHome = () => {
    window.location.href = 'http://localhost:3000/';
  };

  return (
    <div className="container">
      {/* Back to Homepage Button */}
      <button onClick={goToHome} className="back-button">← Back to Homepage</button>
      
      <h2>Welcome to Smart UPI</h2>
      <div className="form-group">
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" />
        <button onClick={handleLogin}>Continue</button>
      </div>
      {newUser && (
        <div className="form-group">
          <label>Total Monthly Limit</label>
          <input value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} type="number" placeholder="Total limit" />
          <label>Wants Spending Limit</label>
          <input value={wantLimit} onChange={(e) => setWantLimit(e.target.value)} type="number" placeholder="Wants limit" />
          <button onClick={handleRegister}>Register</button>
        </div>
      )}
    </div>
  );
}

export default Login;
