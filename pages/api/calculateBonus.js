import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { empId } = req.body;

  if (!empId) {
    return res.status(400).json({ error: 'Employee ID is required' });
  }

  const employeesPath = path.join(process.cwd(), 'data', 'employees.json');
  const bonusRangesPath = path.join(process.cwd(), 'data', 'bonusRanges.json');

  try {
    const employeesData = fs.readFileSync(employeesPath, 'utf8');
    const employees = JSON.parse(employeesData);

    const employee = employees.find(emp => emp.EmpID === parseInt(empId));

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const { Name, Salary } = employee;

    const bonusRangesData = fs.readFileSync(bonusRangesPath, 'utf8');
    const bonusRanges = JSON.parse(bonusRangesData);

    let bonusPercentage = 0;
    for (const range of bonusRanges) {
      if (Salary >= range.min && (range.max === null || Salary <= range.max)) {
        bonusPercentage = range.bonusPercentage;
        break;
      }
    }

    const bonusAmount = (Salary * bonusPercentage) / 100;
    const totalSalary = Salary + bonusAmount;

    return res.status(200).json({
      EmpID: employee.EmpID,
      Name,
      Salary,
      BonusPercentage: `${bonusPercentage}%`,
      BonusAmount: bonusAmount,
      TotalSalary: totalSalary
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
