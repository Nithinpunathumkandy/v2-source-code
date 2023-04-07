import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubSection,SubSectionPaginationResponse } from 'src/app/core/models/masters/organization/sub-section';
import{SubSectionMasterStore} from 'src/app/stores/masters/organization/sub-section-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class SubSectionService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status: boolean = false): Observable<SubSectionPaginationResponse> {
      let params = '';
      if(AuthStore.getActivityPermission(100,'SUB_SECTION_LIST')){
        if (!getAll) {
          params = `?page=${SubSectionMasterStore.currentPage}`;
          if (SubSectionMasterStore.orderBy) params += `&order_by=${SubSectionMasterStore.orderItem}&order=${SubSectionMasterStore.orderBy}`;
  
        }
        if(status) params += (params ? '&' : '?')+'status=all';
        if(SubSectionMasterStore.searchText) params += (params ? '&q=' : '?q=')+SubSectionMasterStore.searchText;
        if(additionalParams) params += additionalParams;
        return this._http.get<SubSectionPaginationResponse>('/sub-sections' + (params ? params : '')).pipe(
          map((res: SubSectionPaginationResponse) => {
            SubSectionMasterStore.setSubSection(res);
            return res;
          })
        );
      }
      else{
        let subSectionList = new Subject<SubSectionPaginationResponse>();
        return subSectionList.asObservable()
      }
     
   
    }

    getAllItems(): Observable<SubSection[]> {
      if(AuthStore.getActivityPermission(100,'SUB_SECTION_LIST')){
     
      return this._http.get<SubSection[]>('/sub-sections').pipe((
        map((res:SubSection[])=>{
          SubSectionMasterStore.setAllSubSection(res);
          return res;
        })
      ))
      }
      else{
        let subSectionList = new Subject<SubSection[]>();
        return subSectionList.asObservable()
      }
    }

    saveItem(item: SubSection) {
      return this._http.post('/sub-sections', item).pipe(
        map((res:any )=> {
          SubSectionMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success','create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: SubSection): Observable<any> {
      return this._http.put('/sub-sections/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/sub-sections/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              SubSectionMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/sub-sections/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/sub-sections/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/sub-sections/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sub_section_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/sub-sections/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('sub_section')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/sub-sections/share',data).pipe(
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
      return this._http.post('/sub-sections/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    searchSubSection(params){
      if(AuthStore.getActivityPermission(100,'SUB_SECTION_LIST')){
     
      return this.getItems(params ? params : '').pipe(
        map((res: SubSectionPaginationResponse) => {
          SubSectionMasterStore.setSubSection(res);
          return res;
        })
      );
      }
    }

    sortSubSectionlList(type:string, text:string) {
      if (!SubSectionMasterStore.orderBy) {
        SubSectionMasterStore.orderBy = 'asc';
        SubSectionMasterStore.orderItem = type;
      }
      else{
        if (SubSectionMasterStore.orderItem == type) {
          if(SubSectionMasterStore.orderBy == 'asc') SubSectionMasterStore.orderBy = 'desc';
          else SubSectionMasterStore.orderBy = 'asc'
        }
        else{
          SubSectionMasterStore.orderBy = 'asc';
          SubSectionMasterStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      //   this.getItems(false,`&q=${text}`,true).subscribe();
    }
   
    getLastInserted(){
      return SubSectionMasterStore.LastInsertedId
     
    }

}

