
import React, { useMemo } from 'react';

const Markdown = ({ content, theme = 'default' }: { content: string, theme?: 'default' | 'bw' | 'pinky' | 'acid' }) => {
  const html = useMemo(() => {
    // @ts-ignore
    return window.marked ? window.marked.parse(content) : content;
  }, [content]);
  
  return <div className={`markdown-body text-sm leading-relaxed ${theme === 'acid' ? 'text-lime-300' : ''}`} dangerouslySetInnerHTML={{ __html: html }} />;
};

export default Markdown;
