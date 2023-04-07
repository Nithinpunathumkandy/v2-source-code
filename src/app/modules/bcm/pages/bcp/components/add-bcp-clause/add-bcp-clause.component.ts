import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';
import { BcpClauseService } from "src/app/core/services/bcm/bcp/bcp-clause/bcp-clause.service"
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { BcpChangeRequestService } from "src/app/core/services/bcm/bcp/bcp-change-request/bcp-change-request.service";
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';

@Component({
  selector: 'app-add-bcp-clause',
  templateUrl: './add-bcp-clause.component.html',
  styleUrls: ['./add-bcp-clause.component.scss']
})
export class AddBcpClauseComponent implements OnInit {
  @Input('source') bcpClauseSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  
  public Editor;
  public Config;
  constructor(private _formBuilder: FormBuilder, private _helperService: HelperServiceService,
    private _bcpClauseService: BcpClauseService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService,
    private _http: HttpClient, private _bcpChangeRequestService: BcpChangeRequestService) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {
    
    if(this.bcpClauseSource.bcpType){
      this.form = this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required]],
        description: [''],
        business_continuity_plan_version_id: [null],
        business_continuity_plan_change_request_id: [null],
        business_continuity_plan_change_request_content_id: [null],
        order: [''],
        index_no:['']
      });
    }
    else{
      this.form = this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required]],
        description: [''],
        business_continuity_plan_version_id: [null],
        business_continuity_plan_version_content_id: [null],
        order: [''],
        index_no:['']
      });
    }
    if(this.bcpClauseSource.type == 'Add'){
      this.form.patchValue({
        business_continuity_plan_version_id: this.bcpClauseSource.version_id,
        order: this.bcpClauseSource.order
      })
      if(this.bcpClauseSource.business_continuity_plan_version_content_id){
        this.form.patchValue({
          business_continuity_plan_version_content_id: this.bcpClauseSource.business_continuity_plan_version_content_id,
          order: this.bcpClauseSource.order
        })
      }
      if(this.bcpClauseSource.business_continuity_plan_change_request_content_id){
        this.form.patchValue({
          business_continuity_plan_change_request_content_id: this.bcpClauseSource.business_continuity_plan_change_request_content_id
        })
      }
      if(this.bcpClauseSource.business_continuity_plan_change_request_id){
        this.form.patchValue({
          business_continuity_plan_change_request_id: this.bcpClauseSource.business_continuity_plan_change_request_id
        })
      }
      if(this.bcpClauseSource.index_no){
        this.form.patchValue({
          index_no: this.bcpClauseSource.index_no
        })
      }
    }
    else
      this.setFormValues()
  }

  setFormValues(){
    if(!this.bcpClauseSource.bcpType){
      this.form.patchValue({
        id: this.bcpClauseSource.values.id,
        title: this.bcpClauseSource.values.title,
        description: this.bcpClauseSource.values.description,
        business_continuity_plan_version_id: this.bcpClauseSource.values.business_continuity_plan_version_id,
        business_continuity_plan_version_content_id: this.bcpClauseSource.values.business_continuity_plan_version_content_id,
        order: this.bcpClauseSource.values.order,
        index_no: this.bcpClauseSource.values.index_no ?  this.bcpClauseSource.values.index_no : ''
      })
    }
    else{
      this.form.patchValue({
        id: this.bcpClauseSource.values.id,
        title: this.bcpClauseSource.values.title,
        description: this.bcpClauseSource.values.description,
        business_continuity_plan_version_id: this.bcpClauseSource.version_id,
        business_continuity_plan_change_request_id: this.bcpClauseSource.business_continuity_plan_change_request_id,
        business_continuity_plan_change_request_content_id: this.bcpClauseSource.business_continuity_plan_change_request_content_id,
        order: this.bcpClauseSource.values.order,
        index_no: this.bcpClauseSource.values.index_no ?  this.bcpClauseSource.values.index_no : ''
      })
    }
    this._utilityService.detectChanges(this._cdr);
    // if(this.bcpClauseSource.bcpType){
    //   this.form.patchValue({business_continuity_plan_change_request_id: this.bcpClauseSource.bcpType});
    // }
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  save(close:boolean=false){
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if(!this.bcpClauseSource.bcpType){
        if (this.form.value.id) {
          save = this._bcpClauseService.updateItem(this.form.value.id, this.form.value);
        } else {
          delete this.form.value.id
          save = this._bcpClauseService.saveItem(this.form.value);
        }
      }
      else{
        if (this.form.value.id) {
          save = this._bcpChangeRequestService.updateCRItem(this.form.value.id,this.form.value.business_continuity_plan_change_request_id, this.form.value);
        } else {
          delete this.form.value.id
          save = this._bcpChangeRequestService.saveCRItem(this.form.value,this.form.value.business_continuity_plan_change_request_id);
        }
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
            this.cancel();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  resetForm(){
    // this.form.reset();
    this.form.controls['id'].reset();
    this.form.controls['title'].reset();
    this.form.controls['description'].reset();
    this.formErrors = null;
  }

  cancel(){
    this.resetForm();
    this._eventEmitterService.dismissBcpClauseModal();
  }

}
