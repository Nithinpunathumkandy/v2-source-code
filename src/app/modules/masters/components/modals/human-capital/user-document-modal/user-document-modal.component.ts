import { Component, OnInit,ChangeDetectorRef } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserDocumentTypeService } from 'src/app/core/services/masters/human-capital/user-document-type/user-document-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';

import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";


@Component({
  selector: 'app-user-document-modal',
  templateUrl: './user-document-modal.component.html',
  styleUrls: ['./user-document-modal.component.scss']
})
export class UserDocumentModalComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;

  constructor(private _userDocumentTypeService:UserDocumentTypeService,private _utilityService: UtilityService,
    private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

 

  ngOnInit() {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });
  
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._userDocumentTypeService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._userDocumentTypeService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
        }
      });
    }
  }

  closeFormModal(){
    this._eventEmitterService.dismissUserDocumentModal();
  }

  cancel(){
    this.closeFormModal();
  }

}
