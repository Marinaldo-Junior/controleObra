import { Profile } from './profile';

export interface Worker {
    uid?: string;
    name?: string;
    doc?: string;
    cellPhone?: string;
    profile?: Profile;
    selected?: boolean;
}
