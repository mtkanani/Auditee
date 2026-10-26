export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (scope, filters) => [...taskKeys.lists(), scope, filters], // scope: 'firm' | 'user' | 'client'
  detail: (id) => [...taskKeys.all, 'detail', id],
  clientRequests: () => [...taskKeys.all, 'client-requests'],
};

export const dashboardKeys = {
  all: ['dashboard'],
  byRole: (role) => ['dashboard', role],
};

export const lookupKeys = {
  users: (p) => ['lookup', 'users', p],
  clients: (p) => ['lookup', 'clients', p],
};
