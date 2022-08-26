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
