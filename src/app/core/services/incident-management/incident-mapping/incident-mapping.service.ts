import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Incident , IncidentMapping } from 'src/app/core/models/incident-management/incident/incident';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Injectable({
  providedIn: 'root'
})
export class IncidentMappingService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService) { }

    
  getIncidentIssueMaping(id){
    return this._http.get<IncidentMapping>('/incidents/'+id+'/mapping').pipe((
      map((res:IncidentMapping)=>{
        IncidentStore.setIncidentMappingItems(res);
        return res;
      })
    ))

  }

  saveIssueForMapping(saveData): Observable<any>{
   
    return this._http.post('/incidents/'+IncidentStore.selectedId+'/issue-mapping', saveData).pipe(
      map(res => {
        // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
        // this.getItems().subscribe();
        return res;
      })
    );
  
}

saveProcessForMapping(saveData): Observable<any>{
  return this._http.post('/incidents/'+IncidentStore.selectedId+'/process-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Process has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );
}

saveProjectForMapping(saveData): Observable<any>{
   
  return this._http.post('/incidents/'+IncidentStore.selectedId+'/project-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveCustomerForMapping(saveData): Observable<any>{
   
  return this._http.post('/incidents/'+IncidentStore.selectedId+'/customer-mapping', saveData).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Issue has been added!');
      // this.getItems().subscribe();
      return res;
    })
  );

}

saveControlsForMapping(saveData): Observable<any>{
  return this._http.post('/incidents/'+IncidentStore.selectedId +'/control-mapping', saveData).pipe(
    map(res => {
      return res;
    })
  );
}

saveObjectiveForMapping(saveData): Observable<any>{
  return this._http.post('/incidents/'+IncidentStore.selectedId +'/strategic-objective-mapping', saveData).pipe(
    map(res => {
      return res;
    })
  );
}

saveProductsForMapping(saveData): Observable<any>{
  return this._http.post('/incidents/'+IncidentStore.selectedId +'/product-mapping', saveData).pipe(
    map(res => {
      return res;
    })
  );
}

saveServicesForMapping(saveData): Observable<any>{
  return this._http.post('/incidents/'+IncidentStore.selectedId +'/service-mapping', saveData).pipe(
    map(res => {
      return res;
    })
  );
}

saveAssetForMapping(saveData): Observable<any>{
  return this._http.post('/incidents/'+IncidentStore.selectedId +'/asset-mapping', saveData).pipe(
    map(res => {
      return res;
    })
  );
}

deleteIssueMapping(id) {
  return this._http.put('/incidents/' + IncidentStore.selectedId +'/issue-mapping',id).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
      this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}
saveRiskMapping(saveData): Observable<any> {
  return this._http.post('/incidents/' + IncidentStore.selectedId + '/risk-mapping', saveData).pipe(
    map(res => {
      return res;
    })
  );

}
deleteProcessMapping(id) {
  
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/process-mapping',id).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
      this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}

deleteProjectMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/project-mapping',id).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
      this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}

deleteCustomerMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/customer-mapping',id).pipe(
    map(res => {
      // this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
      this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}

deleteControlMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/control-mapping',id).pipe(
    map(res => {
      this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}

deleteProductMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/product-mapping',id).pipe(
    map(res => {
      this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}

deleteObjectivetMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/strategic-objective-mapping',id).pipe(
    map(res => {
      this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}
deleteServicetMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/service-mapping',id).pipe(
    map(res => {
      // this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}
deleteAssetMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/asset-mapping',id).pipe(
    map(res => {
      // this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}

deleteRiskMapping(id) {
  return this._http.put('/incidents/' +IncidentStore.selectedId +'/risk-mapping',id).pipe(
    map(res => {
      this._utilityService.showSuccessMessage('Success!', 'Risk has been deleted!');
      // this.getIncidentIssueMaping(IncidentStore.selectedId).subscribe();
      return res;
    })
  );
}

}
