import React from 'react';
import { SearchInput } from '../ui/FilterBar';

/** Older search box API, drawn with the kit SearchInput. */
export const SearchBar = ({ value, onChange, placeholder = 'Search', className = '' }) => (
  <SearchInput value={value} onChange={onChange} placeholder={placeholder} className={className} />
);
