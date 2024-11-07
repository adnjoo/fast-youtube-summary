import React from 'react';

export const SummaryCard = ({ summary, loading }) => {
  if (!summary || loading) return null;

  return (
    <div className="mx-auto mt-8 max-w-5xl rounded border border-gray-300 p-2 text-sm sm:p-4 sm:text-base">
      <h2 className="mb-2 text-xl">Summary</h2>
      <p>{summary}</p>
    </div>
  );
};
