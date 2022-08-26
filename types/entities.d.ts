/**
 * Remember to change ProjectName for the original name of the project.
 * Most important, must be the same defined inside core.d.ts
 * 
 * Database entities definition
 */
declare namespace ProjectName.Entities {
  /**
 * Interface for base properties that entities share
 */
  export interface EntityCommonProps {
    // Single table design keys
    PK: string,
    SK: string,

    // Traceability attributes
    createdAt: number,
    updatedAt: number,
  }
}
