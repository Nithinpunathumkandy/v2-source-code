import { Address } from './address.model';

export interface Organization {
    id: number;
    title: string;
    description: string;
    logo_url: string;
    is_primary: number;
    establish_date: string;
    phone: string;
    address: Address;
    website: string;
}