const allRoles = {
  admin: [
    'getUsers',
    'manageUsers',
    'getOrders',
    'manageOrders',
    'manageComplexes',
    'getComplexes',
    'manageApartments',
    'getApartments',
    'getHistories',
    'manageHistories',
  ],
  manager: [
    'getUsers',
    'manageUsers',
    'getOrders',
    'manageOrders',
    'manageComplexes',
    'getComplexes',
    'manageApartments',
    'getApartments',
    'getHistories',
    'manageHistories',
  ],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
