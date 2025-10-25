export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const prefix = API_BASE_URL;

export const API_ENDPOINTS = {
  scenes: {
    base: `${prefix}/scenes`,
    list: `${prefix}/scenes`,
    create: `${prefix}/scenes`,
    detail: (id: string) => `${prefix}/scenes/${id}`,
    update: (id: string) => `${prefix}/scenes/${id}`,
    delete: (id: string) => `${prefix}/scenes/${id}`,
    duplicate: (id: string) => `${prefix}/scenes/${id}/duplicate`,
    reorder: `${prefix}/scenes/reorder`,
  },
  assets: {
    base: `${prefix}/assets`,
    list: `${prefix}/assets`,
    upload: `${prefix}/assets/upload`,
    detail: (id: string) => `${prefix}/assets/${id}`,
    delete: (id: string) => `${prefix}/assets/${id}`,
  },
  templates: {
    base: `${prefix}/templates`,
    list: `${prefix}/templates`,
    create: `${prefix}/templates`,
    detail: (id: string) => `${prefix}/templates/${id}`,
    update: (id: string) => `${prefix}/templates/${id}`,
    delete: (id: string) => `${prefix}/templates/${id}`,
    export: (id: string) => `${prefix}/templates/${id}/export`,
    import: `${prefix}/templates/import`,
  },
  export: {
    config: `${prefix}/export/config`,
    scene: (id: string) => `${prefix}/export/scene/${id}`,
    video: `${prefix}/export/video`,
  },
  channels: {
    base: `${prefix}/channels`,
    list: `${prefix}/channels`,
    create: `${prefix}/channels`,
    detail: (id: string) => `${prefix}/channels/${id}`,
    update: (id: string) => `${prefix}/channels/${id}`,
    delete: (id: string) => `${prefix}/channels/${id}`,
    archive: (id: string) => `${prefix}/channels/${id}/archive`,
    stats: (id: string) => `${prefix}/channels/${id}/stats`,
    uploadLogo: (id: string) => `${prefix}/channels/${id}/brand-kit/logo`,
  },
  projects: {
    base: `${prefix}/projects`,
    list: (channelId: string) => `${prefix}/channels/${channelId}/projects`,
    create: (channelId: string) => `${prefix}/channels/${channelId}/projects`,
    detail: (id: string) => `${prefix}/projects/${id}`,
    update: (id: string) => `${prefix}/projects/${id}`,
    delete: (id: string) => `${prefix}/projects/${id}`,
    duplicate: (id: string) => `${prefix}/projects/${id}/duplicate`,
    autosave: (id: string) => `${prefix}/projects/${id}/autosave`,
  },
};

export default API_ENDPOINTS;
