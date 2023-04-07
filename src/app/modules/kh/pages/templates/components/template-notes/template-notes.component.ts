import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';

import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store';

import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
//import { ChangeRequestNoteService } from 'src/app/core/services/knowledge-hub/change-request/change-request-note.service';

import {TemplateNotesService} from 'src/app/core/services/knowledge-hub/templates/template-notes.service'

@Component({
  selector: 'app-template-notes',
  templateUrl: './template-notes.component.html',
  styleUrls: ['./template-notes.component.scss']
})
export class TemplateNotesComponent implements OnInit {

  @Input('source') NotesParams: any;
  notesForm: FormGroup;
  formErrors: any;
  duplicateData: any;

  AppStore = AppStore;
  TemplateStore = TemplateStore;
  changeRequestStore = changeRequestStore
  notesAdd: boolean = true;
  dataArray: any = []

  sortedNotes = [];

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _templateNoteService: TemplateNotesService,
    //private _changeRequestNoteService: ChangeRequestNoteService
  ) { }

  ngOnInit(): void {
    AppStore.disableLoading();
    this.notesForm = this._formBuilder.group({
      id: [""],
      content_id: [''],
      notes: ['']
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
      notes: data.notes
    })
    this._utilityService.detectChanges(this._cdr)
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
        this.duplicateData = false
        this.sortedNotes.push(notes)
      } else {
        this.duplicateData = true
      }
    })
    this.notesForm.controls['notes'].reset()
  }

  // Removing Notes by Position
  removeNotes(position) {
    this.sortedNotes.splice(position, 1);
    this.dataArray.splice(position, 1);
  }

  save(close: boolean = false) {
    if (this.notesForm.value) {
      let save;
      AppStore.enableLoading();
      if (this.notesForm.value.id) {
        save = this._templateNoteService.updateItem(this.notesForm.value.id, this.setFormData('Update', this.NotesParams.type));
      } else {
        save = this._templateNoteService.saveItem(this.setFormData('Save',this.NotesParams.type));
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
            // setTimeout(() => {
            //   this.formErrors = null;
            //   this._utilityService.detectChanges(this._cdr);
            // }, 800);
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
  setFormData(type, modalType?) {
    // ModelType Determines if its Document or Template
    // Type To check if its save or update.
    var data: any = {}
    if (type == 'Update') {
      data.title = this.notesForm.value.notes
      data.content_id = this.NotesParams.contentId
      data.document_template_id = TemplateStore.templateId
      return data
    }
    else {
      data.notes = this.sortedNotes
      data.content_id = this.NotesParams.contentId
      data.document_template_id = TemplateStore.templateId
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
