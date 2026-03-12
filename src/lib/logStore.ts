import { useSyncExternalStore } from 'react';

export type LogEntry = {
  id: string;
  message: string;
  timestamp: Date;
};

let logs: LogEntry[] = [
  { id: 'init-1', message: '[SYS]: Boot sequence initiated...', timestamp: new Date() },
  { id: 'init-2', message: '[SYS]: Awaiting user interaction.', timestamp: new Date() },
];
let listeners: Array<() => void> = [];

export const logStore = {
  addLog(message: string) {
    logs = [...logs, { id: Math.random().toString(), message, timestamp: new Date() }].slice(-6); // KEEP LAST 6
    logStore.emitChange();
  },
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  getSnapshot() {
    return logs;
  },
  emitChange() {
    for (const listener of listeners) {
      listener();
    }
  },
};

export function useLogs() {
  return useSyncExternalStore(logStore.subscribe, logStore.getSnapshot, logStore.getSnapshot);
}
