
/*
 * memory.ts
 * Author: perterpon<perterpon@gmail.com>
 * Create: Sat Oct 26 2019 22:18:37 GMT+0800 (China Standard Time)
 */

import { MEMORY_VOLUME } from 'src/constants';

import vision from 'src/vision';

import { TMemory, TContext } from 'fishman';
 
export function remember(memoryItem: TMemory): void {
  const memory: TMemory[] = vision.memory;
  memory.push(memoryItem);
  if (memory.length > MEMORY_VOLUME) {
    memory.shift();
  }
  vision.memory = memory;
}

export function recall(count: number = 1): TMemory[] {
  const memory: TMemory[] = vision.memory;
  return memory.slice(-count);
}

export function rememberContext(memoryItem: TMemory, situation: string): void {
  const context: TContext[] = vision.context;
  context.push({
    memory: memoryItem,
    situation,
  });
  if (context.length > MEMORY_VOLUME) {
    context.shift();
  }
  vision.context = context;
}
