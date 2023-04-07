import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentSystemTypeService } from 'src/app/core/services/masters/knowledge-hub/document-system-type/document-system-type.service';
import { KhSettingsService } from 'src/app/core/services/settings/organization_settings/kh-settings/kh-settings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { DocumentSystemTypeStore } from 'src/app/stores/masters/knowledge-hub/document-system-type.store';
import { KHSettingStore } from 'src/app/stores/settings/kh-settings.store';
declare var $:any
@Component({
  selector: 'app-k-h-settings',
  templateUrl: './k-h-settings.component.html',
  styleUrls: ['./k-h-settings.component.scss']
})
export class KHSettingsComponent implements OnInit {
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;

  khForm:FormGroup;
  newArray:[]=[]
  KHSettingStore =KHSettingStore;
  DocumentSystemTypeStore=DocumentSystemTypeStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  buttonDisabled:boolean = true;
  openReferenceSettings:boolean=false
  refCodeSettingsEvent:any;
  constructor(private _khSettingService:KhSettingsService,
    private _formBuilder:FormBuilder,
    private _utilityService:UtilityService,
    private _DocumentSystemTypeService:DocumentSystemTypeService,
    private _cdr:ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    ) { }

  ngOnInit(): void {

    
    AppStore.showDiscussion = false;
    this.getItems();
    this.getDocumentSystemTypes();
    this.khForm = this._formBuilder.group({
      id: [null],
      ai_document_extract:[null],
      ai_summary: [null],
      recent_document_count: [null,Validators.required],
      retain_days_in_trash: [null,Validators.required],
      is_document_workflow:[null],
      is_reference_code:[null],
      knowledge_hub_setting_type_id: ['',Validators.required],
      retain_days_in_archive:[null]
      // reference_code_parts:[]
    })

    this.refCodeSettingsEvent = this._eventEmitterService.eventRefCodeModal.subscribe(item => {
      // this.getItems()
      this.closeFormModal()
    })
  }

  getDocumentSystemTypes(){
    this._DocumentSystemTypeService.getAllItems().subscribe()
  }
  getItems(){
    this._khSettingService.getItems().subscribe(()=> this.setFormValues())
  }

  setFormValues(){
    
    let khSettingValue = KHSettingStore?.khSettingsItems;

    
    if(khSettingValue.is_reference_code){
      KHSettingStore?.khSettingsItems?.customized_reference_code.forEach(e=>{
        if(e.reference_type=='prefix')
        KHSettingStore.preFix=e.title
        if(e.reference_type=='code-divider')
        KHSettingStore.codeDivider=e.title
        if(e.reference_type=='company-code')
        KHSettingStore.companyCode=e.title
        let pos = KHSettingStore.referenceCodeArray.findIndex(element=>element.type==e.reference_type)
        if(pos !=-1)
        {
          KHSettingStore.referenceCodeArray[pos]['is_enable']=1
          KHSettingStore.referenceCodeArray[pos]['order']=e.order
        }
        })
      
        setTimeout(() => {
        }, 350);
        KHSettingStore.referenceCodeArray.sort((firstItem, secondItem) => firstItem['order'] - secondItem['order'])
    }


    this.khForm.setValue({
      id: khSettingValue?.id,
      ai_document_extract:khSettingValue?.ai_document_extract ? true : false,
      ai_summary: khSettingValue?.ai_summary ? true : false,
      recent_document_count: khSettingValue?.recent_document_count,
      retain_days_in_trash: khSettingValue?.retain_days_in_trash ,
      is_document_workflow:khSettingValue?.is_document_workflow?khSettingValue?.is_document_workflow:0 ,
      is_reference_code:khSettingValue.is_reference_code?khSettingValue.is_reference_code:KHSettingStore.refSettingsItems.length > 0?1:0,
      knowledge_hub_setting_type_id:khSettingValue?.knowledge_hub_setting_type?khSettingValue?.knowledge_hub_setting_type.id:1,
      retain_days_in_archive:khSettingValue?.retain_days_in_archive
      // reference_code_parts: KHSettingStore.refSettingsItems?KHSettingStore.refSettingsItems:[]
    })
  }

  submit(){
    if (this.khForm.value) {
      let save;
      AppStore.enableLoading();
      let processedForm={
        ...this.khForm.value,
         reference_code_parts: KHSettingStore.refSettingsItems?KHSettingStore.refSettingsItems:[]
      }
      save = this._khSettingService.updateItem(processedForm);
      save.subscribe((res: any) => {
        KHSettingStore.clearRefSetting()
        this.buttonDisabled = true;
        this.getItems();
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.buttonDisabled = true;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }



  openFormModal() {
    this.openReferenceSettings=true;
    $(this.formModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeFormModal(){
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    this.openReferenceSettings=false
    // this._utilityService.detectChanges(this._cdr);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  enableSaveButton(){    
    this.buttonDisabled = false;
  }


  enableSaveButtonRef(event?: any,data?: any){
    if (event.target.checked == true ) 
      this.openFormModal();
  
  }

}
