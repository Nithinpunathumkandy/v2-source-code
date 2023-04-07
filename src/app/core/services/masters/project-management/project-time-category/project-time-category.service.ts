import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProjectTimeCategory,ProjectTimeCategoryPaginationResponse} from 'src/app/core/models/masters/project-management/project-time-category';
import{ProjectTimeCategoryMasterStore} from 'src/app/stores/masters/project-management/project-time-category-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectTimeCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectTimeCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectTimeCategoryMasterStore.currentPage}`;
        if (ProjectTimeCategoryMasterStore.orderBy) params += `&order_by=${ProjectTimeCategoryMasterStore.orderItem}&order=${ProjectTimeCategoryMasterStore.orderBy}`;
      }
      if(ProjectTimeCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectTimeCategoryMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectTimeCategoryPaginationResponse>('/project-time-categories' + (params ? params : '')).pipe(
        map((res: ProjectTimeCategoryPaginationResponse) => {
          ProjectTimeCategoryMasterStore.setProjectTimeCategory(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<ProjectTimeCategory[]> {
      return this._http.get<ProjectTimeCategory[]>('/project-time-categories').pipe((
        map((res:ProjectTimeCategory[])=>{
          ProjectTimeCategoryMasterStore.setAllProjectTimeCategory(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<ProjectTimeCategory> {
      return this._http.get<ProjectTimeCategory>('/project-time-categories/'+id).pipe((
        map((res:ProjectTimeCategory)=>{
          ProjectTimeCategoryMasterStore.setIndividualProjectTimeCategory(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/project-time-categories', item).pipe(
        map((res:any )=> {
          ProjectTimeCategoryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('Success!', 'project_time_category_added');
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/project-time-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_time_category_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/project-time-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_time_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ProjectTimeCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-time-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_time_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-time-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_time_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/project-time-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_time_categories') + ".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/project-time-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    generateTemplate() {
      this._http.get('/project-time-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_time_category_template') + ".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/project-time-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','project_time_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortProjectTimeCategoryList(type:string, text:string) {
      if (!ProjectTimeCategoryMasterStore.orderBy) {
        ProjectTimeCategoryMasterStore.orderBy = 'asc';
        ProjectTimeCategoryMasterStore.orderItem = type;
      }
      else{
        if (ProjectTimeCategoryMasterStore.orderItem == type) {
          if(ProjectTimeCategoryMasterStore.orderBy == 'asc') ProjectTimeCategoryMasterStore.orderBy = 'desc';
          else ProjectTimeCategoryMasterStore.orderBy = 'asc'
        }
        else{
          ProjectTimeCategoryMasterStore.orderBy = 'asc';
          ProjectTimeCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    
    sortTaskCategryList(type:string) {
      if (!ProjectTimeCategoryMasterStore.orderBy) {
        ProjectTimeCategoryMasterStore.orderBy = 'desc';
        ProjectTimeCategoryMasterStore.orderItem = type;
      }
      else{
        if (ProjectTimeCategoryMasterStore.orderItem == type) {
          if(ProjectTimeCategoryMasterStore.orderBy == 'desc') ProjectTimeCategoryMasterStore.orderBy = 'asc';
          else ProjectTimeCategoryMasterStore.orderBy = 'desc'
        }
        else{
          ProjectTimeCategoryMasterStore.orderBy = 'desc';
          ProjectTimeCategoryMasterStore.orderItem = type;
        }
      }
    }


    selectRequiredIssueCategory(issues){
   
      ProjectTimeCategoryMasterStore.addSelecteIssueCategory(issues);
    }

}
