// pages/api/calculateBonus.js

import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { empId } = req.body;

  if (!empId) {
    return res.status(400).json({ error: 'empId is required.' });
  }

  // Define paths to the JSON data files
  const employeesPath = path.join(process.cwd(), 'data', 'employees.json');
  const bonusRangesPath = path.join(process.cwd(), 'data', 'bonusRanges.json');

  try {
    // Read and parse employees data
    const employeesData = fs.readFileSync(employeesPath, 'utf8');
    const employees = JSON.parse(employeesData);

    // Find the employee by EmpID
    const employee = employees.find(emp => emp.EmpID === parseInt(empId));

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    const { Name, Salary } = employee;

    // Read and parse bonus ranges
    const bonusRangesData = fs.readFileSync(bonusRangesPath, 'utf8');
    const bonusRanges = JSON.parse(bonusRangesData);

    // Determine the bonus percentage based on salary
    let bonusPercentage = 0;
    for (const range of bonusRanges) {
      if (Salary >= range.min && (range.max === null || Salary <= range.max)) {
        bonusPercentage = range.bonusPercentage;
        break;
      }
    }

    // Calculate bonus amount
    const bonusAmount = (Salary * bonusPercentage) / 100;
    const addonSalary = bonusAmount;
    const totalSalary = Salary + addonSalary;
    const currentSalary = Salary;

    // Prepare the response
    const response = {
      EmpID: employee.EmpID,
      Name,
      Salary: currentSalary,
      BonusPercentage: `${bonusPercentage}%`,
      BonusAmount: bonusAmount,
      AddonSalary: addonSalary,
      TotalSalary: totalSalary
    };

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
