import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';

import { AppStore } from 'src/app/stores/app.store';

import { MsTypeMasterStore } from "src/app/stores/masters/organization/ms-type-master.store";
import { MsTypeService } from "src/app/core/services/masters/organization/ms-type/ms-type.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

@Component({
  selector: 'app-ms-type-modal',
  templateUrl: './ms-type-modal.component.html',
  styleUrls: ['./ms-type-modal.component.scss']
})
export class MsTypeModalComponent implements OnInit {

  @Input ('source') MsTypeSource: any;
  msform: FormGroup;
  msformErrors: any;

  AppStore = AppStore;
  MsTypeMasterStore = MsTypeMasterStore;

  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _msService: MsTypeService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    // Form Object to Add Ms type
    this.msform = this._formBuilder.group({
      id: [''],
      code:['',[Validators.required, Validators.maxLength(45)]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.maxLength(255)]]
    });

    this.resetForm();

    // If Edit - Set Values
    if(this.MsTypeSource.hasOwnProperty('values') && this.MsTypeSource.values){
      this.msform.setValue({
        id: this.MsTypeSource.values.id,
        code: this.MsTypeSource.values.title,
        title: this.MsTypeSource.values.title,
        description: this.MsTypeSource.values.description
      });
    }
  }

  // Save Ms Type
  savemsform(close:boolean=false){ 
    this.msformErrors = null;
    //console.log(this.form.value);
    if (this.msform.valid) {
      let save;
      AppStore.enableLoading();
      // save = this._msService.saveItem(this.msform.value,true);
      if (this.msform.value.id) {
        save = this._msService.updateItem(this.msform.value.id, this.msform.value);
      } else {
        save = this._msService.saveItem(this.msform.value,true);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        setTimeout(() => {
          if(!this.msform.value.id)
            this.resetForm();
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closemsFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.msformErrors = err.error.errors;}
         
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.closemsFormModal();

    }

  }

  resetForm(){
    this.msform.reset();
    this.msform.pristine;
    this.msformErrors = null;
    AppStore.disableLoading();
  }

  closemsFormModal(){
    this.resetForm();
    this._eventEmitterService.dismissMsTypeModal();
  }

}
