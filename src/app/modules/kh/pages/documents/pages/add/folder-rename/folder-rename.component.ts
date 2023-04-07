import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-folder-rename',
  templateUrl: './folder-rename.component.html',
  styleUrls: ['./folder-rename.component.scss']
})
export class FolderRenameComponent implements OnInit {

  @Input('source') documentTitle

  renameForm: FormGroup;
  renameFormErros :any;
  displayForm: any = null;
  saveData: any = null;

  AppStore = AppStore;
  DocumentsStore = DocumentsStore;

   constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _documentsService: DocumentsService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {

    this.renameForm = this._formBuilder.group({
    
      title: ["", [Validators.required, Validators.maxLength(255)]],

    });

    if(this.documentTitle)
    this.renameForm.setValue({
      'title': this.documentTitle.title
    });


  }

  // *  Save Function

  save(close: boolean = false) {
    if (this.renameForm.value) {
      let save;
      this.displayForm=this.renameForm.value
      this.createFolderData()
      AppStore.enableLoading();
      save = this._documentsService.renameFolder(this.saveData);
      save.subscribe(
        (res: any) => {
          this.resetForm();
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal('save');
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.renameFormErros = err.error.errors;
          } else {
            this._utilityService.showErrorMessage(
              "Error!",
              "Something went wrong. Please try again."
            );
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
   }
  
  // * Crate Save Data
   createFolderData() {   
     this.saveData = {
       "title": this.displayForm.title ? this.displayForm.title : '',
       "document_id":DocumentsStore.documentId ? DocumentsStore.documentId : null,
    }
  }

    // * Reset Form
    resetForm() {
      this.renameForm.reset();
      this.renameForm.pristine;
      this.renameFormErros = null;
    }
  
    // * Cancel Form
    cancel() {
      this.closeFormModal('cancel');
    }
  
    // * Close Form
    closeFormModal(type) {
      this.resetForm();
      this._eventEmitterService.dismissFolderRenameModal(type)
    }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  
  ngOnDestroy() {
    this.resetForm();
    this.saveData = null;
    this.displayForm = null;
    }

}
