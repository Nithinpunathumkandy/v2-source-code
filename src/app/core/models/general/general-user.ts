import { Image } from '../image.model';

export interface GeneralUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    image: Image
    designation: string;
}