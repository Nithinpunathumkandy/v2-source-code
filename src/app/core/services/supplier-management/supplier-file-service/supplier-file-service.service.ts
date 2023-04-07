import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierFileServiceService {

  constructor() { }

  getThumbnailPreview(token){
    return environment.apiBasePath+ '/master/files/suppliers/thumbnail?token='+token;
  }

  
}

