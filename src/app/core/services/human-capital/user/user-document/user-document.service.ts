import { Injectable,EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserDocument } from "src/app/core/models/human-capital/users/user-document";
import { UserDocumentStore } from 'src/app/stores/human-capital/users/user-document.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';



@Injectable({
  providedIn: 'root'
})
export class UserDocumentService {
  itemChange: EventEmitter<number> = new EventEmitter();

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  // getItems(getAll: boolean = false): Observable<UserDocumentPaginationResponse> {
  //   let params = '';
  //   if (!getAll) {
  //     params = `?page=${UserDocumentStore.currentPage}`;
  //     }

  //   return this._http.get<UserDocumentPaginationResponse>('/users/'+UsersStore.user_id+'/documents' + (params ? params : '')).pipe(
  //     map((res: UserDocumentPaginationResponse) => {
  //       UserDocumentStore.setUserDocumentDetails(res);
  //       return res;
  //     })
  //   );
  // }

  getAllItems(): Observable<UserDocument[]>{
    return this._http.get<UserDocument[]>('/users/'+UsersStore.user_id+'/documents?by_user_document_type_id=true').pipe(
      // ?by_user_document_type_id=true
      map((res: UserDocument[]) => {
        if(res.length>0){
          res.forEach((element,index)=> {
            element['is_accordion_active']=false;
         
          // if(docId && element.id == docId){
          //   this.getItemById(docId).subscribe();
          //   element['is_accordion_active'] = true;
            
          // }
        });
        }
        
        UserDocumentStore.setUserDocumentDetails(res);
        return res;
      })
    );
  }

  getItemById(id: number): Observable<UserDocument> {
    return this._http.get<UserDocument>('/users/'+UsersStore.user_id+'/documents/' + id).pipe(
      map((res: UserDocument) => {
        res['is_accordion_active'] = true;
        UserDocumentStore.setIndividualDocumentDetails(res);
        return res;
      })
    );
  }

  updateItem(id:number, item: UserDocument): Observable<any> {
    return this._http.put('/users/'+UsersStore.user_id+'/documents/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','update_success');
        
        // this.getAllItems().subscribe();
        return res;
      })
    );
  }

  renewItem(id:number, item: UserDocument): Observable<any> {
    return this._http.put('/users/'+UsersStore.user_id+'/documents/' + id+'/renew', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'renewed_success');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/users/'+UsersStore.user_id+'/documents', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        
        return res;
      })
    );
  }

  delete(id: number,gPosition,position) {
    return this._http.delete('/users/'+UsersStore.user_id+'/documents/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','delete_success');
         
         
        //this.setSelected(position,true,true);
        return res;
      })
    );
  }

  setSelected(gPosition,position:number){
    // console.log("hai");
    var items:UserDocument[] = UserDocumentStore.userDocumentDetails;
    if(items.length > 0){
      if(position == 0 && gPosition > items.length -1){
        UserDocumentStore.userDocumentDetails[gPosition-1].is_accordion_active = true;
        // this.getItemById(UserDocumentStore.userDocumentDetails[position-1].id).subscribe();
      }
      else if(position == 0 && gPosition < items.length -1){
        UserDocumentStore.userDocumentDetails[gPosition].is_accordion_active = true;
        // this.getItemById(UserDocumentStore.userDocumentDetails[position].id).subscribe();
      }
      // if (position == 0 && && gPosition!=0){
      //   UserDocumentStore.userDocumentDetails[gPosition - 1].is_accordion_active = true;
      //   // this._utilityService.detectChanges(this._cdr);
      // } 
    }

   
    // else if (gPosition == 0 && UserDocumentStore.userDocumentDetails.length > 0){
    //   UserDocumentStore.userDocumentDetails[0].is_accordion_active = true;
    //   // this._utilityService.detectChanges(this._cdr);
    // } 

  }

  // downloadDocumentZip(id,filename){
  //   this._http.get('/users/'+ UsersStore.user_id +'/documents/'+id+'/download', { responseType: 'blob' as 'json' }).subscribe(
  //     (response: any) => {
  //       this._utilityService.downloadFile(response, filename);
  //     }
  //   )
  // }

  setImageDetails(imageDetails,url,type){
    UserDocumentStore.setDocumentImageDetails(imageDetails,url,type);
  }

  getImageDetails(type){
    return UserDocumentStore.getDocumentImageDetailsByType();
  }

  setSelectedImageDetails(imageDetails,type){
    UserDocumentStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return UserDocumentStore.getDocumentDetails;
  }
}
