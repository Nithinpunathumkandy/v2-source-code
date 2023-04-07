import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TemplateList,Template,TemplateDetails,TemplatePaginationResponse} from 'src/app/core/models/knowledge-hub/templates/templates'
import { map } from "rxjs/operators";
import {TemplateStore} from 'src/app/stores/knowledge-hub/templates/templates.store'
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class KnTemplatesService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,) { }



  getAllItems(getAll: boolean = false, resparams: string = '',listAll:boolean=true): Observable<TemplatePaginationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${TemplateStore.currentPage}&limit=8`;
      if (TemplateStore.orderBy) params += `&order=${TemplateStore.orderBy}&order_by=${TemplateStore.orderItem}`;
    }
    if (resparams) params += resparams;
    if(listAll)params +=(params?'&status=all':'?status=all')
    if(TemplateStore.searchText) params += (params ? '&q=' : '?q=')+TemplateStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'document_template' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<TemplatePaginationResponse>('/document-templates'+ (params ? params : '')+(resparams ? resparams : '') )
      .pipe(
        map((res: TemplatePaginationResponse) => {
          TemplateStore.setTemplatesList(res);
          return res;
        })
      );
  }


  saveItem(template: Template) {
    return this._http.post('/document-templates',template).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'template_created');
      this.getAllItems().subscribe();
      return res;
    }))

  }

  getItemById(id:number):Observable<TemplateDetails>{
    return this._http.get<TemplateDetails>('/document-templates/' + id).pipe(map((res: TemplateDetails) => {
      TemplateStore.setTemplateDetails(res)
      return res;
    }))
  }

  updateItem(id, template: Template): Observable<any>{
    return this._http.put('/document-templates/'+id,template).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'template_updated');
      this.getAllItems().subscribe()
      this.getItemById(id).subscribe();
      return res;
    }))
  }

  delete(id: number) {
    return this._http.delete("/document-templates/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "template_deleted"
        );
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/document-templates/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_template_activated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/document-templates/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'document_template_deactivated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }


  setTemplateFile(imageDetails,url,type){
    TemplateStore.setTemplateFiles(imageDetails,url,type);
  }

  generateTemplate() {
    this._http.get('/document-templates/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "DocumentTemplate.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/document-templates/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Templates.xlsx");
      }
    )
  }

  
}
