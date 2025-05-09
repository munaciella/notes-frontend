'use client';
import React, { createContext, useContext, useState } from 'react';

type NotesRefreshContextValue = {
  refreshKey: number;
  triggerRefresh: () => void;
};

const NotesRefreshContext = createContext<NotesRefreshContextValue | undefined>(undefined);

export const NotesRefreshProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);
  return (
    <NotesRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </NotesRefreshContext.Provider>
  );
};

export function useNotesRefresh(): NotesRefreshContextValue {
  const ctx = useContext(NotesRefreshContext);
  if (!ctx) throw new Error('useNotesRefresh must be used within NotesRefreshProvider');
  return ctx;
}
