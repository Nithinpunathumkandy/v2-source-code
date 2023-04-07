import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MsTypeVersion, MsTypeVersionSaveResponse,MsTypeVersionPaginationResponse } from '../../../../models/masters/organization/ms-type-version';
import { MsTypeVersionMasterStore } from 'src/app/stores/masters/organization/ms-type-version-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class MsTypeVersionService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
  
    getItems(getAll: boolean = false, additionalParams?:string, status: boolean = false): Observable<MsTypeVersionPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${MsTypeVersionMasterStore.currentPage}`;
        if (MsTypeVersionMasterStore.orderBy) params += `&order_by=${MsTypeVersionMasterStore.orderItem}&order=${MsTypeVersionMasterStore.orderBy}`;
      }
      else{
        //params = `?is_all=true`;
        this.getAllItems();
      }
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(MsTypeVersionMasterStore.searchText) params += (params ? '&q=' : '?q=')+MsTypeVersionMasterStore.searchText;
      return this._http.get<MsTypeVersionPaginationResponse>('/ms-type-versions' + (params ? params : '')).pipe(
        map((res: MsTypeVersionPaginationResponse) => {
          MsTypeVersionMasterStore.setMsTypeVersions(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<MsTypeVersion[]>{
      return this._http.get<MsTypeVersion[]>('/ms-type-versions?is_all=true').pipe(
        map((res: MsTypeVersion[]) => {
          
          MsTypeVersionMasterStore.setAllMsTypeVersions(res);
          return res;
        })
      );
    }

  getItem(id: number): Observable<MsTypeVersion> {
    return this._http.get<MsTypeVersion>('/ms-type-versions/' + id).pipe(
      map((res: MsTypeVersion) => {
        MsTypeVersionMasterStore.updateMsTypeVersion(res)
        return res;
      })
    );
  }

  updateItem(id, item: MsTypeVersion): Observable<any> {
    return this._http.put('/ms-type-versions/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: MsTypeVersion,setLastId = false) {
    return this._http.post('/ms-type-versions', item).pipe(
      map((res:MsTypeVersionSaveResponse) => {
        if(setLastId) MsTypeVersionMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/ms-type-versions/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_type_version_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/ms-type-versions/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('ms_type_version')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/ms-type-versions/share',data).pipe(
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
    return this._http.post('/ms-type-versions/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/ms-type-versions/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/ms-type-versions/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/ms-type-versions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            MsTypeVersionMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  getLastInserted(){
    return MsTypeVersionMasterStore.lastInsertedId
  }

  sortMsTypeVersionList(type:string, text:string) {
    if (!MsTypeVersionMasterStore.orderBy) {
      MsTypeVersionMasterStore.orderBy = 'asc';
      MsTypeVersionMasterStore.orderItem = type;
    }
    else{
      if (MsTypeVersionMasterStore.orderItem == type) {
        if(MsTypeVersionMasterStore.orderBy == 'asc') MsTypeVersionMasterStore.orderBy = 'desc';
        else MsTypeVersionMasterStore.orderBy = 'asc'
      }
      else{
        MsTypeVersionMasterStore.orderBy = 'asc';
        MsTypeVersionMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }


}
