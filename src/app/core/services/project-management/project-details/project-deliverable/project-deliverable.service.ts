import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Deliverable, DeliverablePaginationResponse } from 'src/app/core/models/project-management/project-details/project-deliverable/project-deliverable';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DeliverableMasterStore } from 'src/app/stores/project-management/project-details/project-deliverable/project-deliverable-store';

import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
@Injectable({
  providedIn: 'root'
})
export class ProjectDeliverableService {



  constructor(private _http: HttpClient,

    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<DeliverablePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${DeliverableMasterStore.currentPage}`;
      if (DeliverableMasterStore.orderBy) params += `&order_by=task_categories.title&order=${DeliverableMasterStore.orderBy}`;
    }
    if (DeliverableMasterStore.searchText) params += (params ? '&q=' : '?q=') + DeliverableMasterStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<DeliverablePaginationResponse>('/projects/' + ProjectsStore.selectedProjectID + '/deliverables' + (params ? params : '')).pipe(
      map((res: DeliverablePaginationResponse) => {
        DeliverableMasterStore.setDeliverable(res);
        return res;
      })
    );
  }



  getItemById(id): Observable<Deliverable> {
    return this._http.get<Deliverable>('/projects/' + ProjectsStore.selectedProjectID + '/deliverables/' + id).pipe((
      map((res: Deliverable) => {
        DeliverableMasterStore.setIndividualDeliverable(res);
        return res;
      })
    ))
  }


  generateTemplate() {
    this._http.get('/projects/{projectId}//deliverables/{id}template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Deliverable.xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/projects/' + ProjectsStore.selectedProjectID + '/deliverables/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Deliverable.xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('projects/' + ProjectsStore.selectedProjectID + '/deliverables/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'The item has been shared');
        return res;
      })
    )
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/projects/' + ProjectsStore.selectedProjectID + '/deliverables/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'Deliverable has been updated!');
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/projects/' + ProjectsStore.selectedProjectID + '/deliverables', item).pipe(
      map((res: any) => {
        DeliverableMasterStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('Success!', 'Deliverable has been added!');

        return res;
      })
    );
  }


  delete(id: number) {
    return this._http.delete('/projects/' + ProjectsStore.selectedProjectID + '/deliverables/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'deliverable_deleted_successfully');
        this.getItems().subscribe(resp => {
          if (resp.from == null) {
            DeliverableMasterStore.setCurrentPage(resp.current_page - 1);
            this.getItems().subscribe();
          }
        });
        return res;
      })
    );
  }


  sortDeliverableList(type: string) {
    if (!DeliverableMasterStore.orderBy) {
      DeliverableMasterStore.orderBy = 'desc';
      DeliverableMasterStore.orderItem = type;
    }
    else {
      if (DeliverableMasterStore.orderItem == type) {
        if (DeliverableMasterStore.orderBy == 'desc') DeliverableMasterStore.orderBy = 'asc';
        else DeliverableMasterStore.orderBy = 'desc'
      }
      else {
        DeliverableMasterStore.orderBy = 'desc';
        DeliverableMasterStore.orderItem = type;
      }
    }
  }

  importData(data) {

    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/projects/{projectId}//deliverables/{id}import', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'deliverable_imported');
        return res;
      })
    )
  }



}
