import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Notes } from 'src/app/core/models/knowledge-hub/documents/documentContent';
import { map } from 'rxjs/operators';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';
import { Observable } from 'rxjs';
import { ChangeRequestContentService } from './change-request-content.service';


@Injectable({
  providedIn: 'root'
})
export class ChangeRequestNoteService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _changeRequestService:ChangeRequestContentService
  ) { }


  saveItem(documentNotes: Notes) {
    return this._http.post('/document-change-request-notes',documentNotes).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'note_created!');
      this._changeRequestService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))

  }
  delete(id: number) {
    return this._http.delete('/document-change-request-notes/' +  id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "note_deleted"
        );
        this._changeRequestService.getAllItems(ContentStore.ParentId).subscribe();
        return res;
      })
    );
  }

  updateItem(id, Note: Notes): Observable<any>{
    return this._http.put('/document-change-request-notes/'+id,Note).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'note_updated');
      this._changeRequestService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }
}
