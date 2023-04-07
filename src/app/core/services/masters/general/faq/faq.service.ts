import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Faq,FaqPaginationResponse,FaqSingle } from 'src/app/core/models/masters/general/faq';
import{FaqMasterStore} from 'src/app/stores/masters/general/faq-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";


@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<FaqPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${FaqMasterStore.currentPage}`;
        if (FaqMasterStore.orderBy) params += `&order_by=faq_language.title&order=${FaqMasterStore.orderBy}`;
      }
      if(FaqMasterStore.searchText) params += (params ? '&q=' : '?q=')+FaqMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<FaqPaginationResponse>('/faqs' + (params ? params : '')).pipe(
        map((res: FaqPaginationResponse) => {
          FaqMasterStore.setFaq(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<Faq[]> {
      return this._http.get<Faq[]>('/faqs').pipe((
        map((res:Faq[])=>{
          FaqMasterStore.setAllFaq(res);
          return res;
        })
      ))
    }

    getAllSearchedItems(keyval): Observable<FaqPaginationResponse> {
      
      return this._http.get<FaqPaginationResponse>('/faqs?q='+keyval).pipe((
        map((res:FaqPaginationResponse)=>{
          const data=this._helperService.checkDataWithTitle(res,keyval);
          FaqMasterStore.setSearchFaq(data);
          return data;
        })
      ))
    }
    getItem(id): Observable<FaqSingle> {
      return this._http.get<FaqSingle>('/faqs/'+id).pipe((
        map((res:FaqSingle)=>{
          FaqMasterStore.setIndividualFaq(res);
          return res;
        })
      ))
    }
    saveItem(item: any) {
      return this._http.post('/faqs', item).pipe(
        map((res:any )=> {
        
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/faqs/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/faqs/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              FaqMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/faqs/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/faqs/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/faqs/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('faq')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/faqs/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('faq_template')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/faqs/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }

    sortFaqList(type:string, text:string) {
      if (!FaqMasterStore.orderBy) {
        FaqMasterStore.orderBy = 'desc';
        FaqMasterStore.orderItem = type;
      }
      else{
        if (FaqMasterStore.orderItem == type) {
          if(FaqMasterStore.orderBy == 'desc') FaqMasterStore.orderBy = 'asc';
          else FaqMasterStore.orderBy = 'desc'
        }
        else{
          FaqMasterStore.orderBy = 'desc';
          FaqMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
