import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualDocument, ProfileDocuments } from 'src/app/core/models/my-profile/profile/profile-documents';
import { ProfileDocumentsStore } from 'src/app/stores/my-profile/profile/profile-documents-store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';

@Injectable({
  providedIn: 'root'
})
export class ProfileDocumentsService {

  constructor(private _http:HttpClient) { }

  // getItems():Observable<ProfileDocuments[]>{
  //   return this._http.get<ProfileDocuments[]>('/users/me/documents').pipe(
  //     map((res : ProfileDocuments[] ) => {
  //       ProfileDocumentsStore.setProfileDocuments(res);
  //       return res;
  //     })
  //   );
  // }

  getItems(): Observable<ProfileDocuments[]>{ 
    return this._http.get<ProfileDocuments[]>('/users/me/documents?by_user_document_type_id=true').pipe(
      map((res : ProfileDocuments[] ) => {
        ProfileDocumentsStore.setProfileDocuments(res);
        return res;
      })
    );
  }

  getItemById(id: number): Observable<IndividualDocument> {
    return this._http.get<IndividualDocument>('/users/me/documents/' + id).pipe(
      map((res: IndividualDocument) => {
        ProfileDocumentsStore.setIndividualDocumentDetails(res);
        return res;
      })
    );
  }
}
