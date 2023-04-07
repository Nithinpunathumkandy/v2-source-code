
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskLibrary,RiskLibraryPaginationResponse} from 'src/app/core/models/masters/risk-management/risk-library';
import{RiskLibraryMasterStore} from 'src/app/stores/masters/risk-management/risk-library-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';



@Injectable({
  providedIn: 'root'
})
export class RiskLibraryService {

 
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskLibraryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskLibraryMasterStore.currentPage}`;
        if (RiskLibraryMasterStore.orderBy) params += `&order_by=${RiskLibraryMasterStore.orderItem}&order=${RiskLibraryMasterStore.orderBy}`;
        //if (RiskLibraryMasterStore.orderBy) params += `&order_by=risk_categories.title&order=${RiskLibraryMasterStore.orderBy}`;
      }
      if(RiskLibraryMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskLibraryMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskLibraryPaginationResponse>('/risk-library' + (params ? params : '')).pipe(
        map((res: RiskLibraryPaginationResponse) => {
          RiskLibraryMasterStore.setRiskLibrary(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<RiskLibrary[]> {
      return this._http.get<RiskLibrary[]>('/risk-library').pipe((
        map((res:RiskLibrary[])=>{
          RiskLibraryMasterStore.setAllRiskLibrary(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<RiskLibrary> {
      return this._http.get<RiskLibrary>('/risk-library/'+id).pipe((
        map((res:RiskLibrary)=>{
          RiskLibraryMasterStore.setIndividualRiskLibrary(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/risk-library', item).pipe(
        map((res:any )=> {
          RiskLibraryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success',this._helperService.translateToUserLanguage( 'risk_library_added'));
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/risk-library/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success',this._helperService.translateToUserLanguage( 'risk_library_updated'));
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/risk-library/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', this._helperService.translateToUserLanguage('risk_library_deleted'));
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RiskLibraryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/risk-library/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success',this._helperService.translateToUserLanguage( 'risk_library_activated'));
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-library/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success',this._helperService.translateToUserLanguage( 'risk_library_deactivated'));
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-library/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_library')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/risk-library/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('risk_library_template') + ".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-library/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success',this._helperService.translateToUserLanguage( 'item_shared'));
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risk-library/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success',this._helperService.translateToUserLanguage('risk_library_imported'));
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortRiskLibraryList(type:string, text:string) {
      if (!RiskLibraryMasterStore.orderBy) {
        RiskLibraryMasterStore.orderBy = 'asc';
        RiskLibraryMasterStore.orderItem = type;
      }
      else{
        if (RiskLibraryMasterStore.orderItem == type) {
          if(RiskLibraryMasterStore.orderBy == 'asc') RiskLibraryMasterStore.orderBy = 'desc';
          else RiskLibraryMasterStore.orderBy = 'asc'
        }
        else{
          RiskLibraryMasterStore.orderBy = 'asc';
          RiskLibraryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
