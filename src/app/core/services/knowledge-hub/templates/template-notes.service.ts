import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from "rxjs/operators";
import { Notes } from 'src/app/core/models/knowledge-hub/templates/templates'
import { TemplateContentService } from 'src/app/core/services/knowledge-hub/templates/template-content.service'
import {ContentStore} from 'src/app/stores/knowledge-hub/templates/templateContent.store'

@Injectable({
  providedIn: 'root'
})
export class TemplateNotesService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _templateContentService:TemplateContentService
  ) { }


  saveItem(templateNotes: Notes) {
    return this._http.post('/document-template-notes',templateNotes).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'template_content_created');
      this._templateContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))

  }
  delete(id: number) {
    return this._http.delete('/document-template-notes/' +  id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "note_deleted"
        );
        this._templateContentService.getAllItems(ContentStore.ParentId).subscribe();
        return res;
      })
    );
  }

  updateItem(id, Note: Notes): Observable<any>{
    return this._http.put('/document-template-notes/'+id,Note).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'note_updated');
      this._templateContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }

}
