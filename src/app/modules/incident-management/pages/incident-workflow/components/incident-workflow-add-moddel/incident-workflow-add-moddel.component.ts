import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentWorkflowService } from 'src/app/core/services/incident-management/incident-workflow/incident-workflow.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { IncidentWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-workflow-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';



@Component({
  selector: 'app-incident-workflow-add-moddel',
  templateUrl: './incident-workflow-add-moddel.component.html',
  styleUrls: ['./incident-workflow-add-moddel.component.scss']
})
export class IncidentWorkflowAddModdelComponent implements OnInit {
  @Input('source') workFlowObject : any
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  SubsidiaryStore = SubsidiaryStore;
  DepartmentMasterStore = DepartmentMasterStore;
  SectionMasterStore = SectionMasterStore;
  SubSectionMasterStore = SubSectionMasterStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
	IncidentWorkflowStore = IncidentWorkflowStore;
  auditWorkflowSubHead
  moduleGroupId: any;
  constructor(private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _subsiadiaryService: SubsidiaryService,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _incidentWorkflowService: IncidentWorkflowService,
    private _divisionService: DivisionService,
    private _departmentService: DepartmentService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,

  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      module_id: [null,[Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      // organization_ids : [null],
      // division_ids : [null],
      // department_ids : [null],
      // section_ids : [null],
      // sub_section_ids : [null]
    });

    if (this.workFlowObject) {
       this.editData(); 
    }
   

    this.getModuleData()
    // this.getOrganization();
    // this.getDevisions();
    // this.getDepartment();
    // this.getSections();
    // this.getSubSections();


  } 

  editData(){
    
      if(this.workFlowObject.module_id){
        // console.log('inside',this.workFlowObject)
        this.moduleGroupId = this.workFlowObject.module_id
      }

      if (this.workFlowObject.hasOwnProperty('values') && this.workFlowObject.values) {
        // console.log('inside2')
        let { id, title, organization_ids, module_ids, description,division_ids,department_ids,section_ids,sub_section_ids} = this.workFlowObject.values

        this.form.setValue({
          id: id,
          module_id: module_ids ? module_ids :'',
          title: title ? title : '',
          // organization_ids: organization_ids ? organization_ids : [],
          // division_ids : division_ids ? division_ids : [],
          // department_ids : department_ids ? department_ids : [],
          // section_ids : section_ids ? section_ids : [],
          // sub_section_ids : sub_section_ids ? sub_section_ids : []
        })
        this.auditWorkflowSubHead = description
        this._utilityService.detectChanges(this._cdr);

        // setTimeout(() => {
        //   this.auditCategoryList();
        // }, 1000);
      } else {
        // this.setInitialOrganizationLevels();
      }
    
  }

  getModuleData() {
    this._incidentWorkflowService.getModuleItems('?module_group_ids='+1900+'&is_workflow=true').subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  processDataForSave(){
    // console.log("data",this.form.value.module_id)
    let saveData = {
      "module_id": this.form.value.module_id ? this.form.value.module_id : '',
      "title": this.form.value.title ? this.form.value.title : '',
      // "organization_ids": this.form.value.organization_ids ? [this.form.value.organization_ids] : [],
      "description":this.auditWorkflowSubHead ? this.auditWorkflowSubHead:'',
      // "division_ids": this.form.value.division_ids ?[ this.form.value.division_ids] : [],
      // "department_ids": this.form.value.department_ids ? [this.form.value.department_ids] : [],
      // "section_ids": this.form.value.section_ids ? [this.form.value.section_ids] : [],
      // "sub_section_ids": this.form.value.sub_section_ids ? [this.form.value.sub_section_ids] : [],

    };
  //   if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_division){
  //     delete saveData.division_ids;
  //   } 
  //   if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_department){
  //    delete saveData.department_ids;
  //  }
  //   if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) {
  //     delete saveData.section_ids;
  //   } 
  //   if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section){
  //     delete saveData.sub_section_ids;
  //   }
    return saveData;
  }

  setInitialOrganizationLevels(){
    this.form.patchValue({
      division_ids: AuthStore?.user?.division ?  AuthStore?.user?.division.id : null,
      department_ids:AuthStore?.user?.department ? AuthStore?.user?.department.id : null,
      section_ids:AuthStore?.user?.section ? AuthStore?.user?.section.id : null,
      sub_section_ids: AuthStore?.user?.sub_section ? AuthStore?.user?.sub_section.id : null,
      organization_ids : AuthStore.user?.organization ? AuthStore.user?.organization.id : null,
      

    });
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
      this.form.patchValue({ organization_ids: AuthStore.user?.organization.id});
    }
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({term: this.form.value.division_ids});
    this.searchDepartment({term: this.form.value.department_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSections({term: this.form.value.section_ids});
    if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSections({term: this.form.value.sub_section_ids});
    this._utilityService.detectChanges(this._cdr);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
  save(close: boolean = false) {
  
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
         save = this._incidentWorkflowService.updateItem(this.form.value.id, this.processDataForSave());
      } else {
        delete this.form.value.id
        save = this._incidentWorkflowService.saveItem(this.processDataForSave());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);

        if (close) this.close();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        } else if (err.status == 500 || err.status == 403) {
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  cancel() {
    this.close();
  }
  close() {
    this.resetForm();
    this._eventEmitterService.dismissIncidentWorkflowAddModal()
  }
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    // this.auditWorkflowSubHead = '';
    AppStore.disableLoading();
  }

  getOrganization(){
    this._subsiadiaryService.getAllItems(false).subscribe((res:any)=>{
      if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this.form.patchValue({organization_ids:res.data[0]});
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
    // for searching organization

    searchOrganization(event) {
   
      if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this._subsiadiaryService.searchSubsidiary('?is_full_list=true&q='+event.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        })
      }
  
  
    }

    handleDropDownClear(type){
      switch(type){
        case 'organization_id': this.form.controls['division_ids'].reset();
                                this.form.controls['department_ids'].reset();
                                this.form.controls['section_ids'].reset();
                                this.form.controls['sub_section_ids'].reset();
                  
          break;
        case 'division_id': this.form.controls['department_ids'].reset();
                            this.form.controls['section_ids'].reset();
                            this.form.controls['sub_section_ids'].reset();
                            
          break;
        case 'department_id': this.form.controls['section_ids'].reset();
                              this.form.controls['sub_section_ids'].reset();
                              
          break;
        case 'section_id':  this.form.controls['sub_section_ids'].reset();
                            
          break;
        default: '';
          break;
      }
    }

    searchDivision(event) {
      if(this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0){
        let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
        this._divisionService.getItems(false,'&organization_ids='+parameters+'&q='+event.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
      }
    }

    getDevisions(){
      if(this.form.get('organization_ids').value){
        let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
      this._divisionService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }else{
      this.DivisionStore.setAllDivision([]);
    }
    }
    searchDepartment(e,patchValue:boolean = false){
      if(this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0){
        var params = '';
        params = '&organization_ids='+this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
        if(this.form.get('division_ids').value)
          params += '&division_ids='+this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        //let parameters = this._helperService.createParameterFromArray(this.regForm.get('division_ids').value);
        this._departmentService.getItems(false,params+'&q='+e.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
      }
  
    }

    getDepartment(){

      if(this.form.get('organization_ids').value ){
        var params = '';
        params = '&organization_ids='+this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        if(this.form.get('division_ids').value)
          params += '&division_ids='+this._helperService.createParameterFromArray(this.form.get('division_ids').value);
      this._departmentService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }else{
      this.DepartmentStore.setAllDepartment([]);
    }
    }

    searchSections(e,patchValue:boolean = false){
      if(this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0){
        var params = '';
        params = '&organization_ids='+this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        if(this.form.get('division_ids').value)
          params += '&division_ids='+this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        if(this.form.get('department_ids').value)
          params += '&department_ids='+this._helperService.createParameterFromArray(this.form.get('department_ids').value);
        //let parameters = this._helperService.createParameterFromArray(this.regForm.get('department_ids').value);
        this._sectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
      }
  
    }

    getSections(){
      if(this.form.get('organization_ids').value){
        var params = '';
        params = '&organization_ids='+this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        if(this.form.get('division_ids').value)
          params += '&division_ids='+this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        if(this.form.get('department_ids').value)
          params += '&department_ids='+this._helperService.createParameterFromArray(this.form.get('department_ids').value);
      this._sectionService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    } else{
      this.SectionStore.setAllSection([]);
    }
    }

    searchSubSections(e,patchValue:boolean = false){

      if(this.form.get('organization_ids').value && this.form.get('organization_ids').value.length > 0){
        var params = '';
        params = '&organization_ids='+this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        if(this.form.get('division_ids').value)
          params += '&division_ids='+this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        if(this.form.get('department_ids').value)
          params += '&department_ids='+this._helperService.createParameterFromArray(this.form.get('department_ids').value);
        if(this.form.get('section_ids').value)
          params += '&section_ids='+this._helperService.createParameterFromArray(this.form.get('section_ids').value);
        // let parameters = this._helperService.createParameterFromArray(this.regForm.get('section_ids').value);
        this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
          this._utilityService.detectChanges(this._cdr);
        });
      }
    }

    getSubSections(){
      if(this.form.get('organization_ids').value){
        var params = '';
        params = '&organization_ids='+this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        if(this.form.get('division_ids').value)
          params += '&division_ids='+this._helperService.createParameterFromArray(this.form.get('division_ids').value);
        if(this.form.get('department_ids').value)
          params += '&department_ids='+this._helperService.createParameterFromArray(this.form.get('department_ids').value);
        if(this.form.get('section_ids').value)
          params += '&section_ids='+this._helperService.createParameterFromArray(this.form.get('section_ids').value);
      this._subSectionService.getItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }   else{
      this.SubSectionStore.setAllSubSection([]);
    }
    }

}
