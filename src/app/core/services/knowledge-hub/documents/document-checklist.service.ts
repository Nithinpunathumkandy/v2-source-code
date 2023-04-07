import { Injectable } from '@angular/core';
import { DocumentContentService } from './document-content.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpClient } from '@angular/common/http';
import { Checklists } from 'src/app/core/models/knowledge-hub/templates/templates';
import { map } from 'rxjs/operators';
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';

@Injectable({
  providedIn: 'root'
})
export class DocumentChecklistService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _documentContentService:DocumentContentService
  ) { }


  saveItem(checkList: Checklists) {
    return this._http.post('/document-version-checklists',checkList).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'checkList_created');
      this._documentContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))

  }


  delete(contentId: number, checkListid: number) {
    return this._http.delete('/document-versions/' + `${DocumentsStore.documentVersionId}` + `/contents/` + contentId + '/checklists/'+checkListid).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "checkList_deleted"
        );
        this._documentContentService.getAllItems(ContentStore.ParentId).subscribe();
        return res;
      })
    );
  }


  activateCheckList(id) {
    return this._http.put('/document-versions/' + `${DocumentsStore.documentVersionId}` + '/contents/' + id + '/activate/checklist', null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `checkList_activated`);
      this._documentContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }
  deactivateCheckList(id) {
    return this._http.put('/document-versions/' + `${DocumentsStore.documentVersionId}` + '/contents/' + id + '/deactivate/checklist', null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `checkList_deactivated`);
      this._documentContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }

  selectRequiredCheckList(checklist){
    var checklistToDisplay = [];
    for(let i of checklist){
      let obj = { id:i.id,title: i.title}
        checklistToDisplay.push(obj);
    }
    
 ContentStore.addSelectedChecklist(checklist,checklistToDisplay);

  }


}
