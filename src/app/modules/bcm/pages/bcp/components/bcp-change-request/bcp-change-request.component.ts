import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { BcpChangeRequestTypesService } from "src/app/core/services/masters/bcm/bcp-change-request-types/bcp-change-request-types.service";
import { BCPChangeRequestTypeMasterStore } from "src/app/stores/masters/bcm/bcp-change-request-type.store";
import { BcpChangeRequestService } from "src/app/core/services/bcm/bcp/bcp-change-request/bcp-change-request.service";
import { HttpErrorResponse } from '@angular/common/http';
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';

@Component({
  selector: 'app-bcp-change-request',
  templateUrl: './bcp-change-request.component.html',
  styleUrls: ['./bcp-change-request.component.scss']
})
export class BcpChangeRequestComponent implements OnInit {

  @Input('source') changeRequestSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  BCPChangeRequestTypeMasterStore = BCPChangeRequestTypeMasterStore;
  BcpStore = BcpStore;
  showData: boolean = false;
  bcpChangeRequestId: number = null;
  bcpChangeRequestData: any[] = []
  emptyMessage = "common_nodata_title"
  cremptyMessage = "cr_no_data_message"
  public Editor;
  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',

      '|',
      'bold',
      'italic',

      '|',
      'link',
      '|',

      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',
    ],
    language: 'id'
  };
  changeRequestData = [];
  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _formBuilder: FormBuilder,
    private _bcpChangeRequestTypeService: BcpChangeRequestTypesService, private _eventEmitterService: EventEmitterService,
    private _bcpChangeRequestService: BcpChangeRequestService) {
      this.Editor = myCkEditor;
    }

  ngOnInit(): void {
    this.getBcPChangeRequestTypes();
    this.form = this._formBuilder.group({
      title: ['',[Validators.required]],
      business_continuity_plan_version_id : [null],
      business_continuity_plan_change_request_type_id : [null,[Validators.required]],
      reason : [''],
      is_minor : [null],
      is_major: [null]
    });
    this.form.patchValue({business_continuity_plan_version_id: BcpStore.currentVersionId});
    if(this.changeRequestSource.change_request_id){
      this.bcpChangeRequestId = this.changeRequestSource.change_request_id;
      this.bcpChangeRequestData = this.BcpStore.bcpContents.contents;
      this.showData = true;
      this._utilityService.detectChanges(this._cdr);
    }
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.bcpChangeRequestData = BcpStore.bcpContents.contents;
      this._utilityService.detectChanges(this._cdr);
    }, 250);
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  getBcPChangeRequestTypes(){
    this._bcpChangeRequestTypeService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setChangeRequestType(type){
    this.form.patchValue({business_continuity_plan_change_request_type_id: type});
  }

  setMajorOrMinor(type){
    if(type == 'minor'){
      this.form.patchValue({is_minor: 1});
      this.form.patchValue({is_major: 0});
    }
    else{
      this.form.patchValue({is_minor: 0});
      this.form.patchValue({is_major: 1});
    }
  }

  checkChangeRequestType(id){
    if(this.form.value.business_continuity_plan_change_request_type_id && this.form.value.business_continuity_plan_change_request_type_id == id)
      return true;
    else
      return false;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  checkMajorOrMinor(type){
    let returnValue = false;
    switch(type){
      case 'minor': if(this.form.value.is_minor == 1) returnValue = true;
      break;
      case 'major': if(this.form.value.is_major == 1) returnValue = true;
      break;
    }
    return returnValue;
  }

  // descriptionValueChange(e){
  //   this._utilityService.detectChanges(this._cdr);
  // }

  save(close: boolean = false){
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      save = this._bcpChangeRequestService.createChangeRequest(this.form.value,BcpStore.currentVersionId);
      save.subscribe((res: any) => {
        this.bcpChangeRequestId = res.id;
        this.bcpChangeRequestData = BcpStore.bcpContents.contents;
        if(this.bcpChangeRequestData.length > 0) this.showData = true;
        else this.closeModal();
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this._utilityService.detectChanges(this._cdr);
        if (close) this.closeModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
            this.closeModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  closeModal(){
    this.resetForm();
    this._eventEmitterService.dismissBcpChangeRequestModal();
  }

  saveChangeRequest(close:boolean = true){
    for(let i of this.bcpChangeRequestData){
      let tempData:any = JSON.parse(JSON.stringify(i));
      delete tempData.children
      this.changeRequestData.push(tempData);
      this.checkforSubItems(i);
    }
    // console.log(this.changeRequestData);
    let saveData = {
      business_continuity_plan_change_request_id: this.bcpChangeRequestId,
      contents: this.changeRequestData
    }
    let save;
    AppStore.enableLoading();
    save = this._bcpChangeRequestService.saveInitialCRItem(saveData,this.bcpChangeRequestId);
    save.subscribe((res: any) => {
      if(!this.form.value.id){
        this.resetForm();}
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this._utilityService.detectChanges(this._cdr);
      if (close) this.closeModal();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.closeModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  checkforSubItems(cdata,){
    if(cdata.children.length > 0){
      for(let i of cdata.children){
        let tempData:any = JSON.parse(JSON.stringify(i));
        delete tempData.children
        this.changeRequestData.push(tempData);
        if(i.children.length > 0) this.checkforSubItems(i);
      }
    }
  }

  descriptionValueChange(event: ChangeEvent,data): void {
    data.description = event.editor.getData();
    this._utilityService.detectChanges(this._cdr);
  }

  resetForm(){
    this.form.reset();
  }

}
