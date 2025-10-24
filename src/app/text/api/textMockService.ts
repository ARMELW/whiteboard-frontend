/**
 * Text Mock Service
 * Simulates backend API for text library management
 * Uses localStorage for persistence
 */

import { TextLibraryItem, CreateTextPayload, UpdateTextPayload } from '../types';
import { TEXT_CONFIG, DEFAULT_TEXT_STYLE } from '../config';

class TextMockService {
  private items: Map<string, TextLibraryItem> = new Map();
  private storageKey = TEXT_CONFIG.STORAGE_KEY;

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Create a new text item
   */
  async createText(payload: CreateTextPayload): Promise<TextLibraryItem> {
    await this.simulateDelay(200);

    if (payload.content.length > TEXT_CONFIG.MAX_CONTENT_LENGTH) {
      throw new Error(`Text content exceeds ${TEXT_CONFIG.MAX_CONTENT_LENGTH} characters`);
    }

    const item: TextLibraryItem = {
      id: this.generateId(),
      content: payload.content,
      style: {
        ...DEFAULT_TEXT_STYLE,
        ...payload.style,
      },
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    this.items.set(item.id, item);
    this.saveToStorage();
    return item;
  }

  /**
   * Get all text items
   */
  async listTexts(): Promise<TextLibraryItem[]> {
    await this.simulateDelay(100);
    return Array.from(this.items.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get a specific text item by ID
   */
  async getText(id: string): Promise<TextLibraryItem | null> {
    await this.simulateDelay(50);
    return this.items.get(id) || null;
  }

  /**
   * Update a text item
   */
  async updateText(payload: UpdateTextPayload): Promise<TextLibraryItem> {
    await this.simulateDelay(150);

    const item = this.items.get(payload.id);
    if (!item) {
      throw new Error(`Text item with ID ${payload.id} not found`);
    }

    if (payload.content && payload.content.length > TEXT_CONFIG.MAX_CONTENT_LENGTH) {
      throw new Error(`Text content exceeds ${TEXT_CONFIG.MAX_CONTENT_LENGTH} characters`);
    }

    const updatedItem: TextLibraryItem = {
      ...item,
      content: payload.content !== undefined ? payload.content : item.content,
      style: payload.style ? { ...item.style, ...payload.style } : item.style,
    };

    this.items.set(payload.id, updatedItem);
    this.saveToStorage();
    return updatedItem;
  }

  /**
   * Delete a text item
   */
  async deleteText(id: string): Promise<void> {
    await this.simulateDelay(100);
    
    if (!this.items.has(id)) {
      throw new Error(`Text item with ID ${id} not found`);
    }

    this.items.delete(id);
    this.saveToStorage();
  }

  /**
   * Duplicate a text item
   */
  async duplicateText(id: string): Promise<TextLibraryItem> {
    await this.simulateDelay(150);

    const original = this.items.get(id);
    if (!original) {
      throw new Error(`Text item with ID ${id} not found`);
    }

    const duplicate: TextLibraryItem = {
      ...original,
      id: this.generateId(),
      content: `${original.content} (Copy)`,
      createdAt: new Date().toISOString(),
      usageCount: 0,
    };

    this.items.set(duplicate.id, duplicate);
    this.saveToStorage();
    return duplicate;
  }

  /**
   * Update usage count for a text item
   */
  updateUsageCount(id: string, count: number): void {
    const item = this.items.get(id);
    if (item) {
      item.usageCount = count;
      this.saveToStorage();
    }
  }

  /**
   * Clear all text items
   */
  async clearAll(): Promise<void> {
    await this.simulateDelay(100);
    this.items.clear();
    this.saveToStorage();
  }

  /**
   * Load items from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const items: TextLibraryItem[] = JSON.parse(stored);
        items.forEach(item => this.items.set(item.id, item));
      }
    } catch (error) {
      console.error('Failed to load text library from storage:', error);
    }
  }

  /**
   * Save items to localStorage
   */
  private saveToStorage(): void {
    try {
      const items = Array.from(this.items.values());
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save text library to storage:', error);
    }
  }

  /**
   * Generate unique ID for text item
   */
  private generateId(): string {
    return `text_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Simulate network delay
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const textMockService = new TextMockService();
