import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {CompetencyTypes,CompetencyTypesPaginationResponse} from '../../../../models/masters/human-capital/competency-types'
import {CompetencyTypesMasterStore} from '../../../../../stores/masters/human-capital/competency-types-master.store'
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";


@Injectable({
  providedIn: 'root'
})
export class CompetencyTypesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService
  ) { }

  // getItems(getAll: boolean = false): Observable<CompetencyTypesPaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${CompetencyTypesMasterStore.currentPage}&status=all`;
  //     if (CompetencyTypesMasterStore.orderBy) params += `&order_by=designation_zones.title&order=${CompetencyTypesMasterStore.orderBy}`;
  //   }
    

  //   return this._http.get<CompetencyTypesPaginationResponse>('/competency-types' + (params ? params : '')).pipe(
  //     map((res: CompetencyTypesPaginationResponse) => {
  //       CompetencyTypesMasterStore.setCompetencyTypes(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<CompetencyTypesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CompetencyTypesMasterStore.currentPage}`;
      if (CompetencyTypesMasterStore.orderBy)
        params += `&order_by=${CompetencyTypesMasterStore.orderItem}&order=${CompetencyTypesMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all'
    if(CompetencyTypesMasterStore.searchText) params += (params ? '&q=' : '?q=')+CompetencyTypesMasterStore.searchText;

    
    return this._http
      .get<CompetencyTypesPaginationResponse>('/competency-types'+(params ? params : ''))
      .pipe(
        map((res: CompetencyTypesPaginationResponse) => {
          CompetencyTypesMasterStore.setCompetencyTypes(res);
          return res;
        })
      );
  }


  updateItem(id, item: CompetencyTypes): Observable<any> {
    return this._http.put('/competency-types/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  saveItem(item: CompetencyTypes) {
    return this._http.post('/competency-types', item).pipe(
      map(res => {
        CompetencyTypesMasterStore.setLastInsertedcompetencyTypes(res['id']);
        this._utilityService.showSuccessMessage('success','create_success');
        if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
        else this.getItems().subscribe();
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/competency-types/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('competency_type_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/competency-types/export?file', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('competency_type')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/competency-types/share',data).pipe(
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
    return this._http.post('/competency-types/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  activate(id: number) {
    return this._http.put('/competency-types/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/competency-types/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/competency-types/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        this.getItems(false,null,true).subscribe(resp=>{
          if(resp.from==null){
            CompetencyTypesMasterStore.setCurrentPage(resp.current_page-1);
            this.getItems(false,null,true).subscribe();
          }
        });
        return res;
      })
    );
  }
  

  sortCompetencyTypeList(type:string, text:string) {
    if (!CompetencyTypesMasterStore.orderBy) {
      CompetencyTypesMasterStore.orderBy = 'asc';
      CompetencyTypesMasterStore.orderItem = type;
    }
    else{
      if (CompetencyTypesMasterStore.orderItem == type) {
        if(CompetencyTypesMasterStore.orderBy == 'asc') CompetencyTypesMasterStore.orderBy = 'desc';
        else CompetencyTypesMasterStore.orderBy = 'asc'
      }
      else{
        CompetencyTypesMasterStore.orderBy = 'asc';
        CompetencyTypesMasterStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
