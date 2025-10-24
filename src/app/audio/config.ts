/**
 * Audio Configuration
 * Query keys and constants for audio management
 */

export const AUDIO_CONFIG = {
  MAX_FILE_SIZE_MB: 50,
  ALLOWED_FORMATS: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
  ALLOWED_EXTENSIONS: ['.mp3', '.wav', '.ogg'],
  DEFAULT_VOLUME: 0.8,
} as const;

export const audioKeys = {
  all: ['audio'] as const,
  lists: () => [...audioKeys.all, 'list'] as const,
  list: (filters: string) => [...audioKeys.lists(), { filters }] as const,
  details: () => [...audioKeys.all, 'detail'] as const,
  detail: (id: string) => [...audioKeys.details(), id] as const,
};
