import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BpmSupplierFileServiceService {

  constructor() { }

  getThumbnailPreview(type,token,h?:number,w?:number){
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'supplier-logo': return environment.apiBasePath+ '/master/files/suppliers/thumbnail?token='+token;
          break;
     
    }
    // +'&h=140&w=200'
    // +'&h=140&w=200'
    // +'&h='+(h ? h : '150')+'&w='+(w ? w : 200)
  }
}

