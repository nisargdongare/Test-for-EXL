import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [empId, setEmpId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    if (!empId) {
      setError('Please enter a valid Employee ID');
      return;
    }

    try {
      const response = await axios.post('/api/calculateBonus', { empId: parseInt(empId) });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An unexpected error occurred');
    }
  };

  return (
    <div style={containerStyle}>
      <h1>Bonus Calculator</h1>
      <form onSubmit={handleSubmit} style={formStyle}>
        <label>
          Employee ID:
          <input
            type="number"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            style={inputStyle}
            required
          />
        </label>
        <button type="submit" style={buttonStyle}>Calculate</button>
      </form>

      {error && <p style={errorStyle}>{error}</p>}

      {result && (
        <div style={resultStyle}>
          <h2>Employee Details</h2>
          <p><strong>ID:</strong> {result.EmpID}</p>
          <p><strong>Name:</strong> {result.Name}</p>
          <p><strong>Salary:</strong> ₹{result.Salary}</p>
          <p><strong>Bonus Percentage:</strong> {result.BonusPercentage}</p>
          <p><strong>Bonus Amount:</strong> ₹{result.BonusAmount}</p>
          <p><strong>Total Salary:</strong> ₹{result.TotalSalary}</p>
          <p style={errorStyle}>Developed By Nisarg for test purpose. ;-)</p>
        </div>
      )}
    </div>
  );
}

const containerStyle = {
  maxWidth: '600px',
  margin: '50px auto',
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  textAlign: 'center',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const formStyle = {
  marginBottom: '20px',
};

const inputStyle = {
  marginLeft: '10px',
  padding: '8px',
  fontSize: '16px',
  width: '150px',
};

const buttonStyle = {
  marginLeft: '10px',
  padding: '8px 16px',
  fontSize: '16px',
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
};

const resultStyle = {
  textAlign: 'left',
  marginTop: '20px',
  padding: '10px',
  border: '1px solid #4CAF50',
  borderRadius: '5px',
  backgroundColor: '#f9fff9',
};
