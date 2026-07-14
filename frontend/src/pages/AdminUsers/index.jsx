import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  Search, ChevronLeft, ChevronRight, SlidersHorizontal,
  ArrowUpDown, Calendar, MapPin, Phone, Mail, Users,
  Copy, Check, ShieldCheck, ShieldAlert,
} from 'lucide-react';
import { userApi } from '../../api/userApi';
import DashboardLayout from '../../layouts/DashboardLayout';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const [copiedId, setCopiedId] = useState(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit, sortBy, sortOrder };
      if (search.trim()) params.search = search.trim();
      if (roleFilter !== 'all') params.role = roleFilter;

      const res = await userApi.getUsers(params);
      setUsers(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalRecords(res.pagination?.totalRecords || 0);
    } catch (err) {
      if (err.status === 404) {
        setUsers([]);
        setTotalPages(1);
        setTotalRecords(0);
      } else {
        toast.error(err.message || 'Failed to load users.', {
          position: 'top-right', autoClose: 4000, theme: 'dark',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const changeFilter = (type, value) => {
    setPage(1);
    if (type === 'role') setRoleFilter(value);
    if (type === 'search') setSearch(value);
  };

  const copyToClipboard = (text, id, label) => {
    navigator.clipboard.writeText(text);
    setCopiedId(`${id}-${label}`);
    toast.success(`${label} copied!`, {
      position: 'bottom-center', autoClose: 1200, hideProgressBar: true, theme: 'dark',
    });
    setTimeout(() => setCopiedId(null), 1600);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <DashboardLayout title="Manage Users">
      <div className="admin-page">

        {/* ── Stats Row ── */}
        <div className="admin-stats-row">

          <div className="stat-card stat-card--primary">
            <div className="stat-card__info">
              <span className="stat-card__label">Total Accounts</span>
              <span className="stat-card__value">{totalRecords}</span>
              <span className="stat-card__status">
                <span className="stat-card__dot stat-card__dot--green" />
                System active
              </span>
            </div>
            <div className="stat-card__icon stat-card__icon--primary">
              <Users size={18} />
            </div>
          </div>

          <div className="stat-card stat-card--danger">
            <div className="stat-card__info">
              <span className="stat-card__label">Administrators</span>
              <span className="stat-card__value">{adminCount}</span>
              <span className="stat-card__status">
                <span className="stat-card__dot stat-card__dot--rose" />
                Full privilege
              </span>
            </div>
            <div className="stat-card__icon stat-card__icon--danger">
              <ShieldAlert size={18} />
            </div>
          </div>

          <div className="stat-card stat-card--success">
            <div className="stat-card__info">
              <span className="stat-card__label">System Verified</span>
              <span className="stat-card__value">100%</span>
              <span className="stat-card__status">
                <span className="stat-card__dot stat-card__dot--emerald" />
                All OTP checked
              </span>
            </div>
            <div className="stat-card__icon stat-card__icon--success">
              <ShieldCheck size={18} />
            </div>
          </div>

        </div>

        {/* ── Toolbar ── */}
        <div className="admin-toolbar">

          <div className="admin-search">
            <Search size={16} className="admin-search__icon" />
            <input
              type="text"
              placeholder="Search by name, email, city..."
              value={search}
              onChange={(e) => changeFilter('search', e.target.value)}
              className="admin-search__input"
            />
          </div>

          <div className="admin-toolbar__controls">

            <div className="admin-tabs">
              {['all', 'user', 'admin'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => changeFilter('role', r)}
                  className={`admin-tab ${roleFilter === r ? 'admin-tab--active' : ''}`}
                >
                  {r === 'all' ? 'All Roles' : `${r}s`}
                </button>
              ))}
            </div>

            <div className="admin-sort">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="admin-sort__select"
              >
                <option value="createdAt">Joined Date</option>
                <option value="firstName">Alphabetical</option>
                <option value="email">Email</option>
                <option value="city">City</option>
              </select>

              <button
                type="button"
                onClick={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
                className={`admin-sort__toggle ${sortOrder === 'asc' ? 'admin-sort__toggle--asc' : ''}`}
                title={`Sort: ${sortOrder.toUpperCase()}`}
              >
                <ArrowUpDown size={14} />
              </button>
            </div>

          </div>
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="admin-loading">
            <div className="admin-spinner" />
            <span className="admin-loading__text">Syncing users directory...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__icon"><Search size={24} /></div>
            <h4 className="admin-empty__title">No matching users found</h4>
            <p className="admin-empty__desc">
              We couldn't find any accounts matching your filters. Try broadening your search term.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Cards Grid */}
            <div className="admin-grid">
              {users.map((item) => {
                const isAdmin = item.role === 'admin';
                const roleClass = isAdmin ? 'admin' : 'user';
                return (
                  <div key={item.id} className={`user-card user-card--${roleClass}`}>

                    {/* Header */}
                    <div className="user-card__header">
                      <div className="user-card__identity">
                        <div className={`user-card__avatar user-card__avatar--${roleClass}`}>
                          {item.firstName[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="user-card__name">{item.firstName} {item.lastName}</div>
                          <span className="user-card__id" title={item.id}>{item.id}</span>
                        </div>
                      </div>
                      <span className={`user-card__badge user-card__badge--${roleClass}`}>
                        {item.role}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="user-card__body">

                      {/* Email */}
                      <div className="user-card__row">
                        <div className="user-card__field">
                          <Mail size={13} className="user-card__field-icon" />
                          <span title={item.email}>{item.email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.email, item.id, 'Email')}
                          className={`user-card__copy ${copiedId === `${item.id}-Email` ? 'user-card__copy--done' : ''}`}
                          title="Copy email"
                        >
                          {copiedId === `${item.id}-Email` ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>

                      {/* Phone */}
                      <div className="user-card__row">
                        <div className="user-card__field">
                          <Phone size={13} className="user-card__field-icon" />
                          <span>{item.mobileNumber}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(item.mobileNumber, item.id, 'Phone')}
                          className={`user-card__copy ${copiedId === `${item.id}-Phone` ? 'user-card__copy--done' : ''}`}
                          title="Copy phone"
                        >
                          {copiedId === `${item.id}-Phone` ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>

                      {/* City */}
                      <div className="user-card__row">
                        <div className="user-card__field">
                          <MapPin size={13} className="user-card__field-icon" />
                          <span>{item.city}</span>
                        </div>
                      </div>

                      {/* Joined */}
                      <div className="user-card__footer">
                        <Calendar size={13} className="user-card__footer-icon" />
                        <span>Joined on {formatDate(item.createdAt)}</span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="admin-pagination">
              <span className="admin-pagination__info">
                Showing <strong>{totalRecords > 0 ? (page - 1) * limit + 1 : 0}</strong> to{' '}
                <strong>{Math.min(page * limit, totalRecords)}</strong> of{' '}
                <strong>{totalRecords}</strong> registered users
              </span>

              <div className="admin-pagination__buttons">
                <button
                  type="button"
                  disabled={page === 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                  className="admin-pagination__btn"
                >
                  <ChevronLeft size={14} /> Previous
                </button>
                <button
                  type="button"
                  disabled={page === totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                  className="admin-pagination__btn"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
