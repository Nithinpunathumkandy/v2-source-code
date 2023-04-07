import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskWeightage, TaskWeightagePaginationResponse } from 'src/app/core/models/masters/project-management/project-task-weightage';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TaskWeightageMasterStore } from 'src/app/stores/masters/project-management/project-task-weightage-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectTaskWeightageService {

        constructor(private _http: HttpClient,
          private _helperService: HelperServiceService,
          private _utilityService: UtilityService) { }

        getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<TaskWeightagePaginationResponse> {
          let params = '';
          if (!getAll) {
            params = `?page=${TaskWeightageMasterStore.currentPage}`;
            if (TaskWeightageMasterStore.orderBy) params += `&order_by=${TaskWeightageMasterStore.orderItem}&order=${TaskWeightageMasterStore.orderBy}`;
          }
          if (TaskWeightageMasterStore.searchText) params += (params ? '&q=' : '?q=') + TaskWeightageMasterStore.searchText;
          if (additionalParams)
            params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
          if (status) params += (params ? '&' : '?') + 'status=all';
          return this._http.get<TaskWeightagePaginationResponse>('/task-weightages' + (params ? params : '')).pipe(
            map((res: TaskWeightagePaginationResponse) => {
              TaskWeightageMasterStore.setTaskWeightage(res);
              return res;
            })
          );
        }

        sortTaskCategryList(type:string) {
          if (!TaskWeightageMasterStore.orderBy) {
            TaskWeightageMasterStore.orderBy = 'asc';
            TaskWeightageMasterStore.orderItem = type;
          }
          else{
            if (TaskWeightageMasterStore.orderItem == type) {
              if(TaskWeightageMasterStore.orderBy == 'asc') TaskWeightageMasterStore.orderBy = 'desc';
              else TaskWeightageMasterStore.orderBy = 'asc'
            }
            else{
              TaskWeightageMasterStore.orderBy = 'asc';
              TaskWeightageMasterStore.orderItem = type;
            }
          }
        }

        getItemById(id): Observable<TaskWeightage> {
          return this._http.get<TaskWeightage>('/task-weightages/'+id).pipe((
            map((res:TaskWeightage)=>{
              TaskWeightageMasterStore.setIndividualTaskWeightage(res);
              return res;
            })
          ))
        }

        activate(id: number) {
          return this._http.put('/task-weightages/' + id + '/activate', null).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'project_task_weightage_activated');
              this.getItems(false,null,true).subscribe();
              return res;
            })
          );
        }

        deactivate(id: number) {
          return this._http.put('/task-weightages/' + id + '/deactivate', null).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'project_task_weightage_deactivated');
              this.getItems(false,null,true).subscribe();
              return res;
            })
          );
        }

        delete(id: number) {
          return this._http.delete('/task-weightages/' + id).pipe(
            map(res => {
              this._utilityService.showSuccessMessage('Success!', 'project_task_weightage_deleted');
              this.getItems(false,null,true).subscribe(resp=>{
                if(resp.from==null){
                  TaskWeightageMasterStore.setCurrentPage(resp.current_page-1);
                  this.getItems(false,null,true).subscribe();
                }
              });
              return res;
            })
          );
        }

        generateTemplate() {
          this._http.get('/task-weightages/template', { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_task_weightage_template') + ".xlsx");
            }
          )
        }

        exportToExcel() {
          this._http.get('/task-weightages/export', { responseType: 'blob' as 'json' }).subscribe(
            (response: any) => {
              this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('project_task_weightage') + ".xlsx");
            }
          )}

          shareData(data){
            return this._http.post('/task-weightages/share',data).pipe(
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
            return this._http.post('/task-weightages/import',data).pipe(
              map((res:any )=> {
                this._utilityService.showSuccessMessage('success','project_task_weightage_imported');
                this.getItems(false,null,true).subscribe();
                return res;
              })
            )
          }

          updateItem(id, item): Observable<any> {
            return this._http.put('/task-weightages/' + id, item).pipe(
              map(res => {
                this._utilityService.showSuccessMessage('Success!', 'project_task_weightage_updated');
                this.getItems(false,null,true).subscribe();
                return res;
              })
            );
          }

          saveItem(item) {
            return this._http.post('/task-weightages', item).pipe(
              map((res:any )=> {
                TaskWeightageMasterStore.setLastInsertedId(res.id);
                this._utilityService.showSuccessMessage('Success!', 'project_task_weightage_added');
               if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
                else this.getItems(false,null).subscribe();
                return res;
              })
            );
          }

          selectRequiredIssueCategory(issues){
   
            TaskWeightageMasterStore.addSelecteIssueCategory(issues);
          }
}
