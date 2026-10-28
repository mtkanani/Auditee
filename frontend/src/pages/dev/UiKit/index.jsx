import React, { useState } from 'react';
import { Moon, Plus, Sun } from 'lucide-react';
import { Button, PageHeader, Tabs } from '../../../components/ui';
import { useTheme } from '../../../context/ThemeContext';
import { BadgesSection, ButtonsSection, FormSection, StatsSection, TableSection } from './Sections';

/** Development-only showcase of the UI kit (route /ui-kit exists only under `npm run dev`). */
const UiKit = () => {
  const { isDark, toggleTheme } = useTheme();
  const [tab, setTab] = useState('overview');

  return (
    <div className="min-h-screen bg-page text-fg">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        <PageHeader
          eyebrow="Design system"
          title="Auditee UI kit"
          description="Every building block of the new interface, in both themes. Pages move onto these in step 5."
          actions={
            <>
              <Button variant="ghost" icon={isDark ? Sun : Moon} onClick={toggleTheme}>
                {isDark ? 'Light theme' : 'Dark theme'}
              </Button>
              <Button variant="primary" icon={Plus}>New</Button>
            </>
          }
        />
        <Tabs
          variant="underline"
          aria-label="Sections"
          value={tab}
          onChange={setTab}
          items={[{ value: 'overview', label: 'Overview' }, { value: 'forms', label: 'Forms' }, { value: 'data', label: 'Data', count: 4 }]}
        />
        <StatsSection />
        <ButtonsSection />
        <FormSection />
        <BadgesSection />
        <TableSection />
      </div>
    </div>
  );
};

export default UiKit;
