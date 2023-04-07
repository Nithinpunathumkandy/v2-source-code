import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskCategory, TaskCategoryPaginationResponse } from 'src/app/core/models/masters/project-management/project-task-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TaskCategoryMasterStore } from 'src/app/stores/masters/project-management/project-task-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectTaskCategoryService {

        constructor(private _http: HttpClient,
          private _helperService: HelperServiceService,
          private _utilityService: UtilityService) { }

        getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TaskCategoryPaginationResponse> {
          let params = '';
          if (!getAll) {
            params = `?page=${TaskCategoryMasterStore.currentPage}`;
            if (TaskCategoryMasterStore.orderBy) params += `&order_by=${TaskCategoryMasterStore.orderItem}&order=${TaskCategoryMasterStore.orderBy}`;
          }
          if (TaskCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=') + TaskCategoryMasterStore.searchText;
          if (additionalParams)
            params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
          if (status) params += (params ? '&' : '?') + 'status=all';
          return this._http.get<TaskCategoryPaginationResponse>('/task-categories' + (params ? params : '')).pipe(
            map((res: TaskCategoryPaginationResponse) => {
              TaskCategoryMasterStore.setTaskCategory(res);
              return res;
            })
          );
        }

        sortTaskCategryList(type:string) {
          if (!TaskCategoryMasterStore.orderBy) {
            TaskCategoryMasterStore.orderBy = 'asc';
            TaskCategoryMasterStore.orderItem = type;
          }
          else{
            if (TaskCategoryMasterStore.orderItem == type) {
              if(TaskCategoryMasterStore.orderBy == 'asc') TaskCategoryMasterStore.orderBy = 'desc';
              else TaskCategoryMasterStore.orderBy = 'asc'
            }
            else{
              TaskCategoryMasterStore.orderBy = 'asc';
              TaskCategoryMasterStore.orderItem = type;
            }
          }
        }

        getItemById(id): Observable<TaskCategory> {
          return this._http.get<TaskCategory>('/task-categories/'+id).pipe((
            map((res:TaskCategory)=>{
              TaskCategoryMasterStore.setIndividualTaskCategory(res);
              return res;
            })
          ))
        }

        activate(id: number) {
          return this._http.put('/task-categories/' + id + '/activate', null).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'project_task_category_activated');
              this.getItems(false,null,true).subscribe();
              return res;
            })
          );
        }

        deactivate(id: number) {
          return this._http.put('/task-categories/' + id + '/deactivate', null).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'project_task_category_deactivated');
              this.getItems(false,null,true).subscribe();
              return res;
            })
          );
        }

        delete(id: number) {
          return this._http.delete('/task-categories/' + id).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'project_task_category_deleted');
              this.getItems(false,null,true).subscribe(resp=>{
                if(resp.from==null){
                  TaskCategoryMasterStore.setCurrentPage(resp.current_page-1);
                  this.getItems(false,null,true).subscribe();
                }
              });
              return res;
            })
          );
        }

        generateTemplate() {
          this._http.get('/task-categories/template', { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('task_category_template') + ".xlsx");
            }
          )
        }

        exportToExcel() {
          this._http.get('/task-categories/export', { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('task_categories') + ".xlsx");
            }
          )}

          shareData(data){
            return this._http.post('/task-categories/share',data).pipe(
              map((res:any )=> {
                this._utilityService.showSuccessMessage('success', 'item_shared');
                return res;
              })
            )
          }
          importData(data){
            // console.log(data);
            // let importDetails = {file: data};
            const formData = new FormData();
            formData.append('file',data);
            return this._http.post('/task-categories/import',data).pipe(
              map((res:any )=> {
                this._utilityService.showSuccessMessage('success','project_task_category_imported');
                this.getItems(false,null,true).subscribe();
                return res;
              })
            )
          }

          updateItem(id, item): Observable<any> {
            return this._http.put('/task-categories/' + id, item).pipe(
              map(res => {
                this._utilityService.showSuccessMessage('Success!', 'project_task_category_updated');
                this.getItems(false,null,true).subscribe();
                return res;
              })
            );
          }

          saveItem(item) {
            return this._http.post('/task-categories', item).pipe(
              map((res:any )=> {
                TaskCategoryMasterStore.setLastInsertedId(res.id);
                this._utilityService.showSuccessMessage('Success!', 'project_task_category_added');
               if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
                else this.getItems(false,null).subscribe();
                return res;
              })
            );
          }

          selectRequiredIssueCategory(issues){
   
            TaskCategoryMasterStore.addSelecteIssueCategory(issues);
          }
}
