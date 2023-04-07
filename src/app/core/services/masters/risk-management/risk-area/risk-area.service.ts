import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RiskArea,RiskAreaPaginationResponse} from 'src/app/core/models/masters/risk-management/risk-area';
import{RiskAreaMasterStore} from 'src/app/stores/masters/risk-management/risk-area-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class RiskAreaService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<RiskAreaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${RiskAreaMasterStore.currentPage}`;
        if (RiskAreaMasterStore.orderBy) params += `&order_by=${RiskAreaMasterStore.orderItem}&order=${RiskAreaMasterStore.orderBy}`;
      }
      if(RiskAreaMasterStore.searchText) params += (params ? '&q=' : '?q=')+RiskAreaMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<RiskAreaPaginationResponse>('/risk-areas' + (params ? params : '')).pipe(
        map((res: RiskAreaPaginationResponse) => {
          RiskAreaMasterStore.setRiskArea(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<RiskArea[]> {
      return this._http.get<RiskArea[]>('/risk-areas').pipe((
        map((res:RiskArea[])=>{
          RiskAreaMasterStore.setAllRiskArea(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<RiskArea> {
      return this._http.get<RiskArea>('/risk-areas/'+id).pipe((
        map((res:RiskArea)=>{
          RiskAreaMasterStore.setIndividualRiskArea(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/risk-areas', item).pipe(
        map((res:any )=> {
          RiskAreaMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'risk_area_added');
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/risk-areas/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_area_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/risk-areas/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_area_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              RiskAreaMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/risk-areas/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_area_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/risk-areas/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'risk_area_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/risk-areas/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_areas')+".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/risk-areas/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('risk_area_template')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/risk-areas/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/risk-areas/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','risk_area_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortRiskAreaList(type:string, text:string) {
      if (!RiskAreaMasterStore.orderBy) {
        RiskAreaMasterStore.orderBy = 'asc';
        RiskAreaMasterStore.orderItem = type;
      }
      else{
        if (RiskAreaMasterStore.orderItem == type) {
          if(RiskAreaMasterStore.orderBy == 'asc') RiskAreaMasterStore.orderBy = 'desc';
          else RiskAreaMasterStore.orderBy = 'asc'
        }
        else{
          RiskAreaMasterStore.orderBy = 'asc';
          RiskAreaMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
