import { Component, OnInit } from '@angular/core';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';

@Component({
  selector: 'app-document-folder-details',
  templateUrl: './document-folder-details.component.html',
  styleUrls: ['./document-folder-details.component.scss']
})
export class DocumentFolderDetailsComponent implements OnInit {

  DocumentsStore = DocumentsStore
  
  constructor(
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
  }

  getArrayFormatedString(items){
    return this._helperService.getArraySeperatedString(',','title',items);
  }

  //*  Set User Preview Data
  assignUserValues(user) {
    if (user) {
      var userDetailObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userDetailObject.first_name = user?.first_name;
      userDetailObject.last_name = user?.last_name;
      userDetailObject.designation = user?.designation ? user?.designation : '';
      userDetailObject.image_token = user.image ? user.image?.token : null;
      userDetailObject.email = user?.email;
      userDetailObject.mobile = user?.mobile;
      userDetailObject.id = user?.id;
      userDetailObject.status_id = user?.status?.id
      userDetailObject.department = user?.department ? user?.department : null
      
      return userDetailObject;
  
    }
  }

}
