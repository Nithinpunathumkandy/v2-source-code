import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ComplianceSection, ComplianceSectionPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-section';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ComplianceSectionMasterStore } from 'src/app/stores/masters/compliance-management/compliance-section-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ComplianceSectionService {

  constructor(private _http:HttpClient,
              private _utilityService:UtilityService,
              private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ComplianceSectionPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplianceSectionMasterStore.currentPage}`;
      if (ComplianceSectionMasterStore.orderBy) params += `&order_by=${ComplianceSectionMasterStore.orderItem}&order=${ComplianceSectionMasterStore.orderBy}`;
    }
    if(ComplianceSectionMasterStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceSectionMasterStore.searchText;
    if(additionalParams) params += additionalParams;
    if(status) params += (params ? '&' : '?')+'status=all';
    return this._http.get<ComplianceSectionPaginationResponse>('/compliance-sections' + (params ? params : '')).pipe(
      map((res: ComplianceSectionPaginationResponse) => {
        ComplianceSectionMasterStore.setComplianceSection(res);
        return res;
      })
    );
  }

  saveItem(item: ComplianceSection) {
    return this._http.post('/compliance-sections', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: ComplianceSection): Observable<any> {
    return this._http.put('/compliance-sections/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  
  delete(id: number) {
    return this._http.delete('/compliance-sections/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ComplianceSectionMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/compliance-sections/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/compliance-sections/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/compliance-sections/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_section_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/compliance-sections/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_section')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/compliance-sections/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/compliance-sections/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }
  searchComplianceSection(params){
    return this.getItems(params ? params : '').pipe(
      map((res: ComplianceSectionPaginationResponse) => {
        ComplianceSectionMasterStore.setComplianceSection(res);
        return res;
      })
    );
  }

  sortComplianceSectionList(type:string, text:string) {
    if (!ComplianceSectionMasterStore.orderBy) {
      ComplianceSectionMasterStore.orderBy = 'asc';
      ComplianceSectionMasterStore.orderItem = type;
    }
    else{
      if (ComplianceSectionMasterStore.orderItem == type) {
        if(ComplianceSectionMasterStore.orderBy == 'asc') ComplianceSectionMasterStore.orderBy = 'desc';
        else ComplianceSectionMasterStore.orderBy = 'asc'
      }
      else{
        ComplianceSectionMasterStore.orderBy = 'asc';
        ComplianceSectionMasterStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
