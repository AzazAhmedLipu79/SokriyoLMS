const roles = {
  STUDENT: 1,
  CC: 2, // Curriculum Coordinators
  Manager: 3,
  FD: 4, // Finance Director
  ADMIN: 9,
  // Guardian: 2,
};

//---------------------------------------
const roleManage = (RoleLimit, UserRole) => {
  if (RoleLimit <= UserRole) {
    return true;
  } else {
    return false;
  }
};

module.exports = { roles, roleManage };

/* const roles = {
  STUDENT: 1,
  CC: 2, // Curriculum Coordinators
  Manager: 3,
  FD: 4, // Finance Director
  ADMIN: 9,
  // Guardian: 2,
};

const roleManage = (RoleLimit, UserRole) => {
  if (RoleLimit <= UserRole) {
    return true;
  } else {
    return false;
  }
};

const roleCheck = roleManage(roles.ADMIN,1);

if (roleCheck) {
     console.log("Grow Up Kid")
      }
 else{
   console.log("Welcome Man")
 
 }
   */
