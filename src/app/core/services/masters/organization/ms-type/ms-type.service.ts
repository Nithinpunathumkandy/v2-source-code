import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MsType, MsTypeSaveResponse,MsTypePaginationResponse, AvailableMsTypes } from 'src/app/core/models/masters/organization/ms-type';
import { MsTypeMasterStore } from 'src/app/stores/masters/organization/ms-type-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AvailableMsTypeVersions } from 'src/app/core/models/masters/organization/ms-type-version';
import { ProfileStore } from "src/app/stores/organization/business_profile/profile/profile.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class MsTypeService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<MsTypePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MsTypeMasterStore.currentPage}`;
        if (MsTypeMasterStore.orderBy) params += `&order_by=${MsTypeMasterStore.orderItem}&order=${MsTypeMasterStore.orderBy}`;
      }
      else{
        this.getAllItems();
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(MsTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+MsTypeMasterStore.searchText;
      return this._http.get<MsTypePaginationResponse>('/ms-types' + (params ? params : '')).pipe(
        map((res: MsTypePaginationResponse) => {
          
          MsTypeMasterStore.setMsTypes(res);
          return res;
        })
      );
    }

    getAvailableMsTypes(params?:string):Observable<AvailableMsTypes[]>{
      return this._http.get<AvailableMsTypes[]>('/subsidiaries/'+ProfileStore.organizationId+'/available-ms-types'+(params ? params : '')).pipe(
        map((res: AvailableMsTypes[]) => {
          MsTypeMasterStore.setAvailableMsTypes(res['data']);
          return res;
        })
      );
    }

    getAllItems(): Observable<MsType[]>{
      return this._http.get<MsType[]>('/ms-types?is_all=true').pipe(
        map((res: MsType[]) => {
          
          MsTypeMasterStore.setAllMsTypes(res);
          return res;
        })
      );
    }

  getItem(id: number): Observable<MsType> {
    return this._http.get<MsType>('/ms-types/' + id).pipe(
      map((res: MsType) => {
        MsTypeMasterStore.updateMsType(res)
        return res;
      })
    );
  }

  updateItem(id, item: MsType): Observable<any> {
    return this._http.put('/ms-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: MsType,setlastInserted = false) {
    return this._http.post('/ms-types', item).pipe(
      map((res: MsTypeSaveResponse) => {
        if(setlastInserted) MsTypeMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/ms-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/ms-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_type')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/ms-types/share',data).pipe(
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
    return this._http.post('/ms-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/ms-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/ms-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/ms-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            MsTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  getMsTypesList(){
    return MsTypeMasterStore.msTypes;
  }

  // Get Available Ms Type Versions Along with current version
  getMsTypeVersionList(params){
    return this._http.get<AvailableMsTypeVersions[]>('/subsidiaries/'+ProfileStore.organizationId+'/available-ms-type-versions'+(params?params:''));
  }

  getLastInserted(){
    return MsTypeMasterStore.lastInsertedId
  }

  sortMsTypeList(type:string, text:string) {
    if (!MsTypeMasterStore.orderBy) {
      MsTypeMasterStore.orderBy = 'asc';
      MsTypeMasterStore.orderItem = type;
    }
    else{
      if (MsTypeMasterStore.orderItem == type) {
        if(MsTypeMasterStore.orderBy == 'asc') MsTypeMasterStore.orderBy = 'desc';
        else MsTypeMasterStore.orderBy = 'asc'
      }
      else{
        MsTypeMasterStore.orderBy = 'asc';
        MsTypeMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }


}
