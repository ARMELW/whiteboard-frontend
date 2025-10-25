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
};

export default API_ENDPOINTS;
