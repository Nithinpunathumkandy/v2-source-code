import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserJob, UserJobPaginationResponse,IndividualJob } from '../../../../models/human-capital/users/user-job';
import { map } from 'rxjs/operators';
import { UserJobStore } from 'src/app/stores/human-capital/users/user-job.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Injectable({
  providedIn: 'root'
})
export class UserJobService {
  itemChange: EventEmitter<number> = new EventEmitter();
  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,) { }

    getItems(getAll: boolean = false,jobId?:number): Observable<UserJobPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `&page=${UserJobStore.currentPage}`;
       }
      return this._http.get<UserJobPaginationResponse>('/users/'+UsersStore.user_id+'/jds?status=all' + (params ? params : '')).pipe(
        map((res: UserJobPaginationResponse) => {
          if(res['data'].length>0){
            res['data'].forEach((element,index)=> {
              element['is_accordion_active']=false;
           
            if(jobId && element.id == jobId){
              this.getItem(jobId).subscribe();
              element['is_accordion_active'] = true;
              
            }
          });
          }
         
          UserJobStore.setUserJobDetails(res);
          return res;
        })
      );
    }

    getUsedJds(){
      return this._http.get('/users/'+UsersStore.user_id+'/jds/used-jds').pipe(
        map((res) => {
          UserJobStore.setUsedJds(res)
          return res;
        })
      );
    }

  

  getItem(id: number): Observable<IndividualJob> {
    return this._http.get<IndividualJob>('/users/'+UsersStore.user_id+'/jds/' + id).pipe(
      map((res: IndividualJob) => {
        res['is_accordion_active'] = true;
         //UserJobStore.updateUserJob(res);
         UserJobStore.setIndividualJobDetails(res);
        return res;
      })
    );
  }

  updateItem(id, item: UserJob): Observable<any> {
    return this._http.put('/users/'+UsersStore.user_id+'/jds/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        this.getItems(false,res['id']).subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/users/'+UsersStore.user_id+'/jds', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','create_success');
        this.getItems(false,res['id']).subscribe();
        return res;
      })
    );
  }

  delete(id: number,position:number) {
    return this._http.delete('/users/'+UsersStore.user_id+'/jds/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
        
        
        this.getItems(false).subscribe(res=>{
          this.setSelected(position);
        });

        return res;
      })
    );
  }
 
  setSelectedDocumentDetails(imageDetails,type){
    UserJobStore.setSelectedDocumentDetails(imageDetails);
  }

 
  setDocumentDetails(imageDetails,url,type){
    UserJobStore.setDocumentDetails(imageDetails,url,type);
  }

  setaccordion(index,value){
        UserJobStore.userJobDetails[index]['is_accordion_active']=value;
        if(value==true){
          for(let i=0;i<UserJobStore.userJobDetails.length;i++){
            if(i!=index){
              UserJobStore.userJobDetails[index]['is_accordion_active']=false;
            }
          }
        }
  }


  activate(id: number) {
    return this._http.put('/users/' + UsersStore.user_id + '/jds/'+id+'/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,id).subscribe();
        
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/users/' + UsersStore.user_id + '/jds/'+id+'/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','deactivate_success');
        this.getItems(false,id).subscribe();
        return res;
      })
    );
  }

  setSelected(position:number){
    var items:UserJob[] = UserJobStore.userJobDetails;
    if(items.length > 0){
      if(position > items.length -1){
        UserJobStore.userJobDetails[position-1].is_accordion_active = true;
        this.getItem(UserJobStore.userJobDetails[position-1].id).subscribe();
      }
      else{
        UserJobStore.userJobDetails[position].is_accordion_active = true;
        this.getItem(UserJobStore.userJobDetails[position].id).subscribe();
      }
    }
  }

  makeSelectedEmpty(){
    UserJobStore.setSelected(null);
  }

 
}
