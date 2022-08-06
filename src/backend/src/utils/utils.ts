import { Description_Bullet } from '@prisma/client';
import { DescriptionBullet } from 'shared';

export const descBulletConverter = (descBullet: Description_Bullet): DescriptionBullet => ({
  ...descBullet,
  id: descBullet.descriptionId ?? undefined,
  dateDeleted: descBullet.dateDeleted ?? undefined
});
