import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import{SectionMasterStore} from 'src/app/stores/masters/organization/section-store';
import{ SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { HttpErrorResponse } from '@angular/common/http';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BcpWorkflowService } from 'src/app/core/services/bcm/bcp-workflow/bcp-workflow.service';
import { BcpWorkflowStore } from 'src/app/stores/bcm/bcp-workflow/bcp-workflow-store';

@Component({
  selector: 'app-add-bcp-workflow',
  templateUrl: './add-bcp-workflow.component.html',
  styleUrls: ['./add-bcp-workflow.component.scss']
})
export class AddBcpWorkflowComponent implements OnInit {

  @Input('source') bcpWorkflowSource: any;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  AppStore = AppStore;
  AuthStore = AuthStore;
  SubsidiaryStore = SubsidiaryStore;
  SectionMasterStore = SectionMasterStore;
  DivisionMasterStore = DivisionMasterStore;
  DepartmentMasterStore = DepartmentMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubSectionMasterStore = SubSectionMasterStore;
  BcpWorkflowStore = BcpWorkflowStore;
  form: FormGroup;
  formErrors: any;
  organisationChangesModalSubscription: any = null;
  openModelPopup: boolean = false;
  moduleGroupId;


  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService, 
    private _renderer2: Renderer2,
    private _bcpWorkflowService: BcpWorkflowService
    ) { }


   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof AddBcpWorkflowComponent
   */
  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      module_id: [null],
      organization_ids: [[], [Validators.required]],
      division_ids: [[]],
      department_ids: [[]],
      section_ids: [[]],
      sub_section_ids: [[]],
    });
    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
      (res) => {
        this.closeModal();
      }
    );
    if (this.bcpWorkflowSource) {
      if(this.bcpWorkflowSource.module_id){
        this.moduleGroupId = this.bcpWorkflowSource.module_id
      }
      if(this.bcpWorkflowSource.type == 'Add')
      this.setInitialOrganizationLevels();
      else
      this.setFormValues();
    }
      this.getModuleData()
  }

  getModuleData() {
    this._bcpWorkflowService.getModuleItems('?module_group_ids='+this.moduleGroupId+'&is_workflow=true').subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  
  setInitialOrganizationLevels(){
    this.form.patchValue({
      section_ids:AuthStore.user.section ? [AuthStore.user.section] : [],
      organization_ids: AuthStore?.user?.organization ? [AuthStore?.user?.organization] : [],
      division_ids: AuthStore?.user?.division ? [AuthStore?.user?.division] : [],
      department_ids: AuthStore?.user?.department ? [AuthStore?.user?.department] : [],
      sub_section_ids: AuthStore?.user?.sub_section ? [AuthStore?.user?.sub_section] : [],
    });
  }

  organisationChanges() {
    this.openModelPopup = true;
    this._renderer2.addClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeModal(data?) {
    if(data){
      this.form.patchValue({
        division_ids: data.division_ids ? data.division_ids : [],
        department_ids:data.department_ids ? data.department_ids : [],
        section_ids:data.section_ids ? data.section_ids : [],
        sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
        organization_ids: data.organization_ids ? data.organization_ids : []
      })
    }
    this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement,'display','none');
    this.openModelPopup = false;
    this._utilityService.detectChanges(this._cdr);
  }

  setFormValues(){
    if(this.bcpWorkflowSource.values){
      this.form.patchValue({
        'organization_ids': this.bcpWorkflowSource.values.organizations,
        'division_ids':this.bcpWorkflowSource.values.divisions,
        'department_ids':this.bcpWorkflowSource.values.departments,
        'section_ids':this.bcpWorkflowSource.values.sections,
        'sub_section_ids':this.bcpWorkflowSource.values.sub_sections,
        'id':this.bcpWorkflowSource.values.id,
        'title': this.bcpWorkflowSource.values.title,
        'description': this.bcpWorkflowSource.values.description,
        'module_id':this.bcpWorkflowSource.values.module.id
      });
      console.log(this.bcpWorkflowSource.values);
      console.log(this.bcpWorkflowSource.values.module);

      this._utilityService.detectChanges(this._cdr);
    }
  }

   

    processSaveData(){
      let saveData = this.form.value;
      saveData['module_id'] = this.form.value.module_id ? this.form.value.module_id : null,
      saveData['organization_ids'] = this.form.value.organization_ids ? this._helperService.getArrayProcessed(this.form.value.organization_ids,'id') : [AuthStore.user?.organization.id];
      saveData['division_ids'] =  this.form.value.division_ids ? this._helperService.getArrayProcessed(this.form.value.division_ids,'id') : [AuthStore.user?.division.id];
      saveData['department_ids'] = this.form.value.department_ids ? this._helperService.getArrayProcessed(this.form.value.department_ids,'id') : [AuthStore.user?.department.id];
      saveData['section_ids'] = this.form.value.section_ids ? this._helperService.getArrayProcessed(this.form.value.section_ids,'id') : [AuthStore.user?.section.id];
      saveData['sub_section_ids'] = this.form.value.sub_section_ids ? this._helperService.getArrayProcessed(this.form.value.sub_section_ids,'id') : [AuthStore.user?.sub_section.id];
      return saveData;
    }
    
    save(close:boolean=false){
      this.formErrors = null;
      if (this.form.valid) {
        let save;
        AppStore.enableLoading();
        if (this.form.value.id) {
          save = this._bcpWorkflowService.updateItem(this.form.value.id, this.processSaveData());
        } else {
          delete this.form.value.id
          save = this._bcpWorkflowService.saveItem(this.processSaveData());
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
      this.form.reset();
      this.formErrors = null;
    }

    cancel(){
      this._eventEmitterService.setModalStyle();
      this.resetForm();
      this._eventEmitterService.dismissBcpWorkflowAddModal();
    }
}
