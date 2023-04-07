import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplianceType,ComplianceTypePaginationResponse } from '../../../../models/masters/compliance-management/compliance-type';
import { ComplianceTypeMasterStore } from 'src/app/stores/masters/compliance-management/compliance-type-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ComplianceTypeService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ComplianceTypePaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ComplianceTypeMasterStore.currentPage}`;
        if (ComplianceTypeMasterStore.orderBy) params += `&order_by=${ComplianceTypeMasterStore.orderItem}&order=${ComplianceTypeMasterStore.orderBy}`;
      }
      if(ComplianceTypeMasterStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceTypeMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ComplianceTypePaginationResponse>('/compliance-document-types' + (params ? params : '')).pipe(
        map((res: ComplianceTypePaginationResponse) => {
          ComplianceTypeMasterStore.setComplianceTypes(res);
          return res;
        })
      );
    }

  getItem(id: number): Observable<ComplianceType> {
    return this._http.get<ComplianceType>('/compliance-document-types/' + id).pipe(
      map((res: ComplianceType) => {
        ComplianceTypeMasterStore.updateComplianceType(res)
        return res;
      })
    );
  }

  updateItem(id, item: ComplianceType): Observable<any> {
    return this._http.put('/compliance-document-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_type_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: ComplianceType) {
    return this._http.post('/compliance-document-types', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_type_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  generateTemplate() {
    this._http.get('/compliance-document-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/compliance-document-types/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_type')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/compliance-document-types/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/compliance-document-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','compliance_type_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/compliance-document-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_type_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/compliance-document-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_type_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/compliance-document-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_type_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ComplianceTypeMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }

  searchComplianceType(params){
    return this.getItems(params ? params : '').pipe(
      map((res: ComplianceTypePaginationResponse) => {
        ComplianceTypeMasterStore.setComplianceTypes(res);
        return res;
      })
    );
  }

  sortComplaniceTypelList(type:string, text:string) {
    if (!ComplianceTypeMasterStore.orderBy) {
      ComplianceTypeMasterStore.orderBy = 'asc';
      ComplianceTypeMasterStore.orderItem = type;
    }
    else{
      if (ComplianceTypeMasterStore.orderItem == type) {
        if(ComplianceTypeMasterStore.orderBy == 'asc') ComplianceTypeMasterStore.orderBy = 'desc';
        else ComplianceTypeMasterStore.orderBy = 'asc'
      }
      else{
        ComplianceTypeMasterStore.orderBy = 'asc';
        ComplianceTypeMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
