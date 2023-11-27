const { EMPLOYEE_ID, EXPENSE_STATUS } = require("./constants");

let expenses = [
  {
    id: `${EMPLOYEE_ID.Sam}-uber`,
    date: '14/09/2022',
    submitterId: EMPLOYEE_ID.Sam,
    status: EXPENSE_STATUS.Submitted,
    amount: 57.11,
    description: "Uber: Airport to city",
    actionerIds: []
  },
  {
    id: `${EMPLOYEE_ID.Sam}-food`,
    date: '14/09/2022',
    submitterId: EMPLOYEE_ID.Sam,
    status: EXPENSE_STATUS.Submitted,
    amount: 24.11,
    description: "Uber Eats: Diner",
    actionerIds: []
  }
];

const getExpense = (expenseId) => {
  for (const expense of expenses) {
    if (expense.id === expenseId) {
      return expense;
    }
  }
  return null;
}

const approveExpenseByEmployee = (expenseId, employeeId) => {
  let expense = getExpense(expenseId);
  expense.status = EXPENSE_STATUS.Approved;
  expense.approverId = employeeId;
  expense.actionerIds.push(employeeId);
}

const rejectExpenseByEmployee = (expenseId, employeeId) => {
  let expense = getExpense(expenseId);
  expense.status = EXPENSE_STATUS.Rejected;
  expense.rejecterId = employeeId;
  expense.actionerIds.push(employeeId);
}

module.exports = {
  expenses,
  getExpense,
  approveExpenseByEmployee,
  rejectExpenseByEmployee
}