import { Image } from '../image.model';

export interface CreatedBy {
    id: number, 
    first_name: string, 
    last_name: string,
    email: string, 
    image_url: string, 
    designation: string,
    mobile: string,
    image: Image,
    department:string,
    status:{
        id:number;
    }
}