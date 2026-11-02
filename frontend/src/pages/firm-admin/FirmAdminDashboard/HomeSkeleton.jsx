import React from 'react';

const Block = ({ className }) => <div className={`shimmer rounded-lg ${className}`} />;

const CardShell = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-line bg-surface p-5 space-y-4 ${className}`}>{children}</div>
);

/** The home's layout as shimmering placeholders, so nothing jumps when the data arrives. */
export const HomeSkeleton = () => (
  <div className="space-y-6 pb-8" aria-busy="true" aria-label="Loading your firm's day">
    <div className="rounded-3xl border border-line bg-surface p-6 sm:p-8 flex flex-col lg:flex-row gap-7">
      <div className="flex-1 space-y-4">
        <Block className="h-3 w-48" />
        <Block className="h-9 w-80 max-w-full" />
        <Block className="h-4 w-96 max-w-full" />
        <div className="flex gap-2">
          <Block className="h-7 w-36 rounded-full" />
          <Block className="h-7 w-32 rounded-full" />
        </div>
        <div className="flex gap-2 pt-1">
          <Block className="h-9 w-28 rounded-xl" />
          <Block className="h-9 w-28 rounded-xl" />
        </div>
      </div>
      <div className="shimmer w-[132px] h-[132px] rounded-full self-center" />
    </div>

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardShell key={i}>
          <div className="flex justify-between">
            <Block className="h-4 w-24" />
            <Block className="h-9 w-9 rounded-xl" />
          </div>
          <Block className="h-8 w-20" />
          <Block className="h-3 w-28" />
        </CardShell>
      ))}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <CardShell className="xl:col-span-2">
        <Block className="h-5 w-40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Block className="w-7 h-7 rounded-full" />
            <div className="flex-1 space-y-2">
              <Block className="h-3.5 w-2/3" />
              <Block className="h-3 w-1/3" />
            </div>
            <Block className="h-6 w-24 rounded-full" />
          </div>
        ))}
      </CardShell>
      <div className="space-y-6">
        <CardShell>
          <Block className="h-5 w-32" />
          <Block className="h-3 w-full rounded-full" />
          <div className="grid grid-cols-3 gap-3">
            <Block className="h-10" />
            <Block className="h-10" />
            <Block className="h-10" />
          </div>
        </CardShell>
        <CardShell>
          <Block className="h-5 w-28" />
          <Block className="h-3 w-full rounded-full" />
        </CardShell>
      </div>
    </div>
  </div>
);
