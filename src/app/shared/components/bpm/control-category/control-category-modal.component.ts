import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { ControlCategoryMasterStore } from "src/app/stores/masters/bpm/control-category.master.store";
import { ControlCategoryService } from "src/app/core/services/masters/bpm/control-category/control-category.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-control-category-modal',
  templateUrl: './control-category-modal.component.html',
  styleUrls: ['./control-category-modal.component.scss']
})
export class ControlCategoryModalComponent implements OnInit {

  @Input ('source') ControlCategorySource:any;
  controlcategForm:FormGroup;
  controlcategFormErros:any;
  AppStore = AppStore;
  ControlCategoryMasterStore = ControlCategoryMasterStore;

  constructor(private _utilityService: UtilityService,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _controlCategService: ControlCategoryService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    // Form Object to add Control Category

    this.controlcategForm=this._formBuilder.group({
      id: [''],
      reference_code:[''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
    })

    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.ControlCategorySource) {
      if(this.ControlCategorySource.hasOwnProperty('values') && this.ControlCategorySource.values){

        let {id,title,reference_code}=this.ControlCategorySource.values
  
        this.controlcategForm.patchValue({
          id: id,
          title: title,
          reference_code:reference_code
        })
      }
    }



  }

  saveControlCateg(close:boolean=false){
    this.controlcategFormErros=null;
    if(this.controlcategForm.value){
      let save
      AppStore.enableLoading();

      if (this.controlcategForm.value.id) {
        save = this._controlCategService.updateItem(this.controlcategForm.value.id, this.controlcategForm.value);
      } else {
        // Deleting ID before POST
        delete this.controlcategForm.value.id
        save = this._controlCategService.saveItem(this.controlcategForm.value);
      }
      save.subscribe((res: any) => {
        if(!this.controlcategForm.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.controlcategFormErros = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  cancel(){
    this.closeFormModal();
  }


  resetForm(){
    this.controlcategForm.reset();
    this.controlcategForm.pristine;
    this.controlcategFormErros = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
   // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissControlCategoryModal();
    this._eventEmitterService.dismissControlAuditableItemChildModal();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

    if(event.key == 'Escape' || event.code == 'Escape'){     

        this.closeFormModal();

    }

  }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}

