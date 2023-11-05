const allRoles = {
  admin: ['getUsers', 'manageUsers', 'getTasks', 'manageTasks'],
  user: ['getUsers', 'manageUsers', 'getTasks', 'manageTasks'],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
