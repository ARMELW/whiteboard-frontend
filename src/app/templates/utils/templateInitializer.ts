/**
 * Template Initializer
 * Loads professional templates into localStorage on first use
 */

import { PROFESSIONAL_TEMPLATES } from '../data/professionalTemplates';
import templatesService from '../api/templatesService';

const INIT_KEY = 'templates_initialized';

export const initializeProfessionalTemplates = async (): Promise<void> => {
  const isInitialized = localStorage.getItem(INIT_KEY);
  
  if (isInitialized) {
    return;
  }

  try {
    console.log('Initializing professional templates...');
    
    for (const templateData of PROFESSIONAL_TEMPLATES) {
      const template = {
        ...templateData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await templatesService.create(template);
    }
    
    localStorage.setItem(INIT_KEY, 'true');
    console.log(`Successfully initialized ${PROFESSIONAL_TEMPLATES.length} professional templates`);
  } catch (error) {
    console.error('Failed to initialize professional templates:', error);
  }
};

export const resetTemplates = async (): Promise<void> => {
  localStorage.removeItem(INIT_KEY);
  await initializeProfessionalTemplates();
};
