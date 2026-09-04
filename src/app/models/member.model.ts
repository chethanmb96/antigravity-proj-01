// ════════════════════════════════════════════════════════
// Member Model
// ════════════════════════════════════════════════════════
//
// TypeScript 'interface' defines the SHAPE of an object.
// Angular requires TypeScript, but you can think of it as
// documentation that the compiler enforces for you.

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
  date: string;  // ISO format: '2024-01-15'
}

// Alias for backwards compatibility
export type Employee = Member;
