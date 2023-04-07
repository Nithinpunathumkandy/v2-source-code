import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ProjectCategory,ProjectCategoryPaginationResponse} from 'src/app/core/models/masters/project-management/project-category';
import{ProjectCategoryMasterStore} from 'src/app/stores/masters/project-management/project-category-store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectCategoryService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }

    getItems(getAll: boolean = false,additionalParams?:string,status:boolean = false): Observable<ProjectCategoryPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ProjectCategoryMasterStore.currentPage}`;
        if (ProjectCategoryMasterStore.orderBy) params += `&order_by=${ProjectCategoryMasterStore.orderItem}&order=${ProjectCategoryMasterStore.orderBy}`;
      }
      if(ProjectCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectCategoryMasterStore.searchText;
      if(additionalParams)
         params = params ? (params + '&'+additionalParams) : (params + '?'+additionalParams);
      if(status) params += (params ? '&' : '?')+'status=all';
      return this._http.get<ProjectCategoryPaginationResponse>('/project-categories' + (params ? params : '')).pipe(
        map((res: ProjectCategoryPaginationResponse) => {
          ProjectCategoryMasterStore.setProjectCategory(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<ProjectCategory[]> {
      return this._http.get<ProjectCategory[]>('/project-categories').pipe((
        map((res:ProjectCategory[])=>{
          ProjectCategoryMasterStore.setAllProjectCategory(res);
          return res;
        })
      ))
    }
    getItem(id): Observable<ProjectCategory> {
      return this._http.get<ProjectCategory>('/project-categories/'+id).pipe((
        map((res:ProjectCategory)=>{
          ProjectCategoryMasterStore.setIndividualProjectCategory(res);
          return res;
        })
      ))
    }
    saveItem(item) {
      return this._http.post('/project-categories', item).pipe(
        map((res:any )=> {
          ProjectCategoryMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('Success!', 'project_category_added');
         if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems(false,null).subscribe();
          return res;
        })
      );
    }

    updateItem(id, item): Observable<any> {
      return this._http.put('/project-categories/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_category_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/project-categories/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_category_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ProjectCategoryMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/project-categories/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_category_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/project-categories/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'project_category_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    exportToExcel() {
      this._http.get('/project-categories/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_category')+".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/project-categories/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    generateTemplate() {
      this._http.get('/project-categories/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_category_template')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/project-categories/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','project_category_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    sortProjectCategoryList(type:string, text:string) {
      if (!ProjectCategoryMasterStore.orderBy) {
        ProjectCategoryMasterStore.orderBy = 'asc';
        ProjectCategoryMasterStore.orderItem = type;
      }
      else{
        if (ProjectCategoryMasterStore.orderItem == type) {
          if(ProjectCategoryMasterStore.orderBy == 'asc') ProjectCategoryMasterStore.orderBy = 'desc';
          else ProjectCategoryMasterStore.orderBy = 'asc'
        }
        else{
          ProjectCategoryMasterStore.orderBy = 'asc';
          ProjectCategoryMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}
