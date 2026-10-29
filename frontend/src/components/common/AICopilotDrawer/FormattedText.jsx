import React from 'react';

// **bold** inside a line. The text is rendered as React nodes, never as HTML.
const withBold = (line) =>
  line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-fg">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );

/** Renders the small markdown subset the copilot replies with: ### headings, lists and **bold**. */
export const FormattedText = ({ text }) =>
  text.split('\n').map((line, idx) => {
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="text-sm font-semibold text-fg my-1.5">
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <li key={idx} className="ml-4 list-disc my-1 leading-relaxed">
          {withBold(line.replace(/^[-*]\s+/, ''))}
        </li>
      );
    }
    if (/^\d+\.\s+/.test(line)) {
      return (
        <p key={idx} className="my-1.5 pl-2 border-l-2 border-accent/50 leading-relaxed">
          {withBold(line)}
        </p>
      );
    }
    if (line.trim() === '') return <div key={idx} className="h-1.5" />;
    return (
      <p key={idx} className="leading-relaxed my-1">
        {withBold(line)}
      </p>
    );
  });
