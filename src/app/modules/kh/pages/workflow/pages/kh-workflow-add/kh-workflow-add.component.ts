import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse} from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { DocumentTypeMasterStore } from 'src/app/stores/masters/knowledge-hub/document-types-store';
import { DocumentTypesService } from 'src/app/core/services/masters/knowledge-hub/document-types/document-types.service';
import { Router } from '@angular/router';
import {WorkFlowStore} from 'src/app/stores/knowledge-hub/work-flow/workFlow.store'
import { WorkflowService } from 'src/app/core/services/knowledge-hub/work-flow/workflow.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentTypesPaginationResponse } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';
import { OrganizationModulesService } from 'src/app/core/services/settings/organization-modules/organization-modules.service';

declare var $: any;

@Component({
  selector: 'app-kh-workflow-add',
  templateUrl: './kh-workflow-add.component.html',
  styleUrls: ['./kh-workflow-add.component.scss']
})
export class KhWorkflowAddComponent implements OnInit {

  @ViewChild("formModal") formModal: ElementRef;
  @ViewChild('documentTypesModal') documentTypesModal: ElementRef;
  @Input('source') WorkFlowSource: any;
  
  workFlowForm: FormGroup;
  formErrors: any;


  WorkFlowStore = WorkFlowStore;
  AppStore = AppStore;
  DocumentTypeMasterStore = DocumentTypeMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationModulesStore = OrganizationModulesStore;


  DocumentTypeEventSubscription: any;
  displayForm: any = null;
  saveData: any = null;
  workFlowId: number;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _documentTypeService: DocumentTypesService,
    private _router: Router,
    private _workFlowService: WorkflowService,
    private _helperService: HelperServiceService,
    private _organizationModuleService: OrganizationModulesService,

  ) {}

  ngOnInit(): void {
    AppStore.showDiscussion = false;

    AppStore.disableLoading();


    // Form Intialization
    this.workFlowForm = this._formBuilder.group({
      id: [""],
      title: ["", [Validators.required, Validators.maxLength(255)]],
      description: [""],
      document_type_ids: [null, Validators.required],
      module_id:[null,Validators.required]
    });
    this.getDocumentTypes()
    this.getOrganizationModules();
    if(this.WorkFlowSource.type=='Add')
    this.getModuleData();

    
    this.resetForm();

    if (this.WorkFlowSource) {

      console.log(this.WorkFlowSource)
      if (this.WorkFlowSource.hasOwnProperty('values') && this.WorkFlowSource.values) {
     

        let { id, title, description, document_type_ids, module_id,organization_ids, section_ids, sub_section_ids, division_ids, department_ids } = this.WorkFlowSource.values
        
      
        this.workFlowForm.setValue({
          id: id,
          title: title?title:'',
          description: description?description:'',
          document_type_ids: document_type_ids ? document_type_ids : [],
          module_id:module_id?module_id:null
        
        }) 
      }
     
    }

    
    this.DocumentTypeEventSubscription = this._eventEmitterService.documentTypesControl.subscribe(res => {
      this.closeDocModal()
    })



  }



  getOrganizationModules() {
    this._organizationModuleService.getAllItems('?side_menu=true').subscribe()

    if (OrganizationModulesStore.loaded) {
      let moduleGroup = OrganizationModulesStore.organizationModules.find(element => element.client_side_url == "/knowledge-hub")
      WorkFlowStore.moduleGroupId = moduleGroup.id
    }
  }

  getModuleData() {
    this._organizationModuleService.getModuleItems('?module_group_ids=' + WorkFlowStore.moduleGroupId + '&is_workflow=true').subscribe((res) => {
      this.workFlowForm.patchValue({
                module_id:res.data[0].module_id
             })
      this._utilityService.detectChanges(this._cdr);
    });

  }


  getEditValue(field){
    var returnValue = [];
  for (let i of field) {
    returnValue.push(i)
  }
    return returnValue;
}

  // Open Document Type  Modal

  addDocumentType(){

    $(this.documentTypesModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }

  
  closeDocModal() {
    if(DocumentTypeMasterStore.lastInsertedId){
      this.searchDocTypes({term: DocumentTypeMasterStore.lastInsertedId},true);
    }
    setTimeout(() => {
      $(this.documentTypesModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  



  getDocumentTypes() {
    this._documentTypeService.getAllItems().subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDocTypes(e,patchValue:boolean = false){
    this._documentTypeService.getItems(false,'q='+e.term).subscribe((res: DocumentTypesPaginationResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            let document_types = this.workFlowForm.value.document_type_ids ? this.workFlowForm.value.document_type_ids : [];
            document_types.push(i);
            this.workFlowForm.patchValue({document_type_ids:document_types});
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  save(close: boolean = false) {
    if (this.workFlowForm.value) {

      this.displayForm = this.workFlowForm.value;
      let save;
      AppStore.enableLoading();

      this.createWorkflow()

      if (this.workFlowForm.value.id) {

        save = this._workFlowService.updateItem(this.workFlowForm.value.id,this.saveData);
      } else {

        save = this._workFlowService.saveItem(this.saveData);
      }
      save.subscribe(
        (res: any) => {
          this.resetForm();
          this.workFlowId=res.id
          AppStore.disableLoading();
    
          if (close) this.closeFormModal('save');
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
            this.processFormErrors()
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


  createWorkflow() {

    this.saveData = {

      "title": this.displayForm.title ? this.displayForm.title : '',
      "description": this.displayForm.description ? this.displayForm.description : '',
      "module_id": this.displayForm.module_id ? this.displayForm.module_id : null,
      "document_type_ids":this.displayForm.document_type_ids?this.displayForm.document_type_ids:[],

    }
  }
  
  processFormErrors(){
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {

        if (key.startsWith('document_type_ids.')) {
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['document_type_ids'] = this.formErrors['document_type_ids']? this.formErrors['document_type_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }
  cancel() {
    this.closeFormModal('cancel');
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  closeFormModal(type) {
    AppStore.disableLoading();
    this.resetForm();
    this._eventEmitterService.dismissCommonModal(type)
  }

  resetForm() {
    this.workFlowForm.reset();
    this.workFlowForm.pristine;
    this.formErrors = null;
  }

  ngOnDestroy() {
    this.DocumentTypeEventSubscription.unsubscribe()
  }

}
