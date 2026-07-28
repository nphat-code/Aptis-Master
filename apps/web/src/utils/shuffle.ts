/**
 * Array Shuffle Utility for Aptis Practice Tests
 * Implements Fisher-Yates shuffle algorithm to generate non-mutating, randomly ordered arrays.
 */

/**
 * Returns a new array with elements shuffled randomly.
 */
export function shuffleArray<T>(array: T[]): T[] {
  if (!array || array.length <= 1) return array ? [...array] : [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Returns a new array where the first element remains fixed at index 0
 * and the remaining elements (index 1 to end) are shuffled randomly.
 * Useful for Part 5 reading where index 0 is the main text title.
 */
export function shuffleOptionsWithFixedFirst<T>(array: T[]): T[] {
  if (!array || array.length <= 2) return array ? [...array] : [];
  const first = array[0];
  const restShuffled = shuffleArray(array.slice(1));
  return [first, ...restShuffled];
}
