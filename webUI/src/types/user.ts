export type Role = 'PUBLIC' | 'RESIDENT' | 'MUNICIPALITY_MANAGER' | 'ADMIN';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  roles: Role[];
}
