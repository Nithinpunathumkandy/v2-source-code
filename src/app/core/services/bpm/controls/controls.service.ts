import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { map } from "rxjs/operators";
import { UtilityService } from "src/app/shared/services/utility.service";
import {
  Controls,
  ControlDetails,
  ControlPageinationResponse,
} from "../../../models/bpm/controls/controls";
import { ControlStore } from "../../../../stores/bpm/controls/controls.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from "src/app/stores/general/right-sidebar-layout.store";

@Injectable({
  providedIn: "root",
})
export class ControlsService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  

//   if (!getAll) 
//   params = `?page=${ControlStore.currentPage}`;
// else
//   params=`?page=${ControlStore.currentPage}&status=all`

  getAllItems(getAll: boolean = false, resparams: string = '',status:boolean = false): Observable<ControlPageinationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${ControlStore.currentPage}`;
      if (ControlStore.orderBy) params += `&order=${ControlStore.orderBy}&order_by=${ControlStore.orderItem}`;
    }
    if (resparams) params += resparams;
    if(ControlStore.searchText) params += (params ? '&q=' : '?q=')+ControlStore.searchText;
    if(status) params += `&status=all`;
    if(RightSidebarLayoutStore.filterPageTag == 'controls' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<ControlPageinationResponse>('/controls'+ (params ? params : '') )
      .pipe(
        map((res: ControlPageinationResponse) => {
          ControlStore.setControls(res);
          return res;
        })
      );
  }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<ControlPageinationResponse> {
    let params = '';
    if (!getAll) {
    }

    return this._http.get<ControlPageinationResponse>('/controls' + (additionalParams ? additionalParams : '')).pipe(
      map((res: ControlPageinationResponse) => {
        ControlStore.setControls(res);
        return res;
      })
    );
  }


  getItemById(id:number):Observable<ControlDetails>{
    return this._http.get<ControlDetails>('/controls/' + id).pipe(map((res: ControlDetails) => {
      ControlStore.setControlDetails(res)
      return res;
    }))
  }

  updateItem(id, item: Controls): Observable<any>{
    return this._http.put('/controls/'+id,item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'control_updated');
      this.getAllItems(false,'&status=all').subscribe();
      this.getItemById(id).subscribe()
      return res;
    }))
  }

  saveItem(item: Controls) {
    return this._http.post('/controls',item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'control_created');
      this.getAllItems(false,'&status=all').subscribe();
      return res;
    }))

  }
  activate(id: number) {
    return this._http.put('/controls/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'control_activated');
        this.getAllItems(false,'&status=all').subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/controls/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'control_deactivated');
        this.getAllItems(false,'&status=all').subscribe();
        return res;
      })
    );
  }


  delete(id: number) {
    return this._http.delete("/controls/" + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'control_deleted');
        this.getAllItems(false,'&status=all').subscribe(resp => {
          if (resp.from == null) {        
            ControlStore.setCurrentPage(resp.current_page-1);
            this.getAllItems().subscribe();
          }
        });
        return res;
      })
    );
  }

  generateTemplate() {
    this._http
      .get("/controls/template", { responseType: "blob" as "json" })
      .subscribe((response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_template')+".xlsx");
      });
  }

  exportToExcel() {
    let params = '';
    if (ControlStore.orderBy) params += `&order=${ControlStore.orderBy}`;
    if (ControlStore.orderItem) params += `&order_by=${ControlStore.orderItem}`;
    if(RightSidebarLayoutStore.filterPageTag == 'controls' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http
      .get("/controls/export?status=all"+params, { responseType: "blob" as "json" })
      .subscribe((response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('controls')+".xlsx");
      });
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/controls/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','control_imported');
        this.getAllItems(false,null).subscribe();
        return res;
      })
    )
  }

   /**
   * Select Controls and Store
   * @param controls Selected Controls
   * 
   */
  selectRequiredControls(controls) {
    var controlsToDisplay = [];
  for(let i of controls){
    let obj = {
      id: i.id,
      reference_code: i.reference_code,
      control_title: i.title,
      // category_title: i.control_category_title,
      control_category_title:i.control_category_title,
      control_type_title: i.control_type_title,
      control_efficiency_measure_title: i.control_efficiency_measure_language_title?i.control_efficiency_measure_language_title:i.control_efficiency_measure_title,
      control_efficiency_measure_status_label:i.control_efficiency_measure_label?i.control_efficiency_measure_label:i.control_efficiency_measure_status_label,
      is_accordion_active: false
    }
    controlsToDisplay.push(obj)
}
  
    ControlStore.addSelectedControls(controls,controlsToDisplay);
  }

    /**
   * Sort Control List
   * @param type Sort By Variable
   */
  sortControlList(type, callList: boolean = true) {
    if (!ControlStore.orderBy) {
      ControlStore.orderBy = 'asc';
      ControlStore.orderItem = type;
    }
    else{
      if (ControlStore.orderItem == type) {
        if(ControlStore.orderBy == 'asc') ControlStore.orderBy = 'desc';
        else ControlStore.orderBy = 'asc'
      }
      else{
        ControlStore.orderBy = 'asc';
        ControlStore.orderItem = type;
      }
    }
    if (callList)
    this.getAllItems(false,'&status=all').subscribe();
  }

}
