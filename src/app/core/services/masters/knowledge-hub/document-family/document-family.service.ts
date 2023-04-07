import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {DocumentFamilyMasterStore} from 'src/app/stores/masters/knowledge-hub/document-family-store';
import { DocumentFamily,DocumentFamilyPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-family';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class DocumentFamilyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<DocumentFamilyPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${DocumentFamilyMasterStore.currentPage}`;
        if (DocumentFamilyMasterStore.orderBy) params += `&order_by=${DocumentFamilyMasterStore.orderItem}&order=${DocumentFamilyMasterStore.orderBy}`;
      }
      else {
        this.getAllItems();
      }
     
      if(additionalParams){
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(DocumentFamilyMasterStore.searchText) params += (params ? '&q=' : '?q=')+DocumentFamilyMasterStore.searchText;

      return this._http.get<DocumentFamilyPaginationResponse>('/document-families' + (params ? params : '')).pipe(
        map((res: DocumentFamilyPaginationResponse) => {
          DocumentFamilyMasterStore.setDocumentFamily(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<DocumentFamily[]>{
      return this._http.get<DocumentFamily[]>('/document-families?is_all=true').pipe(
        map((res: DocumentFamily[]) => {
          
          DocumentFamilyMasterStore.setAllDocumentFamilies(res);
          return res;
        })
      );
    }

    saveItem(item: DocumentFamily) {
      return this._http.post('/document-families', item).pipe(
        map((res:any )=> {
           DocumentFamilyMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'document_family_created_successfully');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: DocumentFamily): Observable<any> {
      return this._http.put('/document-families/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_family_updated_successfully');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/document-families/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_family_deleted_successfully');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              DocumentFamilyMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/document-families/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_family_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/document-families/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'document_family_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/document-families/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_family_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/document-families/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('document_families')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/document-families/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }


    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/document-families/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','document_family_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }


    sortDocumentFamilyList(type:string, text:string) {
      if (!DocumentFamilyMasterStore.orderBy) {
        DocumentFamilyMasterStore.orderBy = 'asc';
        DocumentFamilyMasterStore.orderItem = type;
      }
      else{
        if (DocumentFamilyMasterStore.orderItem == type) {
          if(DocumentFamilyMasterStore.orderBy == 'asc') DocumentFamilyMasterStore.orderBy = 'desc';
          else DocumentFamilyMasterStore.orderBy = 'asc'
        }
        else{
          DocumentFamilyMasterStore.orderBy = 'asc';
          DocumentFamilyMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    

}




