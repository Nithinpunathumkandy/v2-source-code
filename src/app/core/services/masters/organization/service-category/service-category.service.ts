import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServiceCategory,ServiceCategoryPaginationResponse } from 'src/app/core/models/masters/organization/service-category';
import { ServiceCategoryMasterStore } from 'src/app/stores/masters/organization/service-category-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }


    getItems(getAll: boolean = false, additionalParams?: string,status: boolean = false): Observable<ServiceCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ServiceCategoryMasterStore.currentPage}`;
        if (ServiceCategoryMasterStore.orderBy) params += `&order_by=${ServiceCategoryMasterStore.orderItem}&order=${ServiceCategoryMasterStore.orderBy}`;
  
      }
      if (additionalParams) params += additionalParams;
      if(status) params += (params ? '&' : '?')+'status=all';
      if(ServiceCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ServiceCategoryMasterStore.searchText;
      return this._http.get<ServiceCategoryPaginationResponse>('/service-categories' + (params ? params : '')).pipe(
        map((res: ServiceCategoryPaginationResponse) => {
  
          ServiceCategoryMasterStore.setServiceCategory(res);
          return res;}
        ))
    }
  
    getAllItems():Observable<ServiceCategory[]> {
      return this._http.get<ServiceCategory[]>('/service-categories').pipe((
       map((res:ServiceCategory[]) => {
  
        ServiceCategoryMasterStore.setAllServiceCategory(res);
        return res;
       }) 
      ))
    }
  
    saveItem(item:ServiceCategory){
      return this._http.post('/service-categories', item).pipe((
        map((res:any)=>{
          ServiceCategoryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('Success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      ))
    }
  
    updateItem(id:number,item:ServiceCategory): Observable<any> {
      return this._http.put('/service-categories/' + id,item).pipe((
        map((res:any)=>{
          this._utilityService.showSuccessMessage('success','update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      ))
    }
  
    delete(id:number){
      return this._http.delete('/service-categories/' + id).pipe((
        map((res:any)=>{
          this._utilityService.showSuccessMessage('success','delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ServiceCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
  
          return res;
        })
      ))
    }
  
    activate(id: number) {
      return this._http.put('/service-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/service-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/service-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('service_category_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/service-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('service_category')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/service-categories/share',data).pipe(
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
      return this._http.post('/service-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }
  
    sortServiceCategoryList(type:string, text:string) {
      if (!ServiceCategoryMasterStore.orderBy) {
        ServiceCategoryMasterStore.orderBy = 'asc';
        ServiceCategoryMasterStore.orderItem = type;
      }
      else{
        if (ServiceCategoryMasterStore.orderItem == type) {
          if(ServiceCategoryMasterStore.orderBy == 'asc') ServiceCategoryMasterStore.orderBy = 'desc';
          else ServiceCategoryMasterStore.orderBy = 'asc'
        }
        else{
          ServiceCategoryMasterStore.orderBy = 'asc';
          ServiceCategoryMasterStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      //   this.getItems(false,`&q=${text}`,true).subscribe();
    }
  }
  
  
  