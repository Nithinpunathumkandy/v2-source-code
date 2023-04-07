import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentNotesService } from 'src/app/core/services/knowledge-hub/documents/document-notes.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';



@Component({
  selector: 'app-add-notes-component',
  templateUrl: './add-notes-component.component.html',
  styleUrls: ['./add-notes-component.component.scss']
})
export class AddNotesComponentComponent implements OnInit {

  @Input('source') NotesParams: any;
  notesForm: FormGroup;
  formErrors: any;
  duplicateData: any;

  AppStore = AppStore;
  notesAdd: boolean = true;
  dataArray:any=[]

  sortedNotes = [];

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _documentNoteService: DocumentNotesService,
  ) { }

 
  ngOnInit(): void {

    AppStore.disableLoading();
    this.notesForm = this._formBuilder.group({

      id:[""],
      content_id: [''],
      notes:['']
      
    })

    if (this.NotesParams && this.NotesParams.id) {
      this.notesAdd = false;
      this.setDataforEdit()
    }
  

  }

  setDataforEdit() {
    
    let data = this.NotesParams
        this.notesForm.setValue({
        id: data.id,
        content_id: data.content_id,
        notes:data.notes
      })  
    
    this._utilityService.detectChanges(this._cdr)

  }

  validationCheck(){

    // IF if its Notes Add from and data Array is empty then disable save Button

    if(this.notesAdd) {
      if(this.dataArray.length==0)
      return true;
      else
      return false;
    }else{
          // If its edit form and there is no value in input then disable save Button
    
      if(!this.notesForm.value.notes)
      return true;
      else
      return false;
    }

  }

  addNotes() {
    this.formErrors = null;
    
    //Check For Data and push - to remove empty string 
    if (this.notesForm.value.notes) {
      this.dataArray.push(this.notesForm.value.notes)
    }
    // Checking For Duplicates and Set Error Flag
    this.dataArray.forEach(notes => {
      
      if (this.sortedNotes.indexOf(notes) == -1) {
        this.duplicateData=false
        this.sortedNotes.push(notes)
      } else {
          this.duplicateData=true
      }

    })
    this.notesForm.controls['notes'].reset()

  }

    // Removing Notes by Position
    removeNotes(position){
      this.sortedNotes.splice(position, 1);
      this.dataArray.splice(position, 1);
    }
  
    save(close: boolean = false) {

      if (this.notesForm.value) {
        let save;
        AppStore.enableLoading();    
        if (this.notesForm.value.id) {
         save = this._documentNoteService.updateItem(this.notesForm.value.id, this.setFormData('Update'))                
        } else {
          save=this._documentNoteService.saveItem(this.setFormData('Save'))               
        }
        save.subscribe(
          (res: any) => {
            this.resetForm();
            AppStore.disableLoading();
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            if (close) this.closeFormModal();
          },
          (err: HttpErrorResponse) => {
            AppStore.disableLoading();
            if (err.status == 422) {
              this.formErrors = err.error.errors;
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
  setFormData(type) {
    
    // Type To check if its save or update.

    var data:any={}
    
    
    if (type == 'Update') {

      data.title = this.notesForm.value.notes
      data.content_id = this.NotesParams.content_id
      data.document_version_id = DocumentsStore.documentVersionId
      return data
    }
    
    else {
      
      data.notes = this.sortedNotes
      data.content_id = this.NotesParams.content_id
      data.document_version_id = DocumentsStore.documentVersionId
      return data

    }
    }
    cancel() {
      this.closeFormModal();
    }
  
    closeFormModal() {
      AppStore.disableLoading();
      this.resetForm();
      this._eventEmitterService.dismissCommonModal('notes')
    }
  
  resetForm() {
    this.sortedNotes = [];
    this.notesForm.reset();
    this.notesForm.pristine;
    this.formErrors = null;
    this.duplicateData = null;
    }
}
