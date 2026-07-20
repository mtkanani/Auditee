import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { capitalize } from '../../utils/helpers';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-xs text-slate-400 mb-3 space-x-2">
      <Link to="/" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
        <FiHome className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = capitalize(name.replace('-', ' '));

        return (
          <React.Fragment key={name}>
            <FiChevronRight className="w-3 h-3 text-slate-600" />
            {isLast ? (
              <span className="font-semibold text-indigo-400">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-indigo-400 transition-colors">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
