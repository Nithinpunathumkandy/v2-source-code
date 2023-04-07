import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { UtilityService } from 'src/app/shared/services/utility.service';
import {TemplateContent,TemplateContentDetails} from 'src/app/core/models/knowledge-hub/templates/templateContent'
import { map } from "rxjs/operators";
import {TemplateStore} from 'src/app/stores/knowledge-hub/templates/templates.store'
import {ContentStore}from 'src/app/stores/knowledge-hub/templates/templateContent.store'

@Injectable({
  providedIn: 'root'
})
export class TemplateContentService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getAllItems(contentId?: number): Observable<TemplateContentDetails[]> {
    return this._http.get<TemplateContentDetails[]>('/document-templates/' + `${TemplateStore.templateId}` + `/contents`).pipe(map((res: TemplateContentDetails[]) => {
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

  saveItem(templateContent: TemplateContent) {
    return this._http.post('/document-templates/'+`${TemplateStore.templateId}`+`/contents`,templateContent).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'template_content_created');
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))

  }

  getItemById(id: number):Observable<TemplateContentDetails[]> {
    return this._http.get<TemplateContentDetails[]>('/document-templates/' + `${TemplateStore.templateId}` + `/contents/` + id).pipe(map((res: TemplateContentDetails[]) => {
      ContentStore.setContentIndividualList(res)
      return res
    }))
  }


  delete(id: number) {
    return this._http.delete('/document-templates/' + `${TemplateStore.templateId}` + `/contents/` + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "template_content_deleted"
        );
        this.getAllItems(ContentStore.ParentId).subscribe();
        return res;
      })
    );
  }

  updateItem(id, template: TemplateContent): Observable<any>{
    return this._http.put('/document-templates/'+`${TemplateStore.templateId}`+`/contents/`+id,template).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'template_content_updated');
      this.getAllItems(ContentStore.ParentId).subscribe()
      return res;
    }))
  }

  activatePCDA(id,type) {
    return this._http.put('/document-templates/' + `${TemplateStore.templateId}` + '/contents/' + id + `/activate/pdca?type=${type}`, null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `${type} has been activated`);
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }
  deactivatePCDA(id,type) {
    return this._http.put('/document-templates/' + `${TemplateStore.templateId}` + '/contents/' + id + `/deactivate/pdca?type=${type}`, null).pipe(map(res => {
      this._utilityService.showSuccessMessage('success', `${type} has been deactivated`);
      this.getAllItems(ContentStore.ParentId).subscribe();
      return res;
    }))
  }


}
