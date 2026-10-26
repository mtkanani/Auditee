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

export const invoiceKeys = {
  all: ['invoices'],
  lists: () => [...invoiceKeys.all, 'list'],
  list: (scope, filters) => [...invoiceKeys.lists(), scope, filters], // scope: 'firm' | 'client'
  detail: (id) => [...invoiceKeys.all, 'detail', id],
  bankDetails: () => [...invoiceKeys.all, 'bank-details'],
};

export const leaveKeys = {
  all: ['leave'],
  my: () => [...leaveKeys.all, 'my'],
  pending: () => [...leaveKeys.all, 'pending'],
  firmRequests: () => [...leaveKeys.all, 'firm-requests'],
  calendar: (params) => [...leaveKeys.all, 'calendar', params],
  policy: () => [...leaveKeys.all, 'policy'],
  balances: () => [...leaveKeys.all, 'balances'],
};

export const complianceKeys = {
  all: ['compliance'],
  lists: () => [...complianceKeys.all, 'list'],
  list: (filters) => [...complianceKeys.lists(), filters],
};

export const leadKeys = {
  all: ['leads'],
  lists: () => [...leadKeys.all, 'list'],
  list: (filters) => [...leadKeys.lists(), filters],
  detail: (id) => [...leadKeys.all, 'detail', id],
};

export const documentKeys = {
  all: ['documents'],
  lists: () => [...documentKeys.all, 'list'],
  list: (scope, filters) => [...documentKeys.lists(), scope, filters], // scope: 'firm' | 'client' | 'user'
};

export const announcementKeys = {
  all: ['announcements'],
  lists: () => [...announcementKeys.all, 'list'],
  admin: () => [...announcementKeys.lists(), 'admin'],
  user: () => [...announcementKeys.lists(), 'user'],
  detail: (id) => [...announcementKeys.all, 'detail', id],
  analytics: (id) => [...announcementKeys.all, 'analytics', id],
};

export const attendanceKeys = {
  all: ['attendance'],
  today: () => [...attendanceKeys.all, 'today'],
  myLogs: (params) => [...attendanceKeys.all, 'my-logs', params],
  firmReport: (params) => [...attendanceKeys.all, 'firm-report', params],
  geofence: () => [...attendanceKeys.all, 'geofence'],
};

export const meetingKeys = {
  all: ['meetings'],
  lists: () => [...meetingKeys.all, 'list'],
  list: (filters) => [...meetingKeys.lists(), filters],
  detail: (id) => [...meetingKeys.all, 'detail', id],
};



