import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StakeholderType,StakeholderTypePaginationResponse } from '../../../../models/masters/organization/stakeholder-type';
import { StakeholderTypeMasterStore } from 'src/app/stores/masters/organization/stakeholder-type-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class StakeholderTypeService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?: string,status: boolean = false): Observable<StakeholderTypePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${StakeholderTypeMasterStore.currentPage}`;
        if (StakeholderTypeMasterStore.orderBy) params += `&order_by=${StakeholderTypeMasterStore.orderItem}&order=${StakeholderTypeMasterStore.orderBy}`;
        if(additionalParams) params += additionalParams;
      }
      else{
        this.getAllItems();
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(StakeholderTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+StakeholderTypeMasterStore.searchText;
      return this._http.get<StakeholderTypePaginationResponse>('/stakeholder-types' + (params ? params : '')).pipe(
        map((res: StakeholderTypePaginationResponse) => {
          StakeholderTypeMasterStore.setStakeholderTypes(res);
          return res;
        })
      );
    }


  getAllItems(params?: string): Observable<StakeholderType[]> {
    return this._http.get<StakeholderType[]>('/stakeholder-types?is_all=true').pipe(
      map((res: StakeholderType[]) => {
        
        StakeholderTypeMasterStore.setAllStakeholderTypes(res);
        return res;
      })
    );
  }

 

  
  getItem(id: number): Observable<StakeholderType> {
    return this._http.get<StakeholderType>('/stakeholder-types/' + id).pipe(
      map((res: StakeholderType) => {
        StakeholderTypeMasterStore.updateStakeholderType(res)
        return res;
      })
    );
  }



  generateTemplate() {
    this._http.get('/stakeholder-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('stakeholder_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/stakeholder-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('stakeholder_type')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('stakeholder-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/stakeholder-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/stakeholder-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/stakeholder-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }


  sortStakeholderTypeList(type:string, text:string) {
    if (!StakeholderTypeMasterStore.orderBy) {
      StakeholderTypeMasterStore.orderBy = 'asc';
      StakeholderTypeMasterStore.orderItem = type;
    }
    else{
      if (StakeholderTypeMasterStore.orderItem == type) {
        if(StakeholderTypeMasterStore.orderBy == 'asc') StakeholderTypeMasterStore.orderBy = 'desc';
        else StakeholderTypeMasterStore.orderBy = 'asc'
      }
      else{
        StakeholderTypeMasterStore.orderBy = 'asc';
        StakeholderTypeMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }

  
  
}
