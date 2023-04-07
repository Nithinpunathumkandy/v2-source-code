import { Status } from './status.model';

export interface Role {
    id: number;
    title: string;
    status: Status;
}