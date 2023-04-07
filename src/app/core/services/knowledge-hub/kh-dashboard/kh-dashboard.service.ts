import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { KhDashboardStore } from 'src/app/stores/knowledge-hub/kh-dashboard/kh-dashboard-store'
import { DashboardCount, DocumentByStatuses, DocumentByTypes, DocumentByDepartments, DocumentCRByStatuses , DocumentByPriority } from 'src/app/core/models/knowledge-hub/dashboard/kh-dashboard'

@Injectable({
  providedIn: 'root'
})
export class KhDashboardService {

  constructor(
    private _http: HttpClient
  ) { }

  getDocumentCounts() {
    return this._http.get<DashboardCount>("/dashboard/document-counts").pipe(map((res: DashboardCount) => {
      KhDashboardStore.setDashboardCount(res)
      return res
    }))
  }

  getDocumentByStatuses() {
    return this._http.get<DocumentByStatuses>("/dashboard/document-by-statuses").pipe(map((res) => {
      KhDashboardStore.setDocumentByStatuses(res)
      return res
    }))
  }

  getDocumentByTypes() {
    return this._http.get<DocumentByTypes>("/dashboard/document-by-types").pipe(map((res) => {
      KhDashboardStore.setDocumentByTypes(res)
      return res
    }))
  }

  getDocumentByDepartments() {
    return this._http.get<DocumentByDepartments>("/dashboard/document-by-departments").pipe(map((res) => {
      KhDashboardStore.setDocumentByDepartment(res)
      return res
    }))
  }

  getDocumentByCRStatuses() {
    return this._http.get<DocumentCRByStatuses[]>("/dashboard/document-change-request-by-statuses").pipe(map((res) => {
      KhDashboardStore.setDocumentCRByStatuses(res)
      return res
    }))
  }

  getDocumentByPriority(){
    return this._http.get<DocumentByPriority[]>("/dashboard/document-change-request-by-statuses").pipe(map((res)=>{
      //KhDashboardStore.setDocumentByPriority(res)
      return res
    }))    
  }

}
