import { Injectable } from '@angular/core';
import {DocumentContentDetails} from 'src/app/core/models/knowledge-hub/documents/documentContent'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { RequestContent, RequestContentDetails } from 'src/app/core/models/knowledge-hub/change-request/changreRequestContent';
@Injectable({
  providedIn: 'root'
})
export class ChangeRequestContentService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }


  getAllItems(contentId?: number): Observable<RequestContentDetails[]> {
    return this._http.get<RequestContentDetails[]>('/document-change-requests/' + `${changeRequestStore.documentId}` + `/contents`).pipe(map((res: RequestContentDetails[]) => {
      res.forEach((element, index) => {
        element['is_accordion_active'] = false;
        if (contentId && element.id == contentId) {
        this.getItemById(contentId).subscribe();
        element['is_accordion_active'] = true;
      }
      });
      ContentStore.setContentList(res)
      return res
    }))
  }

  getItemById(id: number):Observable<DocumentContentDetails[]> {
    return this._http.get<DocumentContentDetails[]>('/document-change-requests/' + `${changeRequestStore.documentId}` + `/contents/` + id).pipe(map((res: DocumentContentDetails[]) => {
      ContentStore.setContentIndividualList(res)
      return res
    }))
  }

  saveItem(requestContent: RequestContent) {

    return this._http.post('/document-change-requests/'+`${changeRequestStore.documentId}`+`/contents`,requestContent).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'change_request_content_created');
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))

  }

  
  delete(id: number) {
    return this._http.delete('/document-change-requests/' + `${changeRequestStore.documentId}` + `/contents/` + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "change_request_content_deleted"
        );
        this.getAllItems(ContentStore.ParentId).subscribe();
        return res;
      })
    );
  }

  updateItem(id, request: RequestContent): Observable<any>{
    return this._http.put('/document-change-requests/'+`${changeRequestStore.documentId}`+`/contents/`+id,request).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'change_request_content_updated');
      this.getAllItems(ContentStore.ParentId).subscribe()
      return res;
    }))
  }

  activatePCDA(id,type) {
    return this._http.put('/document-change-requests/' + `${changeRequestStore.documentId}` + '/contents/' + id + `/activate/pdca?type=${type}`, null).pipe(map(res => {
      this._utilityService.showSuccessMessage('Success!', `${type} has been activated`);
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }
  deactivatePCDA(id,type) {
    return this._http.put('/document-change-requests/' + `${changeRequestStore.documentId}` + '/contents/' + id + `/deactivate/pdca?type=${type}`, null).pipe(map(res => {
      this._utilityService.showSuccessMessage('Success!', `${type} has been deactivated`);
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }

}
