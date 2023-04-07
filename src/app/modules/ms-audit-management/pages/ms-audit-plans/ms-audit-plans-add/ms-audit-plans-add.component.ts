import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { AuditChecklistGroupService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-cheklist-group/ms-audit-cheklist-group.service';
import { MsAuditModesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-modes/ms-audit-modes.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { MsAuditCheckListService } from 'src/app/core/services/ms-audit-management/ms-audit-check-list/ms-audit-check-list.service';
import { MsAuditPlansService } from 'src/app/core/services/ms-audit-management/ms-audit-plans/ms-audit-plans.service';
import { MsAuditProgramsService } from 'src/app/core/services/ms-audit-management/ms-audit-programs/ms-audit-programs.service';
import { MsAuditTeamService } from 'src/app/core/services/ms-audit-management/ms-audit-team/ms-audit-team.service';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AuditChecklistGroupMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-checklist-group-store';
import { MsAuditModesMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-modes-store';
import { MsAuditPlanCriteriaMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-criteria-store';
import { MsAuditPlanObjectiveMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-plan-objective-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { MsAuditCheckListStore } from 'src/app/stores/ms-audit-management/ms-audit-check-list/ms-audit-check-list.store';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';
import { MsAuditTeamStore } from 'src/app/stores/ms-audit-management/ms-audit-team/ms-audit-team-store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import * as myCkEditor from 'src/assets/build/ckeditor';

declare var $: any;

@Component({
  selector: 'app-ms-audit-plans-add',
  templateUrl: './ms-audit-plans-add.component.html',
  styleUrls: ['./ms-audit-plans-add.component.scss']
})
export class MsAuditPlansAddComponent implements OnInit ,OnDestroy  {
  @Input('source') source: any;
  @Input('selectedProgram') selectedProgramData: any;//Program base Program select
  @Input('brudCrubAndCloseButtonScoure') brudCrubAndCloseButtonScoure: any;
  
  @ViewChild('processFormModal') processFormModal: ElementRef;
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
  @ViewChild('addCriteria') addCriteria: ElementRef;
  @ViewChild('addObjective') addObjective: ElementRef;
  
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  name = '';
  prePlanList=[];

  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  MsTypeStore=MsTypeStore;//*
  ProcessStore = ProcessStore;//*mapping
  MsAuditTeamStore = MsAuditTeamStore;//*
  MsAuditPlansStore = MsAuditPlansStore;
  MsAuditProgramsStore = MsAuditProgramsStore;//*
  MsAuditCheckListStore = MsAuditCheckListStore;
  MsAuditModesMasterStore = MsAuditModesMasterStore;//*
  AuditChecklistGroupMasterStore = AuditChecklistGroupMasterStore;//*
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DepartmentMasterStore = DepartmentMasterStore;
  MsAuditPlanObjectiveMasterStore=MsAuditPlanObjectiveMasterStore;
  MsAuditPlanCriteriaMasterStore=MsAuditPlanCriteriaMasterStore;
  openModelPopup: boolean = false;
  organisationChangesModalSubscription: any = null; //modal organisation
  ProcessesSelectSubscription: any = null; //modal mapping process

  modalObject = {
    component : 'audit_plan',
  }

  OrganizationLevelObject = {
		component: 'asset',
		values: null,
		type: null
	};

  program_start_date: any;
  program_end_date: any;
  disableProgram:boolean=true;
  disablePreplan:boolean=false;
  

  months = [
    { title: 'Jan', id: 1 },
    { title: 'Feb', id: 2 },
    { title: 'Mar', id: 3 },
    { title: 'Apr', id: 4 },
    { title: 'May', id: 5 },
    { title: 'Jun', id: 6 },
    { title: 'Jul', id: 7 },
    { title: 'Aug', id: 8 },
    { title: 'Sep', id: 9 },
    { title: 'Oct', id: 10 },
    { title: 'Nov', id: 11 },
    { title: 'Dec', id: 12 }
];

  public Editor;
  config = {
    toolbar: [
      'bulletedList',
      'numberedList',
    ],
    language: 'id',
   
  };
  programMstypes=[];
  addObjectiveEvent:any;
  addCriteriaEvent:any;

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _msTypeService: MstypesService,//*
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _msAuditTeamService: MsAuditTeamService,//*
    private _eventEmitterService: EventEmitterService,
    private _msAuditModesService: MsAuditModesService,//*
    private _msAuditPlansService: MsAuditPlansService,
    private _departmentService: DepartmentService,//*master
    private _msAuditProgramsService: MsAuditProgramsService,//*
    private _msAuditCheckListService: MsAuditCheckListService,//module
    private _auditChecklistGroupService: AuditChecklistGroupService,//Master
    ) { 
      this.Editor = myCkEditor;
  }

  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
    //console.log(this.source)
    NoDataItemStore.unsetNoDataItems();
    setTimeout(() => {
      NoDataItemStore.setNoDataItems({title: "mapped_nodata_title_process",subtitle:"add_procedure_subtitle",buttonText:"add_procedure"});
    }, 1500);
    this.reactionDisposer = autorun(() => {

    if(NoDataItemStore.clikedNoDataItem){
      this.selectProcesses();
      NoDataItemStore.unSetClickedNoDataItem();
    }
    });

    AppStore.showDiscussion = false;
    AppStore.disableLoading();

    this.form = this._formBuilder.group({
      id: [null],
      ms_audit_program_id: [null, [Validators.required]],
      department_id: [[],[Validators.required]],
      ms_audit_mode_id:[null, [Validators.required]],
      team_id:[null, [Validators.required]],
      //title: ['', [Validators.required]],
      lead_auditor_id:[null, [Validators.required]],
      auditor_ids:[[], [Validators.required]],
      // lead_auditee_id:[null, [Validators.required]],
      //auditee_ids:[[], [Validators.required]],
      //process_ids:[[],Validators.minLength(1)],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      scope:[''],
      objective:[''],
      criteria:[''],
      ms_type_organization_ids:[[],[Validators.required]],
      preplan:[null,[Validators.required]],
    });

    MsAuditPlanObjectiveMasterStore._selectedMsAuditPlanObjectiveAll = [];
    MsAuditPlanCriteriaMasterStore._selectedMsAuditPlanCriteriaAll = [];

    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    //   this.form.controls['division_id'].setValidators(Validators.required);
    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    //   this.form.controls['section_id'].setValidators(Validators.required);
    // if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    //   this.form.controls['sub_section_id'].setValidators(Validators.required);
    this.addObjectiveEvent = this._eventEmitterService.auditPlanObjectiveModal.subscribe(element => {
      this.closeObjectiveAddModal();
    })

    this.addCriteriaEvent = this._eventEmitterService.auditPlanCriteriaModal.subscribe(element => {
      this.closeCriteriaAddModal();
    });
    //this.resetForm();

    if (MsAuditPlansStore.individualLoaded) {
      this.getProgramDetails(MsAuditPlansStore?.individualMsAuditPlansDetails?.ms_audit_program?.id)
      
      //this.setEditDetails();
    }
    else
    {
      if (this.selectedProgramData && this.source.type=='Add') {//program detials inside audit plan add automatic select program and set heading

        //this.disableProgram=true;
        this.form.patchValue({
          'ms_audit_program_id':this.selectedProgramData,
          //'preplan':{id:MsAuditPlansStore.individualMsAuditPlansDetails?.id,title:MsAuditPlansStore.individualMsAuditPlansDetails?.title},
          'team_id':this.selectedProgramData.ms_audit_category?.team?this.selectedProgramData.ms_audit_category?.team:MsAuditProgramsStore?.individualMsAuditProgramsDetails?.ms_audit_category?.team,
          'lead_auditor_id':this.selectedProgramData.ms_audit_category?.team?.team_lead?this.selectedProgramData.ms_audit_category?.team?.team_lead:MsAuditProgramsStore?.individualMsAuditProgramsDetails?.ms_audit_category?.team?.team_lead,
          'auditor_ids':this.selectedProgramData.ms_audit_category?.team?.team_user?.length?this._helperService.getArrayProcessed(this.selectedProgramData.ms_audit_category?.team?.team_user,false):this._helperService.getArrayProcessed(MsAuditProgramsStore?.individualMsAuditProgramsDetails?.ms_audit_category?.team?.team_user,false),
          'ms_type_organization_ids':this.getProgramMstype(this.selectedProgramData?.ms_type),
          'scope':this.getProgramMstype(this.selectedProgramData?.ms_type)?.length?this.getProgramMstype(this.selectedProgramData?.ms_type)[0]['description']:'',
        });
        //console.log(this.form.value.ms_type_organization_ids[0])
        this.program_start_date = this.selectedProgramData?.start_date? new Date(this.selectedProgramData?.start_date) : '';
        this.program_end_date = this.selectedProgramData?.end_date? new Date(this.selectedProgramData?.end_date) : '';
        this.setProgramMsType(this.selectedProgramData?.ms_type);
  
      }
    }
    
    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(res => {
      this.closeOrganizationModal();
    });

    this.ProcessesSelectSubscription = this._eventEmitterService.modalChange.subscribe(item => {
      this.closeProcesses();
    });

    // this.form.get('checklist_group_id').valueChanges.subscribe(val => {// prv Kpi title set title
    //   if (val?.id) {
    //     this.form.patchValue({
    //       checklists:[],
    //     });
    //     //this.getCheckList(val?.id);
    //   } 
    // });

    this.form.get('ms_audit_program_id').valueChanges.subscribe(val=>{
      if(val?.id){
        this.program_start_date = val?.start_date? new Date(val?.start_date) : '';
        this.program_end_date = val?.end_date? new Date(val?.end_date) : '';

      }
    });

    

    this.getMsAuditTream();
    this.getMsAuditModes();
    this.getMsType();
    
  }
  getScope()
  {
    this.form.patchValue({
      'scope':this.form.value.ms_type_organization_ids.length?this.form.value.ms_type_organization_ids[0]['description']:'',
    });
  }
  getProgramMstype(res)
  {
    let items=[];
    for(let i of res)
    {
      items.push({
        id:i.id,
        ms_type_title:i.ms_type?.title,
        ms_type_version_title:i.ms_type_version?.title,
        description:i.description
      })
    }
    return items;

  }
  checkMindAte()
  {
    return new Date(this.form.value.start_date);
  }

  getProgramDetails(id){
    this._msAuditProgramsService.getItem(id).subscribe(res => {
     this.setProgramMsType(res?.ms_types);
     this.setEditDetails();
  
    this._utilityService.detectChanges(this._cdr);
    });
  }

  setProgramMsType(res)
  {
    this.programMstypes=[];
    for(let i of res)
    {
      this.programMstypes.push({
        id:i.id,
        ms_type_title:i.ms_type?.title,
        ms_type_version_title:i.ms_type_version?.title,
        description:i.description
      })
    }
  }

  
  setCriteria() {

    MsAuditPlanCriteriaMasterStore._selectedMsAuditPlanCriteriaAll = [];
    for (let i of MsAuditPlansStore.individualMsAuditPlansDetails.criteria) {
      MsAuditPlanCriteriaMasterStore._selectedMsAuditPlanCriteriaAll.push(i);
    }
  }

  setObjective() {

    MsAuditPlanObjectiveMasterStore._selectedMsAuditPlanObjectiveAll = [];
    for (let i of MsAuditPlansStore.individualMsAuditPlansDetails.objective) {
      MsAuditPlanObjectiveMasterStore._selectedMsAuditPlanObjectiveAll.push(i);
    }
  }

  checkDatePast(date)
  { 
    if(new Date()>new Date(date))
    {
      return true
    }
    else
    {
      return false;
    }
  }
  
// logic 
  checkListChecked(itemId,isChecked:boolean){
    const CheckListArray=<FormArray>this.form.controls.checklists;
    if (isChecked) {
      CheckListArray.push(new FormControl(itemId));
    } else {
      let index = CheckListArray.controls.findIndex(x => x.value == itemId)
      CheckListArray.removeAt(index);
    }

  }

  deleteObjective(objective) {

    MsAuditPlanObjectiveMasterStore.deleteMsAuditPlanObjectiveById(objective.id);
  }

  deleteCriteria(criteria) {

    MsAuditPlanCriteriaMasterStore.deleteMsAuditPlanCriteriaById(criteria.id);
  }

  getSingleMsAuditProgram()
  {

    this.form.patchValue({
      'team_id':null,
      'lead_auditor_id':null,
      'auditor_ids':[],
    });
    this._msAuditProgramsService.getItem(this.form.value.ms_audit_program_id.id).subscribe(res => {
      this.form.patchValue({
        'team_id':MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.team? MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.team: null,
        'lead_auditor_id':MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.team?.team_lead ? MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.team?.team_lead : null,
        'auditor_ids':MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.team?.team_user?  this._helperService.getArrayProcessed(MsAuditProgramsStore.individualMsAuditProgramsDetails?.ms_audit_category?.team?.team_user, false) : [],
      });
        this._utilityService.detectChanges(this._cdr);
    });
  }

  getDepartment() {
    this._departmentService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
 //**Logic */ 

 setEditDetails() {

   // setProcesses(MsAuditPlansStore.individualMsAuditPlansDetails?.processes);
   this.disablePreplan=true;
   //this.disableProgram=true;
    //this.getCheckList(MsAuditPlansStore.individualMsAuditPlansDetails?.checklist_group?.id);
    this.setCriteria();
    this.setObjective();
    this.form.patchValue({
      id: MsAuditPlansStore.individualMsAuditPlansDetails?.id,
      preplan:{id:MsAuditPlansStore.individualMsAuditPlansDetails?.id,title:MsAuditPlansStore.individualMsAuditPlansDetails?.title},
      ms_audit_program_id:  MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_program? auditProgame(): null,
      organization_id: MsAuditPlansStore.individualMsAuditPlansDetails?.organization ?  MsAuditPlansStore.individualMsAuditPlansDetails?.organization : null,
			division_id: MsAuditPlansStore.individualMsAuditPlansDetails?.division ?  MsAuditPlansStore.individualMsAuditPlansDetails?.division : null,
			department_id: MsAuditPlansStore.individualMsAuditPlansDetails?.department.length ? this._helperService.getArrayProcessed(MsAuditPlansStore.individualMsAuditPlansDetails?.department,false) : [],
			section_id: MsAuditPlansStore.individualMsAuditPlansDetails?.section ?  MsAuditPlansStore.individualMsAuditPlansDetails?.section : null,
      sub_section_id:  MsAuditPlansStore.individualMsAuditPlansDetails?.sub_section ?  MsAuditPlansStore.individualMsAuditPlansDetails?.sub_section :null,
      ms_audit_mode_id: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_mode  ? MsAuditMode(): null,
      team_id: MsAuditPlansStore.individualMsAuditPlansDetails?.team ? MsAuditPlansStore.individualMsAuditPlansDetails?.team: null,
      //title: MsAuditPlansStore.individualMsAuditPlansDetails?.title ?  MsAuditPlansStore.individualMsAuditPlansDetails?.title : '',
      lead_auditor_id: MsAuditPlansStore.individualMsAuditPlansDetails?.lead_auditor ? MsAuditPlansStore.individualMsAuditPlansDetails?.lead_auditor : null,
      auditor_ids: MsAuditPlansStore.individualMsAuditPlansDetails?.auditors?  this._helperService.getArrayProcessed(MsAuditPlansStore.individualMsAuditPlansDetails?.auditors, false) : [],
      // lead_auditee_id: MsAuditPlansStore.individualMsAuditPlansDetails?.lead_auditee? MsAuditPlansStore.individualMsAuditPlansDetails?.lead_auditee : null,
      //auditee_ids:  MsAuditPlansStore.individualMsAuditPlansDetails?.auditees?  this._helperService.getArrayProcessed(MsAuditPlansStore.individualMsAuditPlansDetails?.auditees, false) : [],
      start_date: MsAuditPlansStore.individualMsAuditPlansDetails?.start_date ? new Date( MsAuditPlansStore.individualMsAuditPlansDetails?.start_date) : '',
      end_date: MsAuditPlansStore.individualMsAuditPlansDetails?.end_date ? new Date( MsAuditPlansStore.individualMsAuditPlansDetails?.end_date) : '',
      // checklist_group_id:  MsAuditPlansStore.individualMsAuditPlansDetails?.checklist_group ?  MsAuditPlansStore.individualMsAuditPlansDetails?.checklist_group: null,
      scope: MsAuditPlansStore.individualMsAuditPlansDetails?.scope ?  MsAuditPlansStore.individualMsAuditPlansDetails?.scope: '',
      // objective: MsAuditPlansStore.individualMsAuditPlansDetails?.objective ? MsAuditPlansStore.individualMsAuditPlansDetails?.objective: '',
      // criteria: MsAuditPlansStore.individualMsAuditPlansDetails?.criteria ? MsAuditPlansStore.individualMsAuditPlansDetails?.criteria: '',
      checklists:[],
      ms_type_organization_ids: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_type_organizations ? processMsTypeOrganizations() : [],
      
    });
    //this.getSingleMsAuditProgram();

    let val = this.form.get('ms_audit_program_id').value
      if(val?.id){
        this.program_start_date = val?.start_date? new Date(val?.start_date) : '';
        this.program_end_date = val?.end_date? new Date(val?.end_date) : '';
      }

    function MsAuditMode(){
      return {
        id: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_mode?.language[0]?.pivot?.ms_audit_mode_id,
        title: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_mode?.language[0]?.pivot?.title
      }
    }

    // function setProcesses(items) {
    //   ProcessStore.selectedProcessesList = [];
    //   let processItem = items;
    //   for (let i of processItem) {
    //     i['process_group_title'] = i.title;
    //     i['department'] = i.department?.title;
    //     i['process_category_title'] = i.process_category?.title;
    //     ProcessStore.selectedProcessesList.push(i);
    //   }
    // }

    function auditProgame(){
      return {
        id: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_program.id,
        ms_audit_program_title: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_program.title,
        start_date: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_program.start_date,
        end_date: MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_program.end_date
      }
    }

    function processMsTypeOrganizations() {
      let processedMsTypes = [];
      if (MsAuditPlansStore.individualMsAuditPlansDetails?.ms_type_organizations) {
        for (let i of MsAuditPlansStore.individualMsAuditPlansDetails?.ms_type_organizations) {
          let msTypes = { id: i.id, ms_type_title: i.ms_type?.title, ms_type_version_title: i.ms_type_version?.title };
          processedMsTypes.push(msTypes);
        }
      }
      return processedMsTypes;
    }

    // if( MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_plan_checklists.length>0){

    //   for(let i of MsAuditPlansStore.individualMsAuditPlansDetails?.ms_audit_plan_checklists){

    //     this.checkListChecked(i?.checklist_id,true);
    //   }
    // }
  }

  // getCheckList(id){
  //   this._msAuditCheckListService.getItems(true,`?checklist_group_ids=${id}`,true).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  // getCheckListTitle(){
  //   this._auditChecklistGroupService.getItems(false).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  // searchCheckLsitTitle(event){
  //   this._auditChecklistGroupService.getItems(true,'?q=' + event.term).subscribe(res => {
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  getMsAuditTream() {
    this._msAuditTeamService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsAuditTream(event) {
    this._msAuditTeamService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMsAuditModes() {
    this._msAuditModesService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsAuditModes(event) {
    this._msAuditModesService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMsAuditProgram() {
    this._msAuditProgramsService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsAuditProgram(event) {
    this._msAuditProgramsService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getUsers() {
    var params = '';
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUsers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getMsType() {
    this._msTypeService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsType(event) {
    this._msTypeService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  setInitialOrganizationLevels() {
		this.form.patchValue({
			division_id: AuthStore?.user?.division ? AuthStore?.user?.division : null,
			department_id: AuthStore?.user?.department ? AuthStore?.user?.department : null,
			section_id: AuthStore?.user?.section ? AuthStore?.user?.section : null,
			sub_section_id: AuthStore?.user?.sub_section ? AuthStore?.user?.sub_section : null,
			organization_id: AuthStore.user?.organization ? AuthStore.user?.organization : null,
		});
		this._utilityService.detectChanges(this._cdr);
	}

  getMsAuditPrePlan(event?)
  {
   let param='';
   if(event)
   {
    param=event.term
   }
    this._msAuditPlansService.getItemsPrePlan(false, '&ms_audit_program_ids='+MsAuditProgramsStore.msAuditProgramsId+'&q=' + param).subscribe(res => {
      this.prePlanList=res.data;
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getSingleMsAuditPrePlan()
  {
    this.form.patchValue({
      'start_date':null,
      'end_date':null,
      'lead_auditor_id':null
      
    });
    this._msAuditPlansService.getItemPrePlan(this.form.value.preplan.id).subscribe(res => {
      this.form.patchValue({
        'start_date':res?.start_date? new Date(res?.start_date) : '',
        'end_date':res?.end_date? new Date(res?.end_date) : '',
        'lead_auditor_id':res?.lead_auditor?res?.lead_auditor: null,
      });
        this._utilityService.detectChanges(this._cdr);
    });
  }
  objectiveAdd() {
    MsAuditPlansStore.objectives_form_modal = true;
    $(this.addObjective.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  closeObjectiveAddModal() {
    MsAuditPlansStore.objectives_form_modal = false;
    $(this.addObjective.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  closeCriteriaAddModal() {
    MsAuditPlansStore.criteria_form_modal = false;
    $(this.addCriteria.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  criteriaAdd() {
    MsAuditPlansStore.criteria_form_modal = true;
    $(this.addCriteria.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

//** form support api */


//*Form Modal

  selectProcesses() {
    ProcessStore.processes_form_modal = true;
    setTimeout(() => {
      $(this.processFormModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeProcesses() {
    ProcessStore.processes_form_modal = false;
    $(this.processFormModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.processFormModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  organisationChanges() {
    OrganizationalSettingsStore.isMultiple = false;
    if (MsAuditPlansStore.editFlag) {
			this.OrganizationLevelObject.values = {
				id: this.form.value.id,
				organization_ids: this.form.value.organization_id ? this.form.value.organization_id : null,
				division_ids: this.form.value.division_id ? this.form.value.division_id : null,
				department_ids: this.form.value.department_id ? this.form.value.department_id : null,
				section_ids: this.form.value.section_id ? this.form.value.section_id : null,
				sub_section_ids: this.form.value.sub_section_id ? this.form.value.sub_section_id : null
			}
		}
		this.openModelPopup = true;
		this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}

	closeOrganizationModal(data?) {
		if (data) {
			this.form.patchValue({
				division_id: data.division_ids ? data.division_ids : null,
				department_id: data.department_ids ? data.department_ids : null,
				section_id: data.section_ids ? data.section_ids : null,
				sub_section_id: data.sub_section_ids ? data.sub_section_ids : null,
				organization_id: data.organization_ids ? data.organization_ids : null,
			})
		}
		this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
		this.openModelPopup = false;
		this._utilityService.detectChanges(this._cdr);
	}

//** Form Modal */

  //ckeditor
  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getScopeLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.scope.replace(regex, "");
    return result.length;
  }

  getObjectiveLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.objective.replace(regex, "");
    return result.length;
  }

  getCriteriaLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.criteria.replace(regex, "");
    return result.length;
  }
  //**ckeditor */

  searchListclickValueClear(event) {
    return event.searchTerm = '';
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  createImageUrl(token) {// user-defined
    return this._imageService.getThumbnailPreview('user-profile-picture', token)
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  cancel() {
    this.closeFormModal('cancel');
  }

  closeFormModal(type, resId?) {
    AppStore.disableLoading();
    this.resetForm();
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_ms_audit_plan'});
    if (resId) {
      this._router.navigateByUrl('ms-audit-management/ms-audit-plans/' + resId);

      if(this.brudCrubAndCloseButtonScoure){
        MsAuditPlansStore.setPath(this.brudCrubAndCloseButtonScoure?.path);
        BreadCrumbMenuItemStore.refreshBreadCrumbMenu=true;
        BreadCrumbMenuItemStore.makeEmpty();
        BreadCrumbMenuItemStore.addBreadCrumbMenu({
          name:this.brudCrubAndCloseButtonScoure?.name,
          path:this.brudCrubAndCloseButtonScoure?.path
        });
      }
      
    }
    this._eventEmitterService.dismissCommonModal(type);
  }

  changeTeam(){
    if(this.form.value.team_id)
    this._msAuditPlansService.getTeam(this.form.value.team_id.id).subscribe(res=>{
      if(res){
        this.form.patchValue({
          auditor_ids: res?.team_members?  this._helperService.getArrayProcessed(res?.team_members, false) : [],
          lead_auditor_id: res?.team_lead? res?.team_lead : null,
        })
      }
    })
  }

  resetForm() {
    //this.form.reset();
    //this.form.pristine;
    this.formErrors = null;
    MsAuditPlanObjectiveMasterStore.clearObjective();
    MsAuditPlanCriteriaMasterStore.clearCriteria();
    this.form.patchValue({
      //ms_audit_program_id:this.selectedProgramData? this.selectedProgramData : null,
      id: null,
      department_id: [],
      //ms_audit_mode_id:[null],
      //team_id:[null, [Validators.required]],
      //title: ['', [Validators.required]],
      //lead_auditor_id:[null, [Validators.required]],
      objective:'',
      criteria:'',
      //ms_type_organization_ids:[[],[Validators.required]],
      preplan:null,
    });

    ProcessStore.selectedProcessesList = [];
    //MsAuditCheckListStore.unsetMsAuditCheckLists();
  }

 

  getSaveData() {
    
    this.saveData = {
      ms_audit_program_id:this.form.value.ms_audit_program_id? this.form.value.ms_audit_program_id?.id: null,
      is_new:this.form.value.id?false:true,
      organization_id: null,
      division_id:  null,
      department_ids: this.form.value.department_id.length ? this._helperService.getArrayProcessed(this.form.value.department_id,'id') : null,
      section_id:  null,
      sub_section_id:  null,
      ms_audit_mode_id: this.form.value.ms_audit_mode_id ? this.form.value.ms_audit_mode_id.id: null,
      team_id: this.form.value.team_id? this.form.value.team_id.id: null,
      title: this.form.value.preplan? this.form.value.preplan?.title: null,
      lead_auditor_id: this.form.value.lead_auditor_id? this.form.value.lead_auditor_id.id:null,
      auditor_ids: this.form.value.auditor_ids? this._helperService.getArrayProcessed(this.form.value.auditor_ids, 'id') : [],
      // lead_auditee_id: this.form.value.lead_auditee_id? this.form.value.lead_auditee_id.id:null,
      //auditee_ids: this.form.value.auditee_ids? this._helperService.getArrayProcessed(this.form.value.auditee_ids, 'id') : [],
      //process_ids: ProcessStore.selectedProcessesList ? this._helperService.getArrayProcessed(ProcessStore.selectedProcessesList, 'id') : [],
      start_date: this.form.value.start_date ? this._helperService.passSaveFormatDate(this.form.value.start_date) : '',
      end_date: this.form.value.end_date ? this._helperService.passSaveFormatDate(this.form.value.end_date) : '',
      // checklist_group_id: this.form.value.checklist_group_id ? this.form.value.checklist_group_id.id :null,
      scope: this.form.value.scope ? this.form.value.scope: '',
      // objective: this.form.value.objective ? this.form.value.objective: '',
      // criteria: this.form.value.criteria ? this.form.value.criteria: '',
      objective_ids: MsAuditPlanObjectiveMasterStore?._selectedMsAuditPlanObjectiveAll.length ? this._helperService.getArrayProcessed(MsAuditPlanObjectiveMasterStore?._selectedMsAuditPlanObjectiveAll, 'id') : [],
      criteria_ids: MsAuditPlanCriteriaMasterStore?._selectedMsAuditPlanCriteriaAll.length ? this._helperService.getArrayProcessed(MsAuditPlanCriteriaMasterStore?._selectedMsAuditPlanCriteriaAll, 'id') : [],
      // checklists: this.form.value.checklists ? checkListProccess(this.form.value.checklists):[],
      ms_type_organization_ids:this.form.value.ms_type_organization_ids?  this._helperService.getArrayProcessed(this.form.value.ms_type_organization_ids, 'id') : null,
    }

    // function checkListProccess(items){
    //   return items.map(e=>({'checklist_id':e}));
    // }
  }

  save(close: boolean = false) {

    if (this.form.value) {

      let save;
      AppStore.enableLoading();
      this.getSaveData();
      save = this._msAuditPlansService.updateItem(this.form.value.id?this.form.value.id:this.form.value.preplan.id,this.saveData);
      save.subscribe(
        (res: any) => {
          if(this.source.type=='Add')
          {
            this.resetForm();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.closeFormModal('save', res.id);
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  checked(item){
    let pos = this.form.value.checklists.findIndex(e=> e == item.id)
        if(pos!=-1) return true
        else return false
  }

  deleteProcesses(item){
    const index = ProcessStore.selectedProcessesList.indexOf(item);
    if (index > -1) {
      ProcessStore.selectedProcessesList.splice(index, 1); 
    }
  }

  searchDepartment(event) {
    this._departmentService.getItems(true,'?q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    this.organisationChangesModalSubscription.unsubscribe();//modal organisation
    this.ProcessesSelectSubscription.unsubscribe();//modal mapping process
    MsAuditProgramsStore.unSetMsAuditPrograms();
    this.addObjectiveEvent.unsubscribe();
    this.addCriteriaEvent.unsubscribe();
  }
}
