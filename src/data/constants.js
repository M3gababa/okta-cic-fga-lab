const EMPLOYEE_ID = {
  Sam: "sam",
  Daniel: "daniel",
  Matt: "matt",
  Peter: "peter",
  Michel: "michel"
};

const EMPLOYEE_DETAIL = {
  [EMPLOYEE_ID.Sam]: {
    name: "Sam"
  },
  [EMPLOYEE_ID.Daniel]: {
    name: "Daniel"
  },
  [EMPLOYEE_ID.Matt]: {
    name: "Matt"
  },
  [EMPLOYEE_ID.Peter]: {
    name: "Peter"
  },
  [EMPLOYEE_ID.Michel]: {
    name: "Michel"
  }
};

const EXPENSE_STATUS = {
  Submitted: "Submitted",
  Approved: "Approved",
  Rejected: "Rejected"
};

const FGA_TYPE = {
  Expense: "expense",
  Employee: "employee"
};

const FGA_RELATIONSHIP = {
  CanManage: "can_manage",
  Submitter: "submitter",
  Approver: "approver",
  Rejecter: "rejecter",
  Viewer: "viewer",
  Manager: "manager"
};

module.exports = {
  EMPLOYEE_ID,
  EMPLOYEE_DETAIL,
  EXPENSE_STATUS,
  FGA_TYPE,
  FGA_RELATIONSHIP
}