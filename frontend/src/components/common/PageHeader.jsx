import React from 'react';
import { PageHeader as KitPageHeader } from '../ui/PageHeader';

/** Older page header API (title, subtitle, actions) drawn with the kit header. Breadcrumbs are no longer shown. */
// eslint-disable-next-line no-unused-vars
export const PageHeader = ({ title, subtitle, actions, showBreadcrumb }) => (
  <KitPageHeader title={title} description={subtitle} actions={actions} />
);
