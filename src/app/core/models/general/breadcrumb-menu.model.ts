import { Params } from '@angular/router';

export interface BreadCrumbMenuItem {
    name: string;
    path?: string;
    params: Params;
}