import toast from 'react-hot-toast';

/** In sample mode, actions only explain themselves; nothing reaches the server. */
export const guard = (sample, action) => (sample ? () => toast('Sample data: nothing was changed.') : action);
