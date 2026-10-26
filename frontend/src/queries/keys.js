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

export const clientKeys = {
  all: ['clients'],
  lists: () => [...clientKeys.all, 'list'],
  list: (scope, filters) => [...clientKeys.lists(), scope, filters], // scope: 'firm' | 'user'
  detail: (id) => [...clientKeys.all, 'detail', id],
  profile: () => [...clientKeys.all, 'profile'],
};
