import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {Checklists} from 'src/app/core/models/knowledge-hub/templates/templates'
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store'
import { TemplateContentService } from 'src/app/core/services/knowledge-hub/templates/template-content.service'
import {ContentStore} from 'src/app/stores/knowledge-hub/templates/templateContent.store'

@Injectable({
  providedIn: 'root'
})
export class TemplateChecklistService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _templateContentService:TemplateContentService
  ) { }

  
  // getAllItems(): Observable<Checklists[]> {
    
  //   return this._http.get<Checklists[]>('/document-template-checklists').pipe(map((res: TemplateContentDetails[]) => {
  //     TemplateContentStore.setTemplateContentList(res)
  //     return res
  //   }))
  // }

  saveItem(checkList: Checklists) {
    return this._http.post('/document-template-checklists',checkList).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'checkList_created');
      this._templateContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))

  }


  delete(contentId: number, checkListid: number) {
    return this._http.delete('/document-templates/' + `${TemplateStore.templateId}` + `/contents/` + contentId + '/checklists/'+checkListid).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "checkList_deleted"
        );
        this._templateContentService.getAllItems(ContentStore.ParentId).subscribe();
        return res;
      })
    );
  }


  activateCheckList(id) {
    return this._http.put('/document-templates/' + `${TemplateStore.templateId}` + '/contents/' + id + '/activate/checklist', null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `checkList_activated`);
      this._templateContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }
  deactivateCheckList(id) {
    return this._http.put('/document-templates/' + `${TemplateStore.templateId}` + '/contents/' + id + '/deactivate/checklist', null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `checkList_deactivated`);
      this._templateContentService.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }


}
