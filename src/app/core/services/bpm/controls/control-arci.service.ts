import { Injectable } from '@angular/core';
import { ARCI,ARCIDetails, ARCIPaginationResponse } from '../../../../core/models/bpm/arci/arci';
import { ArciStore } from '../../../../stores/bpm/arci/arci.store'
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';


@Injectable({
  providedIn: 'root'
})
export class ControlArciService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }
  
  getItems(getAll: boolean = false, resparams: string = ''): Observable<ARCIPaginationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${ArciStore.currentPage}&limit=5`;
      if (ArciStore.orderBy) params += `&order=${ArciStore.orderBy}&order_by=${ArciStore.orderItem}`;
      if (resparams) params += resparams;
      if(ArciStore.searchText) params += (params ? '&q=' : '?q=')+ArciStore.searchText;
      // if (ArciStore.orderItem) params += `&order_by=${ArciStore.orderItem}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'arci' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<ARCIPaginationResponse>('/control-arci'+(resparams ? resparams : '') + (params ? params : ''))
      .pipe(
        map((res: ARCIPaginationResponse) => {
          for(let parent of res.data){

            // Setting View More For Different Users

            parent['view_more_accountable_user'] = false
            parent['view_more_consulted_user'] = false
            parent['view_more_informed_user'] = false
            parent['view_more_responsible_user'] = false
            
            // Parsing and Setting Intial User set to be displayed.
            parent['accountable_user_string'] = JSON.stringify(parent.accountable_user)
            let tempAccountable: any = parent.accountable_user.slice(0, 9)
            parent.accountable_user=tempAccountable
            parent['consulted_user_string'] = JSON.stringify(parent.consulted_user)
            let tempConsulted: any = parent.consulted_user.slice(0, 9)
            parent.consulted_user=tempConsulted
            parent['informed_user_string'] = JSON.stringify(parent.informed_user)
            let tempInformed: any = parent.informed_user.slice(0, 9)
            parent.informed_user=tempInformed
            parent['responsible_user_string'] = JSON.stringify(parent.responsible_user)
            let tempResponsible: any = parent.responsible_user.slice(0, 9)
            parent.responsible_user=tempResponsible

          }
          ArciStore.setArciMatrix(res);
          return res;
        })
      );
  }

  getItemById(id:number):Observable<ARCIDetails>{
    return this._http.get<ARCIDetails>('/control-arci/' + id).pipe(map((res: ARCIDetails) => {
      ArciStore.setArciMatrixDetails([res])
      return res;
    }))
  }

  saveItem(item: ARCI,type) {
    return this._http.post('/control-arci', item).pipe(
      map(res => {

        if(type=='save')
          this._utilityService.showSuccessMessage('success', 'arci_matrix_created');
        else
        this._utilityService.showSuccessMessage('success', 'arci_matrix_updated');  
        this.getItems().subscribe(res => {
        });
        return res;
      })
    );
  }
  
  generateTemplate() {
    this._http.get('/control-arci/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('arci_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/control-arci/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('arci')+".xlsx");
      }
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/control-arci/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','process_arci_imported');
        this.getItems(false,null).subscribe();
        return res;
      })
    )
  }

  delete(id: number) {
    return this._http.delete('/control-arci/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'arci_matrix_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  sortARCIList(type, text) {
    if (!ArciStore.orderBy) {
      ArciStore.orderBy = 'asc';
      ArciStore.orderItem = type;
    }
    else{
      if (ArciStore.orderItem == type) {
        if(ArciStore.orderBy == 'asc') ArciStore.orderBy = 'desc';
        else ArciStore.orderBy = 'asc'
      }
      else{
        ArciStore.orderBy = 'asc';
        ArciStore.orderItem = type;
      }
    }
    if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}&`).subscribe()
  }

}
