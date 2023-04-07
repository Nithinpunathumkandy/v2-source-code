import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';

import { AppStore } from 'src/app/stores/app.store';

import { MsTypeVersionService } from "src/app/core/services/masters/organization/ms-type-version/ms-type-version.service";
import { MsTypeService } from "src/app/core/services/masters/organization/ms-type/ms-type.service";
import { MsTypeMasterStore } from "src/app/stores/masters/organization/ms-type-master.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";

@Component({
  selector: 'app-ms-type-version-modal',
  templateUrl: './ms-type-version-modal.component.html',
  styleUrls: ['./ms-type-version-modal.component.scss']
})
export class MsTypeVersionModalComponent implements OnInit {

  @Input ('source') MsTypeModalSource: any;
  msversionform: FormGroup;
  msversionformErrors: any;

  AppStore = AppStore;
  MsTypeMasterStore = MsTypeMasterStore;

  constructor(private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _msService: MsTypeService,
    private _msVersionService: MsTypeVersionService, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    this.getmsTypes();

    this.msversionform = this._formBuilder.group({
      id: [''],
      ms_type_id: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });

    this.resetForm();

    if(this.MsTypeModalSource.hasOwnProperty('msType') && this.MsTypeModalSource.msType){
      let ev = { term: this.MsTypeModalSource.msType };
      this.searchMsType(ev);
      this.msversionform.patchValue({ms_type_id: this.MsTypeModalSource.msType});
    }
    
    if(this.MsTypeModalSource.hasOwnProperty('values') && this.MsTypeModalSource.values){
      let ev = { term: this.MsTypeModalSource.values.ms_type_id };
      this.searchMsType(ev);
      this.msversionform.setValue({
        id: this.MsTypeModalSource.values.id,
        ms_type_id: this.MsTypeModalSource.values.ms_type_id,
        title: this.MsTypeModalSource.values.title
      });
    }
  }

  // Get Ms Types
  getmsTypes(){
    this._msService.getItems().subscribe();
  }

  // Save Ms Type Version
  saveMsVersion(close:boolean=false){
    this.msversionformErrors = null;
    if (this.msversionform.valid) {
      let save;
      AppStore.enableLoading();
      if (this.msversionform.value.id) {
        save = this._msVersionService.updateItem(this.msversionform.value.id, this.msversionform.value);
      } else {
        save = this._msVersionService.saveItem(this.msversionform.value,true);
      }
      save.subscribe((res: any) => {
        AppStore.disableLoading();
        setTimeout(() => {
          if(!this.msversionform.value.id)
            this.resetForm('specified');
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeMsVersionModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.msversionformErrors = err.error.errors;}
         
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  // Search All Ms Types
  searchMsType(event){
    this._msService.getItems(false,'&q='+event.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  closeMsVersionModal(){
    this._eventEmitterService.dismissMsTypeVersionModal(this.msversionform.value.ms_type_id);
    this.resetForm();
  }

  cancelMsVersionModal(){
    this._eventEmitterService.dismissMsTypeVersionModal(this.msversionform.value.ms_type_id);
    this.resetForm();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.cancelMsVersionModal();

    }

  }

  resetForm(type?:string){
    if(type){
      this.msversionform.patchValue({
        id: null,
        title: '',
        description: ''
      })
    }
    else{
      this.msversionform.reset();
      this.msversionform.pristine;
      this.msversionformErrors = null;
      AppStore.disableLoading();
    }
  }

}
