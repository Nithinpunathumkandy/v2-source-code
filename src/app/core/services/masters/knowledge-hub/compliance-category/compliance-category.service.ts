import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplianceCategory,ComplianceCategoryPaginationResponse } from '../../../../models/masters/knowledge-hub/compliance-category';
import { ComplianceCategoryMasterStore } from 'src/app/stores/masters/knowledge-hub/compliance-category-master.store';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ComplianceCategoryService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ComplianceCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ComplianceCategoryMasterStore.currentPage}`;
        if (ComplianceCategoryMasterStore.orderBy) params += `&order_by=${ComplianceCategoryMasterStore.orderItem}&order=${ComplianceCategoryMasterStore.orderBy}`;
      }
      if(ComplianceCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceCategoryMasterStore.searchText;
      if(additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ComplianceCategoryPaginationResponse>('/compliance-categories' + (params ? params : '')).pipe(
        map((res: ComplianceCategoryPaginationResponse) => {
          ComplianceCategoryMasterStore.setComplianceCategories(res);
          return res;
        })
      );
    }

  getItem(id: number): Observable<ComplianceCategory> {
    return this._http.get<ComplianceCategory>('/compliance-categories/' + id).pipe(
      map((res: ComplianceCategory) => {
        ComplianceCategoryMasterStore.updateComplianceCategory(res)
        return res;
      })
    );
  }

  updateItem(id, item: ComplianceCategory): Observable<any> {
    return this._http.put('/compliance-categories/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_category_updated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: ComplianceCategory) {
    return this._http.post('/compliance-categories', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_category_added');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/compliance-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/compliance-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_categories')+".xlsx");
      }
    )
  }

  shareData(data){
    return this._http.post('/compliance-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/compliance-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','compliance_category_imported');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/compliance-categories/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_category_activated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/compliance-categories/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_category_deactivated');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/compliance-categories/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'compliance_category_deleted');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            ComplianceCategoryMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }
  sortComplaniceCategorylList(type:string, text:string) {
    if (!ComplianceCategoryMasterStore.orderBy) {
      ComplianceCategoryMasterStore.orderBy = 'asc';
      ComplianceCategoryMasterStore.orderItem = type;
    }
    else{
      if (ComplianceCategoryMasterStore.orderItem == type) {
        if(ComplianceCategoryMasterStore.orderBy == 'asc') ComplianceCategoryMasterStore.orderBy = 'desc';
        else ComplianceCategoryMasterStore.orderBy = 'asc'
      }
      else{
        ComplianceCategoryMasterStore.orderBy = 'asc';
        ComplianceCategoryMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems(false,null,true).subscribe();
  // else
  // this.getItems(false,`&q=${text}`,true).subscribe();
  }
}
