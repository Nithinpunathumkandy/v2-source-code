import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProjectCostCategory,ProjectCostCategoryPaginationResponse} from 'src/app/core/models/masters/project-management/project-cost-category';
import{ProjectCostCategoryMasterStore} from 'src/app/stores/masters/project-management/project-cost-category-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectCostCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectCostCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectCostCategoryMasterStore.currentPage}`;
        if (ProjectCostCategoryMasterStore.orderBy) params += `&order_by=${ProjectCostCategoryMasterStore.orderItem}&order=${ProjectCostCategoryMasterStore.orderBy}`;
      }
      if(ProjectCostCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectCostCategoryMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectCostCategoryPaginationResponse>('/project-cost-categories' + (params ? params : '')).pipe(
        map((res: ProjectCostCategoryPaginationResponse) => {
          ProjectCostCategoryMasterStore.setProjectCostCategory(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<ProjectCostCategory[]> {
      return this._http.get<ProjectCostCategory[]>('/project-cost-categories').pipe((
        map((res:ProjectCostCategory[])=>{
          ProjectCostCategoryMasterStore.setAllProjectCostCategory(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<ProjectCostCategory> {
      return this._http.get<ProjectCostCategory>('/project-cost-categories/'+id).pipe((
        map((res:ProjectCostCategory)=>{
          ProjectCostCategoryMasterStore.setIndividualProjectCostCategory(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/project-cost-categories', item).pipe(
        map((res:any )=> {
          ProjectCostCategoryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('Success!', 'project_cost_category_added');
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/project-cost-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_cost_category_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/project-cost-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_cost_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ProjectCostCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-cost-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_cost_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-cost-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_cost_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/project-cost-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_cost_categories')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/project-cost-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    generateTemplate() {
      this._http.get('/project-cost-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_cost_category_template')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/project-cost-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','project_cost_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortProjectCostCategoryList(type:string, text:string) {
      if (!ProjectCostCategoryMasterStore.orderBy) {
        ProjectCostCategoryMasterStore.orderBy = 'asc';
        ProjectCostCategoryMasterStore.orderItem = type;
      }
      else{
        if (ProjectCostCategoryMasterStore.orderItem == type) {
          if(ProjectCostCategoryMasterStore.orderBy == 'asc') ProjectCostCategoryMasterStore.orderBy = 'desc';
          else ProjectCostCategoryMasterStore.orderBy = 'asc'
        }
        else{
          ProjectCostCategoryMasterStore.orderBy = 'asc';
          ProjectCostCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
