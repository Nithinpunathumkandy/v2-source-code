import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Division,DivisionPaginationResponse } from 'src/app/core/models/masters/organization/division';
import{DivisionMasterStore} from 'src/app/stores/masters/organization/division-store';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AuthStore } from 'src/app/stores/auth.store';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<DivisionPaginationResponse> {
      let params = '';
      if(AuthStore.getActivityPermission(100,'DIVISION_LIST')){
     
      if (!getAll) {
        params = `?page=${DivisionMasterStore.currentPage}`;
        if (DivisionMasterStore.orderBy) params += `&order_by=${DivisionMasterStore.orderItem}&order=${DivisionMasterStore.orderBy}`;

      }
      if(DivisionMasterStore.searchText) params += (params ? '&q=' : '?q=')+DivisionMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<DivisionPaginationResponse>('/divisions' + (params ? params : '')).pipe(
        map((res: DivisionPaginationResponse) => {
          DivisionMasterStore.setDivision(res);
          return res;
        })
      );
      }
      else{
        let divisionList = new Subject<DivisionPaginationResponse>();
        return divisionList.asObservable()
      }
    }

    getAllItems(): Observable<Division[]> {
      if(AuthStore.getActivityPermission(100,'DIVISION_LIST')){
     
      return this._http.get<Division[]>('/divisions').pipe((
        map((res:Division[])=>{
          DivisionMasterStore.setAllDivision(res);
          return res;
        })
      ))
      }
      else{
        let divisionList = new Subject<Division[]>();
        return divisionList.asObservable()
      }
    }
    getItem(id): Observable<Division> {
      return this._http.get<Division>('/divisions/'+id).pipe((
        map((res:Division)=>{
          DivisionMasterStore.setIndividualDivision(res);
          return res;
        })
      ))
    }
    saveItem(item: Division) {
      return this._http.post('/divisions', item).pipe(
        map((res:any )=> {
          DivisionMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success','create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: Division): Observable<any> {
      return this._http.put('/divisions/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/divisions/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              DivisionMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/divisions/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/divisions/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/divisions/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('division_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/divisions/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('division')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/divisions/share',data).pipe(
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
      return this._http.post('/divisions/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }
    searchDivision(params){
      if(AuthStore.getActivityPermission(100,'DIVISION_LIST')){
     
      return this.getItems(params ? params : '').pipe(
        map((res: DivisionPaginationResponse) => {
          DivisionMasterStore.setDivision(res);
          return res;
        })
      );
      }
    }
    

    sortDivisionlList(type:string, text:string) {
      if (!DivisionMasterStore.orderBy) {
        DivisionMasterStore.orderBy = 'asc';
        DivisionMasterStore.orderItem = type;
      }
      else{
        if (DivisionMasterStore.orderItem == type) {
          if(DivisionMasterStore.orderBy == 'asc') DivisionMasterStore.orderBy = 'desc';
          else DivisionMasterStore.orderBy = 'asc'
        }
        else{
          DivisionMasterStore.orderBy = 'asc';
          DivisionMasterStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      //   this.getItems(false,`&q=${text}`,true).subscribe();
    }

    saveDivisionId(id){

    }

}

