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
      setError('Please enter an Emp ID.');
      return;
    }

    try {
      const response = await axios.post('/api/calculateBonus', { empId: parseInt(empId) });
      setResult(response.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Employee Bonus Calculator</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Enter Emp ID:
          <input
            type="number"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <button type="submit" style={styles.button}>Calculate Bonus</button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.result}>
          <h2>Employee Details</h2>
          <p><strong>Emp ID:</strong> {result.EmpID}</p>
          <p><strong>Name:</strong> {result.Name}</p>
          <p><strong>Current Salary:</strong> ₹{result.Salary}</p>
          <p><strong>Bonus Percentage:</strong> {result.BonusPercentage}</p>
          <p><strong>Bonus Amount:</strong> ₹{result.BonusAmount}</p>
          <p><strong>Addon Salary:</strong> ₹{result.AddonSalary}</p>
          <p><strong>Total Salary:</strong> ₹{result.TotalSalary}</p>
          <p style={styles.error}>Developed By Nisarg for test purpose. ;-)</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  form: {
    marginBottom: '20px'
  },
  input: {
    marginLeft: '10px',
    padding: '8px',
    fontSize: '16px',
    width: '150px'
  },
  button: {
    marginLeft: '10px',
    padding: '8px 16px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  error: {
    color: 'red'
  },
  result: {
    textAlign: 'left',
    marginTop: '20px',
    padding: '10px',
    border: '1px solid #4CAF50',
    borderRadius: '5px',
    backgroundColor: '#f9fff9'
  }
};
