// ════════════════════════════════════════════════════════
// Employee Model
// ════════════════════════════════════════════════════════
//
// JS Analogy: In plain JS you'd just use an object like:
//   const emp = { id: 1, firstName: 'Susan', ... }
//
// TypeScript 'interface' defines the SHAPE of an object.
// Angular requires TypeScript, but you can think of it as
// documentation that the compiler enforces for you.
//
// If you try to do employee.agee (typo), TypeScript
// catches it at compile time — not at runtime!

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  salary: number;
  date: string;  // ISO format: '2024-01-15'
}
