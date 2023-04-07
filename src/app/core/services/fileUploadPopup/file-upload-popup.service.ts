import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';

@Injectable({
  providedIn: 'root'
})
export class FileUploadPopupService {



  constructor(
    private _utilityService: UtilityService,
  ) { }


  setSystemFile(fileDetails, url) {
    if (fileUploadPopupStore.getSystemFile.find(i => i.token === fileDetails.token)) {
      this._utilityService.showErrorMessage('Failed!', 'File Already Added!');
    }
    else {
      fileUploadPopupStore.setSystemFile(fileDetails,url);
    }
  }

  setKHFile(fileDetails){
    fileUploadPopupStore.setKHFile(fileDetails);
  }

  submitDocuments(){
    // Joining System Files and KH Files to a single Array to show in the main page.

    // Removing deleted files from systemFile 
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...(fileUploadPopupStore.getSystemFile).filter(e=>!e.is_deleted)];
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    if(submitedDocuments.length > 0) this._utilityService.showSuccessMessage('success', 'added_success');
  }

}
