import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskCategory, TaskCategoryPaginationResponse } from 'src/app/core/models/masters/project-management/project-task-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TaskPrioritiesMasterStore } from 'src/app/stores/masters/project-management/task-priorities';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class TaskPrioritiesService {

        constructor(private _http: HttpClient,
          private _helperService: HelperServiceService,
          private _utilityService: UtilityService) { }

        getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TaskCategoryPaginationResponse> {
          let params = '';
          if (!getAll) {
            params = `?page=${TaskPrioritiesMasterStore.currentPage}`;
            if (TaskPrioritiesMasterStore.orderBy) params += `&order_by=${TaskPrioritiesMasterStore.orderItem}&order=${TaskPrioritiesMasterStore.orderBy}`;
          }
          if (TaskPrioritiesMasterStore.searchText) params += (params ? '&q=' : '?q=') + TaskPrioritiesMasterStore.searchText;
          if (additionalParams)
            params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
          if (status) params += (params ? '&' : '?') + 'status=all';
          return this._http.get<TaskCategoryPaginationResponse>('/task-priorities' + (params ? params : '')).pipe(
            map((res: TaskCategoryPaginationResponse) => {
              TaskPrioritiesMasterStore.setTaskPriorities(res);
              return res;
            })
          );
        }

        sortTaskCategryList(type:string) {
          if (!TaskPrioritiesMasterStore.orderBy) {
            TaskPrioritiesMasterStore.orderBy = 'asc';
            TaskPrioritiesMasterStore.orderItem = type;
          }
          else{
            if (TaskPrioritiesMasterStore.orderItem == type) {
              if(TaskPrioritiesMasterStore.orderBy == 'asc') TaskPrioritiesMasterStore.orderBy = 'desc';
              else TaskPrioritiesMasterStore.orderBy = 'asc'
            }
            else{
              TaskPrioritiesMasterStore.orderBy = 'asc';
              TaskPrioritiesMasterStore.orderItem = type;
            }
          }
        }

        getItemById(id): Observable<TaskCategory> {
          return this._http.get<TaskCategory>('/task-priorities/'+id).pipe((
            map((res:TaskCategory)=>{
              TaskPrioritiesMasterStore.setindividualTaskPriorities(res);
              return res;
            })
          ))
        }

        activate(id: number) {
          return this._http.put('/task-priorities/' + id + '/activate', null).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'task_priorities_activated');
              this.getItems(false,null,true).subscribe();
              return res;
            })
          );
        }

        deactivate(id: number) {
          return this._http.put('/task-priorities/' + id + '/deactivate', null).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'task_priorities_deactivated');
              this.getItems(false,null,true).subscribe();
              return res;
            })
          );
        }

        delete(id: number) {
          return this._http.delete('/task-priorities/' + id).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'task_priorities_deleted');
              this.getItems(false,null,true).subscribe(resp=>{
                if(resp.from==null){
                  TaskPrioritiesMasterStore.setCurrentPage(resp.current_page-1);
                  this.getItems(false,null,true).subscribe();
                }
              });
              return res;
            })
          );
        }

        generateTemplate() {
          this._http.get('/task-priorities/template', { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('task_priority_template') + ".xlsx");
            }
          )
        }

        exportToExcel() {
          this._http.get('/task-priorities/export', { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('task_priorities') + ".xlsx");
            }
          )}

          shareData(data){
            return this._http.post('/task-priorities/share',data).pipe(
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
            return this._http.post('/task-priorities/import',data).pipe(
              map((res:any )=> {
                this._utilityService.showSuccessMessage('success','task_priorities_imported');
                this.getItems(false,null,true).subscribe();
                return res;
              })
            )
          }

          updateItem(id, item): Observable<any> {
            return this._http.put('/task-priorities/' + id, item).pipe(
              map(res => {
                this._utilityService.showSuccessMessage('Success!', 'task_priorities_updated');
                this.getItems(false,null,true).subscribe();
                return res;
              })
            );
          }

          saveItem(item) {
            return this._http.post('/task-priorities', item).pipe(
              map((res:any )=> {
                TaskPrioritiesMasterStore.setLastInsertedId(res.id);
                this._utilityService.showSuccessMessage('Success!', 'task_priorities_added');
               if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
                else this.getItems(false,null).subscribe();
                return res;
              })
            );
          }

          selectRequiredIssueCategory(issues){
   
            TaskPrioritiesMasterStore.addSelecteIssueCategory(issues);
          }
}
