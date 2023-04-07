import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Section,SectionDetails,SectionPaginationResponse } from 'src/app/core/models/masters/organization/section';
import{SectionMasterStore} from 'src/app/stores/masters/organization/section-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status: boolean = false): Observable<SectionPaginationResponse> {
      let params = '';
      if(AuthStore.getActivityPermission(100,'SECTION_LIST')){
     
      if (!getAll) {
        params = `?page=${SectionMasterStore.currentPage}`;
        if (SectionMasterStore.orderBy) params += `&order_by=${SectionMasterStore.orderItem}&order=${SectionMasterStore.orderBy}`;

      }
      if(SectionMasterStore.searchText) params += (params ? '&q=' : '?q=')+SectionMasterStore.searchText;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(additionalParams) params += additionalParams;
      return this._http.get<SectionPaginationResponse>('/sections' + (params ? params : '')).pipe(
        map((res: SectionPaginationResponse) => {
          SectionMasterStore.setSection(res);
          return res;
        })
      );
      }
      else{
        let sectionList = new Subject<SectionPaginationResponse>();
        return sectionList.asObservable()
      }
   
    }

    getAllItems(): Observable<Section[]> {
      if(AuthStore.getActivityPermission(100,'SECTION_LIST')){
      return this._http.get<Section[]>('/sections').pipe((
        map((res:Section[])=>{
          SectionMasterStore.setAllSection(res);
          return res;
        })
      ))
      }
      else{
        let sectionList = new Subject<Section[]>();
        return sectionList.asObservable()
      }
    }

    getItem(id): Observable<SectionDetails> {
      return this._http.get<SectionDetails>('/sections/'+id).pipe((
        map((res:SectionDetails)=>{
          SectionMasterStore.setIndividualSection(res);
          return res;
        })
      ))
    }

    saveItem(item: Section) {
      return this._http.post('/sections', item).pipe(
        map((res:any )=> {
          SectionMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success','create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: Section): Observable<any> {
      return this._http.put('/sections/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/sections/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              SectionMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/sections/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/sections/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/sections/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('section_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/sections/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('section')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/sections/share',data).pipe(
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
      return this._http.post('/sections/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    searchSection(params){
      if(AuthStore.getActivityPermission(100,'SECTION_LIST')){
      return this.getItems(params ? params : '').pipe(
        map((res: SectionPaginationResponse) => {
          SectionMasterStore.setSection(res);
          return res;
        })
      );
    }
    }

    sortSectionlList(type:string, text:string) {
      if (!SectionMasterStore.orderBy) {
        SectionMasterStore.orderBy = 'asc';
        SectionMasterStore.orderItem = type;
      }
      else{
        if (SectionMasterStore.orderItem == type) {
          if(SectionMasterStore.orderBy == 'asc') SectionMasterStore.orderBy = 'desc';
          else SectionMasterStore.orderBy = 'asc'
        }
        else{
          SectionMasterStore.orderBy = 'asc';
          SectionMasterStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      //   this.getItems(false,`&q=${text}`,true).subscribe();
    }
   
    getLastInserted(){
      return SectionMasterStore.LastInsertedId
     
    }

}

