import { contextBridge, ipcRenderer } from 'electron';
// Deliberately expose named operations, never the raw IPC API or filesystem.
contextBridge.exposeInMainWorld('desktop', {
  loadProfile: () => ipcRenderer.invoke('profile:load'),
  saveProfile: (profile: unknown) =>
    ipcRenderer.invoke('profile:save', profile),
  exportProfile: (profile: unknown) =>
    ipcRenderer.invoke('profile:export', profile),
  importProfile: () => ipcRenderer.invoke('profile:import'),
  windowAction: (action: unknown) =>
    ipcRenderer.invoke('window:action', action),
});
