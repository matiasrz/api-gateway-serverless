import moment from 'moment'
import { v4 } from 'uuid'

import IEntityCommonProps = ProjectName.Entities.EntityCommonProps

/**
 * Generate object with core entity parameters initialized.
 * @param pkPrefix Prefix for PK key
 * @param skPrefix Prefix for SK key
 * @returns Partial<{@link IEntityCommonProps}>
 */
// eslint-disable-next-line import/prefer-default-export
export const entityCore = (pkPrefix: string, skPrefix?: string): Partial<IEntityCommonProps> => {
  const newId = v4()
  const now = moment.utc().valueOf()

  return ({
    PK: `${pkPrefix}#${newId}`,
    SK: `${skPrefix ?? pkPrefix}#${newId}`,
    createdAt: now,
    updatedAt: now,
  })
}

/**
 * Extract UUID from a Key(PK, SK)
 * @param key Prefix for PK key
 * @returns 
 */

 export const getUUIDFromKey = (key: string): string => {
  if (!key.includes('#')) return ''

  return key.split('#')[1]
}

/**
 * Structure composition for massive(up to 25) Put & Delete
 * @param item
 * @param requestType 
 * @returns
 */
export function batchWriteStruct<TEntity extends IEntityCommonProps>(item: TEntity, requestType: string) {
  const initialStruct: Record<string, unknown> = { Item: item }

  if (requestType === 'Delete') {
    initialStruct.Key = { PK: item.PK, SK: item.SK }
  }

  return initialStruct
}