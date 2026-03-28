import { ActorType } from 'generated/prisma/enums';

export type TokenPayload = {
  id: string;
  email: string;
  role: ActorType;
};
