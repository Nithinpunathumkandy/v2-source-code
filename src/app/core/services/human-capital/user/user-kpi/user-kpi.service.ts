import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserKpi, UserKpiPaginationResponse,Process } from '../../../../models/human-capital/users/user-kpi';
import { map } from 'rxjs/operators';
import { UserKpiStore } from 'src/app/stores/human-capital/users/user-kpi.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Injectable({
  providedIn: 'root'
})
export class UserKpiService {
  itemChange: EventEmitter<number> = new EventEmitter();
  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,) { }

  getItems(getAll: boolean = false,kpiId?:number): Observable<UserKpiPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${UserKpiStore.currentPage}`;
     }

    return this._http.get<UserKpiPaginationResponse>('/users/'+UsersStore.user_id+'/kpis' + (params ? params : '')).pipe(
      map((res: UserKpiPaginationResponse) => {
        res['data'].forEach((element,index)=> {
          element['is_accordion_active']=false;
       
        if(kpiId && element.id == kpiId){
          this.getItem(kpiId).subscribe(res=>{
            
          });
          element['is_accordion_active'] = true;
        }
      });
        UserKpiStore.setUserKpiDetails(res);
        return res;
      })
    );
  }

  

  getItem(id: number): Observable<UserKpi> {
    return this._http.get<UserKpi>('/users/'+UsersStore.user_id+'/kpis/' + id).pipe(
      map((res: UserKpi) => {
        res['is_accordion_active'] = true;
        UserKpiStore.updateUserKpi(res);
        UserKpiStore.setIndividualKpiDetails(res);
        return res;
      })
    );
  }

  updateItem(id, item: UserKpi): Observable<any> {
    return this._http.put('/users/'+UsersStore.user_id+'/kpis/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,res['id']).subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/users/'+UsersStore.user_id+'/kpis', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getItems(false,res['id']).subscribe();
        return res;
      })
    );
  }

  delete(id: number,position:number) {
    return this._http.delete('/users/'+UsersStore.user_id+'/kpis/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        
        this.getItems(false).subscribe(res=>{
          this.setSelected(position);
        });
        return res;
      })
    );
  }

  setSelected(position:number){
    var items:UserKpi[] = UserKpiStore.userKpiDetails;
    if(items.length > 0){
      if(position > items.length -1){
        UserKpiStore.userKpiDetails[position-1].is_accordion_active = true;
        this.getItem(UserKpiStore.userKpiDetails[position-1].id).subscribe();
      }
      else{
        UserKpiStore.userKpiDetails[position].is_accordion_active = true;
        this.getItem(UserKpiStore.userKpiDetails[position].id).subscribe();
      }
    }
  }


  makeSelectedEmpty(){
    UserKpiStore.setSelected(null);
  }

  

 
  setSelectedDocumentDetails(imageDetails,type){
    UserKpiStore.setSelectedDocumentDetails(imageDetails);
  }

 
  setDocumentDetails(imageDetails,url,type){
    UserKpiStore.setDocumentDetails(imageDetails,url,type);
  }

  setaccordion(index,value){
        UserKpiStore.userKpiDetails[index]['is_accordion_active']=value;
        if(value==true){
          for(let i=0;i<UserKpiStore.userKpiDetails.length;i++){
            if(i!=index){
              UserKpiStore.userKpiDetails[index]['is_accordion_active']=false;
            }
          }
        }
  }

  

  getProcess(params?:string): Observable<Process> {
    return this._http.get<Process>('/processes'+ (params ? params : '')).pipe(
      map((res: Process) => {
        UserKpiStore.setProcesses(res['data']);
        return res;
      })
    );
  }

  searchProcess(params){
    return this.getProcess(params ? params : '').pipe(
      map((res: Process) => {
        UserKpiStore.setProcesses(res['data']);
        return res;
      })
    );
  }




 
}
