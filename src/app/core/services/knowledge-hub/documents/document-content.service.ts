import { Injectable } from '@angular/core';
import {DocumentContentDetails, DocumentContent} from 'src/app/core/models/knowledge-hub/documents/documentContent'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { DocumentContentStore } from 'src/app/stores/knowledge-hub/documents/documentContent.store';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';

@Injectable({
  providedIn: 'root'
})
export class DocumentContentService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }


  getAllItems(contentId?: number): Observable<DocumentContentDetails[]> {
    return this._http.get<DocumentContentDetails[]>('/document-versions/' + `${DocumentsStore.documentVersionId}` + `/contents`).pipe(map((res: any[]) => {
      res.forEach((element, index) => {
        element['is_accordion_active'] = false;

        // element.children_content['is_accordion_active']=false;
        element.children_content.forEach((el,i)=>{
          el['is_accordion_active'] = false;
        })
        // element.children_content.forEach(innterItem=>{
        //   innterItem['is_accordion_active'] = false;
        // }) 
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
    return this._http.get<DocumentContentDetails[]>('/document-versions/' + `${DocumentsStore.documentVersionId}` + `/contents/` + id).pipe(map((res: DocumentContentDetails[]) => {
      ContentStore.setContentIndividualList(res)
      return res
    }))
  }

  saveItem(documentContent: DocumentContent) {
    return this._http.post('/document-versions/'+`${DocumentsStore.documentVersionId}`+`/contents`,documentContent).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'kh_content_created');
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))

  }

  
  delete(id: number) {
    return this._http.delete('/document-versions/' + `${DocumentsStore.documentVersionId}` + `/contents/` + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "document_content_deleted"
        );
        this.getAllItems(ContentStore.ParentId).subscribe();
        return res;
      })
    );
  }

  updateItem(id, document: DocumentContent): Observable<any>{
    return this._http.put('/document-versions/'+`${DocumentsStore.documentVersionId}`+`/contents/`+id,document).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'document_content_updated');
      this.getAllItems(ContentStore.ParentId).subscribe()
      return res;
    }))
  }

  activatePCDA(id,type) {
    return this._http.put('/document-versions/' + `${DocumentsStore.documentVersionId}` + '/contents/' + id + `/activate/pdca?type=${type}`, null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `${type} has been activated`);
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }
  deactivatePCDA(id,type) {
    return this._http.put('/document-versions/' + `${DocumentsStore.documentVersionId}` + '/contents/' + id + `/deactivate/pdca?type=${type}`, null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `${type} has been deactivated`);
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }

}
