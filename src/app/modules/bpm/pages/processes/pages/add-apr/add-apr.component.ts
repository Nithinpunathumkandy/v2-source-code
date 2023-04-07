import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AprService } from 'src/app/core/services/bpm/advanced-process/apr.service';
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ProcessOperationFrequencyService } from 'src/app/core/services/masters/bcm/process-operation-frequency/process-operation-frequency.service';
import { HighAvialabilityStatusService } from 'src/app/core/services/masters/bpm/high-availability-status/high-avialability-status.service';
import { ProcessAccessibilityService } from 'src/app/core/services/masters/bpm/process-accessibility/process-accessibility.service';
import { ProcessModesMasterService } from 'src/app/core/services/masters/bpm/process-modes/process-modes-master.service';
import { SlaStatusesService } from 'src/app/core/services/masters/compliance-management/sla-statuses/sla-statuses.service';
import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { AprDemoStore } from 'src/app/modules/bpm/apr-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AdvancePrStore } from 'src/app/stores/bpm/process/adavanc-pr-store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ProcessOperationFrequencyMasterStore } from 'src/app/stores/masters/bcm/process-operation-frequency.master.store';
import { HighAvailabilityStatusMasterStore } from 'src/app/stores/masters/bpm/high-availabilty-status.store';
import { ProcessAccessibilityMasterStore } from 'src/app/stores/masters/bpm/process-accesibility.store';
import { OperationModesMasterStore } from 'src/app/stores/masters/bpm/process-operation-modes.store';
import { SlaStatusesMasterStore } from 'src/app/stores/masters/compliance-management/sla-statuses-store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
// import { DepartmentStore } from 'src/app/stores/general/department.store';
import { SuppliersService } from 'src/app/core/services/masters/suppliers-management/suppliers/suppliers.service';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';
import { SLAContractStore } from 'src/app/stores/compliance-management/sla-contract/sla-contract-store';
import { StorageTypesMasterStore } from 'src/app/stores/masters/bpm/storage-types.master.store';
import { StorageTypesService } from 'src/app/core/services/masters/bpm/storage-types.service';
import { RecordRetentionPoliciesService } from 'src/app/core/services/masters/bpm/record-retention-policies/record-retention-policies.service';
import { RecordRetentionPoliciesMasterStore } from 'src/app/stores/masters/bpm/record-retention-policies.master.store';
import { BackupAtOffsiteStatusesService } from 'src/app/core/services/masters/bpm/backup-at-offsite-statuses/backup-at-offsite-statuses.service';
import { BackupAtOffsiteStatusesMasterStore } from 'src/app/stores/masters/bpm/backup-at-offsite-statuses.master.store';
import { StorageLocationsService } from 'src/app/core/services/masters/bpm/storage-locations/storage-locations.service';
import { StorageLocationMasterStore } from 'src/app/stores/masters/bpm/storage-location.store';
import { PeriodicBackupService } from 'src/app/core/services/masters/bpm/periodic-backup/periodic-backup.service';
import { PeriodicBackupMasterStore } from 'src/app/stores/masters/bpm/periodic-backup.store';
import { FrequencyBackupService } from 'src/app/core/services/masters/bpm/frequency-backup/frequency-backup.service';
import { FrequencyBackupMasterStore } from 'src/app/stores/masters/bpm/frequency-backup.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';

declare var $: any;
@Component({
  selector: 'app-add-apr',
  templateUrl: './add-apr.component.html',
  styleUrls: ['./add-apr.component.scss']
})
export class AddAprComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('criteriaPopup') criteriaPopup: ElementRef;
  @ViewChild('objectivePopup') objectivePopup: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('locationMaster') locationMaster: ElementRef;
  @ViewChild('operationFreq') operationFreq: ElementRef;
  @ViewChild('arciCountModal') arciCountModal: ElementRef;
  @ViewChild('processModal') processModal: ElementRef;
  @ViewChild('appTypeModal') appTypeModal: ElementRef;
  @ViewChild('operationMode') operationMode: ElementRef;
  @ViewChild('accessibilityModal') accessibilityModal: ElementRef;
  @ViewChild('slaModal') slaModal: ElementRef;
  @ViewChild('supplierModal') supplierModal: ElementRef;
  @ViewChild('vitalModal') vitalModal: ElementRef;
  @ViewChild('assetModal') assetModal : ElementRef;

  AdvancePrStore = AdvancePrStore;
  AprDemoStore = AprDemoStore;
  LocationMasterStore = LocationMasterStore;
  HighAvailabilityStatusMasterStore = HighAvailabilityStatusMasterStore
  ProcessOperationFrequencyMasterStore = ProcessOperationFrequencyMasterStore
  RecordRetentionPoliciesMasterStore = RecordRetentionPoliciesMasterStore
  BackupAtOffsiteStatusesMasterStore = BackupAtOffsiteStatusesMasterStore
  ProcessAccessibilityMasterStore = ProcessAccessibilityMasterStore
  StorageLocationMasterStore = StorageLocationMasterStore
  OperationModesMasterStore = OperationModesMasterStore
  PeriodicBackupMasterStore = PeriodicBackupMasterStore
  FrequencyBackupMasterStore = FrequencyBackupMasterStore
  StorageTypesMasterStore = StorageTypesMasterStore;
  SlaStatusesMasterStore = SlaStatusesMasterStore
  DepartmentMasterStore = DepartmentMasterStore
  SuppliersMasterStore = SuppliersMasterStore
  AdvanceProcessStore = AdvanceProcessStore
  DepartmentStore = DepartmentMasterStore
  ProcessStore = ProcessStore
  UsersStore = UsersStore
  AuthStore = AuthStore
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;  
  form: FormGroup;
  formErrors: any;
  currentTab = 0;
  nextButtonText = "Next";
  previousButtonText = "Previous";
  formObject = {
    0:[
      'high_availabililty_status',
      'is_single_point_of_failure'

    ],
    1:[
      'total_number_of_staff'
    ],
    2:[],
    3:[],
    4:[
      // 'vital_record'
    ]
  }
  singlePointFailure=[
    {id:1, value: 'Yes'},
    {id:0, value: 'No'},
  ]
  arciObject = {
    component: 'Master',
    values: null,
    type: null
  };
  popupObject = {
    component: 'Master',
    values: null,
    type: null
  };
  applicationObject = {
    component: 'Master',
    values: null,
    type: null
  };

  assetObject = {
    component: 'Master',
    values: null,
    type: null
  };
  vitalObject = {
    component: 'Master',
    values: null,
    type: null
  };
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel',
    value:null
  };
  popupSubscription: any;
  applicationSubscription
  vitalSubscription
  locationMasterSubscription
  processOperationModeSubscriptionEvent: any;
  processAccessibilitySubscription: any;
  slaCOntractModalSubscription: any;
  RelatedProcessModalSubscription: any;
  supplierSubscription: any;
  ArciModalSubscription: any;
  cancelEventSubscription: any;
  is_populate_vital:boolean=false
  is_populate_app:boolean=false
  localAppArray = []
  localVitalArray = []
  pipe = new DatePipe('en-US');
  is_save: boolean=false;
  relatedProcessArray = [];
  processEmptyList = 'No Activities under this Process'
  assetModalSubscription: any;

  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _locationService:LocationService,
    private _usersService: UsersService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService: ImageServiceService,
    private _processOperationFrequencyService: ProcessOperationFrequencyService,
    private _recordRetentionPoliciesService:RecordRetentionPoliciesService,
    private _processOperationModesService: ProcessModesMasterService,
    private _highAvailabilityStatusService: HighAvialabilityStatusService,
    private _processAccessabilityService: ProcessAccessibilityService,
    private _BackupAtOffsiteStatusesService:BackupAtOffsiteStatusesService,
    private _periodicBackupService:PeriodicBackupService,
    private _FrequencyBackupService:FrequencyBackupService,
    private _slaStatusesService:SlaStatusesService,
    private _storageLocationService: StorageLocationsService,
    private _storageTypesService: StorageTypesService,
    private _aprService:AprService,
    private route: ActivatedRoute,
    private _processService: ProcessService,
    private _departmentService: DepartmentService,
    private _suppliersService: SuppliersService,
  ) { }

  ngOnInit(): void {
    
    $(document).ready(function(){
      $("#startId,#startIdButton,#endId,#endIdButton").click(function(){
         $(".cdk-overlay-container").css({ "font-position": "fixed","z-index": "9999999"});
       });
     });
    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      setTimeout(() => {
        this.form.pristine;
      }, 250);
    });
    
    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../' }

    ]);
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    }, 1000);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    window.addEventListener("scroll", this.scrollEvent, true);
    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })

    this.applicationSubscription = this._eventEmitterService.ApplicationTypeModal.subscribe(res=>{
      this.closeAppTypeModal()
    })

    this.vitalSubscription = this._eventEmitterService.VitalModal.subscribe(res=>{
      this.closeVitalModal()
    })

    this.locationMasterSubscription = this._eventEmitterService.locationMasterControl.subscribe(res=>{
      this.closeLocation()
    })
    this.popupSubscription = this._eventEmitterService.processOperationFrequency.subscribe(res => {
      this.closeOperationFreq();
    })

    this.processOperationModeSubscriptionEvent = this._eventEmitterService.processOperationMode.subscribe(res => {
      this.closeOperationMode();
    })

    this.processAccessibilitySubscription = this._eventEmitterService.processAccessibility.subscribe(res => {
			this.closeAccessibilityModal();
		})

    this.slaCOntractModalSubscription = this._eventEmitterService.slaCOntractModal.subscribe(res => {
			this.closeSlaModal();
		})

    this.RelatedProcessModalSubscription = this._eventEmitterService.bpmAssetModal.subscribe(res => {
      this.closeAssetModal();
    })

    this.assetModalSubscription = this._eventEmitterService.RelatedProcessModal.subscribe(res => {
      this.closeProcessModal();
    })

    this.supplierSubscription = this._eventEmitterService.supplier.subscribe(res => {
      this.closeSupplierModal();
    })

    this.ArciModalSubscription = this._eventEmitterService.ArciModal.subscribe(res => {
      this.closeArciCount();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        this.changeZIndex();
      }
    })
    this.form = this._formBuilder.group({
      normal_working_hours_from:[null],
      normal_working_hours_to:[null],
      peak_period_from:[null],
      peak_period_to:[null],
      operation_freq:[null],
      mode:[null],
      high_availabililty_status:[null,[Validators.required]],
      location:[null],
      is_single_point_of_failure:[null,[Validators.required]],
      cpo_description:[''],
      total_number_of_staff:['',[Validators.required]],
      accessibility:[null],
      // recovery_procedure_details:[''],
      sla_status:[null],
      primary_process_owner:[null],
      secondary_process_owner:[null],
      data_backup_owner:[null],
      rli_remark:[''],
      app_tools:[[],[Validators.required]],
      dependencies:[[],[Validators.required]],
      // dependencies_description:[''],
      internal_dependencies:[null],
      external_dependencies:[null],
      vital_record:[[],[Validators.required]]
    })
    AdvanceProcessStore.unSetApplicationFormTools();
    AdvanceProcessStore.unSetAssets();

    this.resetForm();
    this.getData()
    if (this._router.url.indexOf('edit-advanced-process-discovery') != -1) {
      this._utilityService.detectChanges(this._cdr);
      if (!ProcessStore.process_id)this._router.navigateByUrl('/bpm/process');
    }
    if(ProcessStore.process_id){
      this._processService.getItemById(ProcessStore.process_id).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
      this.getAdvanceProcessDiscovery()
    }
    if(AdvanceProcessStore._primaryProcessOwner){
      this.form.patchValue({
        primary_process_owner:AdvanceProcessStore._primaryProcessOwner,
      })
    }
    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);
  }

  getData(){
    this.getLocationMaster();
    this.getOperationFrequency();
    this.getOperationModes()
    this.getHighAvailablityStatus()
    this.getUsers()
    this.getSlaStatus()
    this.getProcessAccessibility()
    this.getProcessRecoveries()
    this.getDepartment()
    this.getExternalDependencies()
  }

  getAdvanceProcessDiscovery(){
    this._aprService.getProcessRecoveries().subscribe(res=>{
      if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.critical_operation){
        this.setCriticalProcessOperation()
      }
      if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.resource_level_information){
        this.setResourceLevelInformation()
      }
      if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.process_application_tools){
        this.setApplicationAndTools()
      }
      if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.process_assets){
        this.setAssetData()
      }
      if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.process_dependency){
        this.setDependencies()
      }
      if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.process_vital_record){
        this.form.patchValue({
          vital_record:AdvanceProcessStore.advanceProcessDiscovery?.process_vital_record
        })
      }
    })
  }

  getFrequencyBackup(event:any=null) {
    this._FrequencyBackupService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getPeriodicBackup(event:any=null) {
    this._periodicBackupService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getStorageLocation(event:any=null) {
    this._storageLocationService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getBackupAtOffsite(event:any=null) {
    this._BackupAtOffsiteStatusesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getRecordRetentionPolicy(event:any=null) {
    this._recordRetentionPoliciesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getStorageType(event:any=null) {
    this._storageTypesService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setRelatedProcess(){
    let savedData
    if(AdvanceProcessStore.savedDependencies.length!=0){
      this.relatedProcessArray = []
      AdvanceProcessStore.processWithActivities.forEach(process=>{
        AdvanceProcessStore.savedDependencies.forEach(saved=>{
          if(process.id == saved.related_process_id){
              let savedData={
              related_process:{
                title:'',
                reference_code:''
              },
              dependancy_related_process_activities:[],
              is_accordion_active:false
            }
            savedData.related_process["title"]=process.title
            savedData.related_process["reference_code"]=process.reference_code
            if(saved.process_activity_ids.length!=0){
              saved.process_activity_ids.forEach(activityId=>{
                if(process.process_activities.length!=0){
                  process.process_activities.forEach(processActivity=>{
                    if(activityId == processActivity.id){
                      let actData = {
                        id:processActivity.id,
                        title:processActivity.title
                      }
                      savedData.dependancy_related_process_activities.push(actData)
                    }
                  })
                }
              })
            }
            this.relatedProcessArray.push(savedData)
            this.form.patchValue({
              dependencies:this.relatedProcessArray
            })
          }
        })
      })
    }
  }

  // setVitalRecord(){
  //   let vital = AdvanceProcessStore.advanceProcessDiscovery.process_vital_record
  //   this.form.patchValue({
  //     vital_record_name:vital.title,
  //     storage_type:vital.storage_type.id,
  //     storage_location:vital.storage_location.id,
  //     backup_storage:vital.backup_storage_location.id,
  //     person_responsible:vital.backup_responsible_user,
  //     periodic_backup:vital.periodic_backup.id,
  //     frequancy_backup:vital.backup_freequency.id,
  //     backup_offsite:vital.backup_at_offsite_status.id,
  //     details_backup_offsite:vital.offsite_backup_details,
  //     record_retention_policy:vital.record_retension_policy.id,
  //     single_point_failure:vital.is_single_point_of_failure,
  //     is_fireproof_cabin:vital.is_fireproof_cabin,
  //   })
  // }

  setDependencies(){
    this.relatedProcessArray = []
    let dep = AdvanceProcessStore.advanceProcessDiscovery.process_dependency
    this.form.patchValue({
      // dependencies_description:dep.dependency_description,
      internal_dependencies:dep.departments ? this.setArray(dep.departments) : [],
      external_dependencies:dep.suppliers ? this.setArray(dep.suppliers) : [],
    })
    dep.related_processes.forEach(res=>{
      this.relatedProcessArray.push(res)
    })
    setTimeout(() => {
      if(this.relatedProcessArray.length!=0){
        this.form.patchValue({
          dependencies:this.relatedProcessArray
        })
      }
    }, 150);
  }

  accordianClick(index){
    // if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery.process_dependency){
    //   let process = AdvanceProcessStore.advanceProcessDiscovery.process_dependency.related_processes
    // }
    
    for (let i = 0; i < this.relatedProcessArray.length; i++) {
      const element = this.relatedProcessArray[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
      if(AdvanceProcessStore.process_index!=index){
        AdvanceProcessStore.process_index = index;
      }else{
        AdvanceProcessStore.process_index = null;
      }
    }
  }

  applicationAccordianClick(index){
    let application = AdvanceProcessStore.applicationFormTools
    for (let i = 0; i < application.length; i++) {
      const element = application[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
      if(AdvanceProcessStore.process_index!=index){
        AdvanceProcessStore.process_index = index;
      }else{
        AdvanceProcessStore.process_index = null;
      }
    }
  }

  assetAccordianClick(index){
    let application = AdvanceProcessStore.assets
    for (let i = 0; i < application.length; i++) {
      const element = application[i];
      if(i==index){
        element["is_asset_active"]=!element["is_asset_active"]
      }else{
        element["is_asset_active"]= false
      }
      if(AdvanceProcessStore.process_index!=index){
        AdvanceProcessStore.process_index = index;
      }else{
        AdvanceProcessStore.process_index = null;
      }
    }
  }

  getProcessRecoveries(){
    this._aprService.getProcessWithActivities().subscribe(res=>{
      this.setRelatedProcess()
    })
  }

  getExternalDependencies(newPage: number = null) {
    if (newPage) SuppliersMasterStore.setCurrentPage(newPage);
    this._suppliersService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchDepartment(e,formValue:boolean=false) {
      this._departmentService.getItems(false, '&q=' + (e.term?e.term:e)).subscribe(res => {
        if(formValue){
          const index: number = res['data'].findIndex(r => r.id == (e.term?e.term:e));
        }
        this._utilityService.detectChanges(this._cdr);
      });
  }

  // Get Department
  getDepartment() {
      this._departmentService.getItems(false).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  passSaveFormatDate(date)
  {
   const fromdate = this.pipe.transform(date, 'HH:mm:ss');
   return fromdate;
  }

  getSlaStatus(newPage: number = null) {
		if (newPage) SlaStatusesMasterStore.setCurrentPage(newPage);
		this._slaStatusesService.getItems(false,'&limit=1000').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

  getProcessAccessibility(newPage: number = null) {
    if (newPage) ProcessAccessibilityMasterStore.setCurrentPage(newPage);
    this._processAccessabilityService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getOperationFrequency(newPage: number = null) {
    if (newPage) ProcessOperationFrequencyMasterStore.setCurrentPage(newPage);
    this._processOperationFrequencyService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this.passSaveFormatDate(this.form.value.normal_working_hours_from)
  }

  getOperationModes(newPage: number = null) {
    if (newPage) OperationModesMasterStore.setCurrentPage(newPage);
    this._processOperationModesService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getHighAvailablityStatus(newPage: number = null) {
    if (newPage) OperationModesMasterStore.setCurrentPage(newPage);
    this._highAvailabilityStatusService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  setCriticalProcessOperation(){
    let cpo = AdvanceProcessStore.advanceProcessDiscovery?.critical_operation
    this.form.patchValue({
      normal_working_hours_from: cpo?.normal_working_hour_start_time?new Date(0,0,0,this._helperService.formatTimer(cpo?.normal_working_hour_start_time).hour, this._helperService.formatTimer(cpo?.normal_working_hour_start_time).minute):null,
      normal_working_hours_to:cpo?.normal_working_hour_end_time?new Date(0,0,0,this._helperService.formatTimer(cpo?.normal_working_hour_end_time).hour, this._helperService.formatTimer(cpo?.normal_working_hour_end_time).minute):null,
      peak_period_from:cpo?.peak_period_start_time?new Date(0,0,0,this._helperService.formatTimer(cpo?.peak_period_start_time).hour, this._helperService.formatTimer(cpo?.peak_period_start_time).minute):null,
      peak_period_to:cpo?.peak_period_end_time?new Date(0,0,0,this._helperService.formatTimer(cpo?.peak_period_end_time).hour, this._helperService.formatTimer(cpo?.peak_period_end_time).minute):null,
      operation_freq:cpo?.process_operation_frequency?.id?cpo?.process_operation_frequency?.id:null,
      mode:cpo.process_operation_mode?.id?cpo.process_operation_mode?.id:null,
      high_availabililty_status:cpo.high_availability_status?.id?cpo.high_availability_status?.id:null,
      location:cpo.location?.id?cpo.location?.id:null,
      is_single_point_of_failure:cpo.is_single_point_of_failure,
      cpo_description:cpo.description
    })
  }

  setResourceLevelInformation(){
    let rli = AdvanceProcessStore.advanceProcessDiscovery.resource_level_information
    this.form.patchValue({
      total_number_of_staff:rli.total_number_of_staff,
      accessibility:rli.process_accessibility?.id?rli.process_accessibility?.id:null,
      // recovery_procedure_details:rli.recovery_procedure_details,
      sla_status:rli.sla_status?.id?rli.sla_status?.id:null,
      primary_process_owner:rli.primary_process_owner,
      secondary_process_owner:rli.secondary_process_owner,
      data_backup_owner:rli.data_backup_owner,
      rli_remark:rli.remarks
    })
  }

  applicationEdit(application){
    this.applicationObject.values={
      software_id:application.software_id,
      type_id:application.type_id,
      reason:application.pivot.description
    }
    this.applicationObject.type = "edit"
    this._utilityService.detectChanges(this._cdr);
    $(this.appTypeModal.nativeElement).modal('show');
  }

  assetEdit(assets){
    this.assetObject.values={
      title:assets.title,
      id:assets.id,
      description:assets.description,
      asset_category:assets.asset_category,
      asset_type:assets.asset_type,
    }
    this.assetObject.type = "edit"
    this._utilityService.detectChanges(this._cdr);
    $(this.assetModal.nativeElement).modal('show');
  }

  setApplicationAndTools(){
    let app = AdvanceProcessStore.advanceProcessDiscovery.process_application_tools
    for (let i = 0; i < app.length; i++) {
      const element = app[i];
      let appTypeObject = {
        type_id:element.business_application_type_id,
        software_id:element.id,
        describe_reason:element.description,
        qty_in_use:element.quantity,
        maintainance_contract:element.is_amc,
        type:element.business_application_type.language[0].pivot.title,
        software_name:element.title,
        is_accordion_active:false,
        pivot:{
          description:element.pivot.description
        }
      }
      this.AdvanceProcessStore.setApplicationFormTools(appTypeObject)
      this.AdvanceProcessStore.setApplicationTools(appTypeObject)
    }
    setTimeout(() => {
      this.form.patchValue({
        app_tools:AdvanceProcessStore.applicationFormTools
      })
    }, 200);
  }

  setAssetData(){
    let asset = AdvanceProcessStore.advanceProcessDiscovery.process_assets
    for (let i = 0; i < asset.length; i++) {
      const element = asset[i];
      let appTypeObject = {
        id:element.id,
        title:element.title,
        description:element.pivot.description,
        asset_category : element.asset_category,
        asset_type: element.asset_type
      }
      this.AdvanceProcessStore.setAssets(appTypeObject)
      // this.AdvanceProcessStore.setApplicationTools(appTypeObject)
    }

  }

  setArray(arrays){
    let array = [];
    for (let i of arrays) {
      array.push(i.id);
    }
    return array;
  }

  addVitalRecord(){
    let vitalObjects = {
      vital_record_name:this.form.value.vital_record_name,
      storage_type:this.form.value.storage_type,
      storage_location:this.form.value.storage_location,
      backup_storage:this.form.value.backup_storage,
      person_responsible:this.form.value.person_responsible,
      periodic_backup:this.form.value.periodic_backup,
      frequancy_backup:this.form.value.frequancy_backup,
      backup_offsite:this.form.value.backup_offsite,
      details_backup_offsite:this.form.value.details_backup_offsite,
      record_retention_policy:this.form.value.record_retention_policy,
      availability_storing_documents:this.form.value.availability_storing_documents,
      recovery_verififcarion_process:this.form.value.recovery_verififcarion_process,
      single_point_failure:this.form.value.single_point_failure,
    }
    this.localVitalArray.push(vitalObjects)
    this.AdvancePrStore.setVitalRecords(vitalObjects)
    this.is_populate_vital = true;
    this.resetVitalObjects()
  }

  resetVitalObjects(){
    this.form.patchValue({
      vital_record_name:'',
      storage_type:null,
      storage_location:null,
      backup_storage:null,
      person_responsible:null,
      periodic_backup:null,
      frequancy_backup:null,
      backup_offsite:null,
      details_backup_offsite:'',
      record_retention_policy:null,
      availability_storing_documents:null,
      recovery_verififcarion_process:null,
      single_point_failure:null,
    })
  }

  addApplicationType(){
    let appTypeObject = {
      type:this.form.value.type,
      software_name:this.form.value.software_name,
      describe_reason:this.form.value.describe_reason,
      qty_in_use:this.form.value.qty_in_use,
      maintainance_contract:this.form.value.maintainance_contract
    }
    this.localAppArray.push(appTypeObject)
    this.AdvancePrStore.setApplicationTools(appTypeObject)
    this.is_populate_app = true
    this.resetAppForm()
  }

  resetAppForm(){
    this.form.patchValue({
      type:null,
      software_name:null,
      describe_reason:'',
      qty_in_use:'',
      maintainance_contract:null
    })
  }

  setDefined(event){
    this.form.patchValue({
      is_defined:event.target.checked
    })
  }

  setMonitored(event){
    this.form.patchValue({
      is_monitored:event.target.checked
    })
  }

  setNotAvailable(event){
    this.form.patchValue({
      is_not_available:event.target.checked
    })
  }

  cancelByUser(status) {
    if (status) {
      if(this.confirmationObject.type=='Cancel'){
        if(ProcessStore.process_id){
          this._router.navigateByUrl('/bpm/process/' + ProcessStore.process_id + '/advanced-process-discovery');
        }else{
          this._router.navigateByUrl('/bpm/process');
        }
      }
      if(this.confirmationObject.value&&this.confirmationObject.value.type=='App'){
        this.removeApplication()
      }
      if(this.confirmationObject.value&&this.confirmationObject.value.type=='Asset'){
        this.removeAssets()
      }

      if(this.confirmationObject.value&&this.confirmationObject.value.type=='Dependencies'){
        this.removeDependencies()
      }

      if(this.confirmationObject.value&&this.confirmationObject.value.type=='Process'){
        this.removeProcess()
      }

      if(this.confirmationObject.value&&this.confirmationObject.value.type=='vital'){
        this.removeVital()
      }

    } else {
      
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  removeApplication(){
    AdvanceProcessStore.applicationFormTools.splice(this.confirmationObject?.value?.index,1)
    AdvanceProcessStore.applicationTools.splice(this.confirmationObject?.value?.index,1)
    this.form.patchValue({
      app_tools:AdvanceProcessStore.applicationFormTools
    })
    setTimeout(() => {
      this.saveApplicationTools()
    }, 50);
  }

  removeAssets(){
    AdvanceProcessStore.assets.splice(this.confirmationObject?.value?.index,1)
    // AdvanceProcessStore.assets.splice(this.confirmationObject?.value?.index,1)
    // this.form.patchValue({
    //   app_tools:AdvanceProcessStore.applicationFormTools
    // })
    setTimeout(() => {
      this.saveAssets()
    }, 50);
  }

  removeDependencies(){
    this.relatedProcessArray.splice(this.confirmationObject?.value?.index,1)
    this.form.patchValue({
      app_tools:this.relatedProcessArray
    })
  }

  deleteProcess(ind:number,id){
    // this.relatedProcessArray.splice(ind,1)
    // AdvanceProcessStore.savedDependencies.splice(ind,1)
    this.confirmationObject.type="Delete"
    this.confirmationObject.value={
      type:'Dependencies',
      index:ind,
      id:id
    }
    $(this.cancelPopup.nativeElement).modal('show');
  }

  deleteApp(ind:number){
    this.confirmationObject.type="Delete"
    this.confirmationObject.value={
      type:'App',
      index:ind
    }
    $(this.cancelPopup.nativeElement).modal('show');
  }

  deleteAssets(ind:number){
    this.confirmationObject.type="Delete"
    this.confirmationObject.value={
      type:'Asset',
      index:ind
    }
    $(this.cancelPopup.nativeElement).modal('show');
  }

  removeVital(){
    this._aprService.deleteVital(this.confirmationObject.value.index).subscribe(res=>{

    })
  }

  deleteVital(ind:number){
    this.confirmationObject.type="Delete"
    this.confirmationObject.value={
      type:'vital',
      index:ind
    }
    $(this.cancelPopup.nativeElement).modal('show');
  }

  getUsers() {
    var params = '';
    // if (this.regForm.value.id) {
    //   params = params ? params + '&exclude=' + this.regForm.value.id : params + '?exclude=' + this.regForm.value.id;
    // }
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUers(e) {
    let params = '';
    if (this.form.value.id)
      params = params + '&exclude=' + this.form.value.id;
    this._usersService.searchUsers('?q=' + e.term + (params ? params : '')).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  createImagePreview(token) {
    return this._imageService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getLocationMaster(newPage: number = null) {
    this._locationService.getItems(false,'&limit=1000',false).subscribe(res => {
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  showAppTypeModal(){
    this.applicationObject.type = "app",
    this.applicationObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.appTypeModal.nativeElement).modal('show');
  }

  closeAppTypeModal(){
    if(AdvanceProcessStore.applicationFormTools.length!=0){
      this.form.patchValue({
        app_tools:AdvanceProcessStore.applicationFormTools
      })
    }
    this.applicationObject.type = null,
    this.applicationObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.appTypeModal.nativeElement).modal('hide');
  }


  showAseetModal(){
    this.assetObject.type = "app",
    this.assetObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.assetModal.nativeElement).modal('show');
  }

  closeAssetModal(){
    // if(AdvanceProcessStore.applicationFormTools.length!=0){
    //   this.form.patchValue({
    //     app_tools:AdvanceProcessStore.applicationFormTools
    //   })
    // }
    this.assetObject.type = null,
    this.assetObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.assetModal.nativeElement).modal('hide');
  }


  vitalRecordEdit(vital){
    this.vitalObject.values={
      id:vital.id,
      title:vital.title?vital.title:'',
      storage_type:vital.storage_type?.id,
      storage_location:vital.storage_location?.id,
      backup_storage:vital.backup_storage_location?.id,
      backup_responsible_user:vital.backup_responsible_user,
      periodic_backup:vital.periodic_backup?.id,
      backup_freequency:vital.backup_freequency?.id,
      backup_at_offsite_status:vital.backup_at_offsite_status?.id,
      offsite_backup_details:vital.offsite_backup_details?vital.offsite_backup_details:'',
      record_retension_policy:vital.record_retension_policy?.id,
      is_fireproof_cabin:vital.is_fireproof_cabin,
      is_single_point_of_failure:vital.is_single_point_of_failure
    }
    this.vitalObject.type = "edit"
    this._utilityService.detectChanges(this._cdr);
    $(this.vitalModal.nativeElement).modal('show');
  }

  showVitalModal(){
    this.vitalObject.type = "app",
    this.vitalObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.vitalModal.nativeElement).modal('show');
  }

  closeVitalModal(){
    this.getAdvanceProcessDiscovery()
    this.vitalObject.type = null,
    this.vitalObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.vitalModal.nativeElement).modal('hide');
  }

  showProcessModal(){
    this.popupObject.type = "dependencies",
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.processModal.nativeElement).modal('show');
  }

  closeProcessModal(){
    this.setRelatedProcess()
    this.popupObject.type = null,
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.processModal.nativeElement).modal('hide');
  }

  showArciCount(){
    this.arciObject.type = "add",
    this.arciObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.arciCountModal.nativeElement).modal('show');
  }

  closeArciCount(){
    this.arciObject.type = null,
    this.arciObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.arciCountModal.nativeElement).modal('hide');
  }

  addLocation(){
    this.popupObject.type = "Add",
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.locationMaster.nativeElement).modal('show');
  }

  addOperationFreq(){
    this.popupObject.type = "Add",
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.operationFreq.nativeElement).modal('show');
  }

  addOperationMode(){
    this.popupObject.type = "Add",
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.operationMode.nativeElement).modal('show');
  }

  addAccessibilityModal(){
    this.popupObject.type = "Add",
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.accessibilityModal.nativeElement).modal('show');
  }

  addSla(){
    this.popupObject.type = "Add",
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.slaModal.nativeElement).modal('show');
  }

  closeSlaModal(){
    if(SlaStatusesMasterStore.lastInsertedId){
      this.setSla({term: ProcessAccessibilityMasterStore.lastInsertedId},true);
    }
    this.popupObject.type = '';
    this._utilityService.detectChanges(this._cdr);
    $(this.slaModal.nativeElement).modal('hide');
  }

  showSupplierModal(){
    this.popupObject.type = "Add",
    this.popupObject.values = null;
    this._utilityService.detectChanges(this._cdr);
    $(this.supplierModal.nativeElement).modal('show');
  }

  closeAccessibilityModal(){
    if(ProcessAccessibilityMasterStore.lastInsertedId) {
      this.setAccessibility({term: ProcessAccessibilityMasterStore.lastInsertedId},true);
    }
    this.popupObject.type = '';
    this._utilityService.detectChanges(this._cdr);
    $(this.accessibilityModal.nativeElement).modal('hide');
  }

  closeSupplierModal(){
    if(SuppliersMasterStore.lastInsertedId) {
      this.setSupplier({term: SuppliersMasterStore.lastInsertedId},true);
    }
    this.popupObject.type = '';
    this._utilityService.detectChanges(this._cdr);
    $(this.supplierModal.nativeElement).modal('hide');
  }

  closeOperationMode(){
    if(OperationModesMasterStore.lastInsertedId) {
      this.setOperationMode({term: OperationModesMasterStore.lastInsertedId},true);
    }
    this.popupObject.type = '';
    this._utilityService.detectChanges(this._cdr);
    $(this.operationMode.nativeElement).modal('hide');
  }

  closeOperationFreq(){
    if(ProcessOperationFrequencyMasterStore.lastInsertedId) {
      this.setOperationFreq({term: ProcessOperationFrequencyMasterStore.lastInsertedId},true);
    }
    this.popupObject.type = '';
    this._utilityService.detectChanges(this._cdr);
    $(this.operationFreq.nativeElement).modal('hide');
  }

  closeLocation(){
    if(LocationMasterStore.lastInsertedId) {
      this.setLocation({term: LocationMasterStore.lastInsertedId},true);
    }
    this.popupObject.type = '';
    this._utilityService.detectChanges(this._cdr);
    $(this.locationMaster.nativeElement).modal('hide');
  }

  setSla(e,patchValue:boolean = false){
    this._slaStatusesService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { sla_status:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setSupplier(e,patchValue:boolean = false){
    var array=[]
    this._suppliersService.getItems(false,'q='+e.term).subscribe((res) =>{
      SuppliersMasterStore.allItems.forEach(element=>{
        if(element.id == e.term){
          if(this.form.value.external_dependencies&&this.form.value.external_dependencies.length!=0){
            setTimeout(() => {
              array = this.form.value.external_dependencies
              array.push(element.id)
              this.form.patchValue({
                external_dependencies:array
              })
              this._utilityService.detectChanges(this._cdr);
            }, 100);
          }else{
            array.push(element.id)
            this.form.patchValue({
              external_dependencies:array
            })
          }
        }
      })
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setAccessibility(e,patchValue:boolean = false){
    this._processAccessabilityService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { accessibility:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setOperationFreq(e,patchValue:boolean = false){
    this._processOperationFrequencyService.getItems(false,'&q='+e.term).subscribe((res) =>{
      ProcessOperationFrequencyMasterStore.processOperationFrequency.forEach(elem=>{
        if(elem.id==e.term){
          this.form.patchValue({ 
            operation_freq:elem.id
          })
        }
      })
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setOperationMode(e,patchValue:boolean = false){
    this._processOperationModesService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { mode:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setLocation(e,patchValue:boolean = false){
    this._locationService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { location:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  saveAdvancedProcess(){
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";
    this.formErrors = null;
    if(this.form.value){
      this.AdvancePrStore.setAdvanceProcessRecovery(this.form.value)
      this.resetForm();
      this.localAppArray=[]
      this.localVitalArray = []
      this.is_populate_vital = false
      this.is_populate_app = false
      if(ProcessStore.process_id){
        this._router.navigateByUrl('/bpm/process/' + ProcessStore.process_id + '/advanced-process-discovery');
      }else{
        this._router.navigateByUrl('/bpm/process');
      }
    }
  }

  appDetailsArray(){
    let appArray = []
    AdvanceProcessStore.applicationFormTools.forEach(res=>{
      let appData = {
        business_application_id:res.software_id,
        description:res.describe_reason
      }
      appArray.push(appData)
    })
    return appArray
  }

  processApplicationTools(){
    let saveData = {
      process_id:ProcessStore.process_id,
      business_applications:this.appDetailsArray()
    }
    return saveData
  }

  assetData(){
    let saveData = {
      process_id:ProcessStore.process_id,
      process_assets:this.processAssetsData()
    }
    return saveData
  }
  

 

  processAssetsData(){

    let appArray = []
    AdvanceProcessStore.assets.forEach(res=>{
      let appData = {
        asset_id:res.id,
        description:res.description,
        
      }
      appArray.push(appData)
    })
    return appArray
  }

  saveAssets(){
    this._utilityService.hideSuccessMessage()
    setTimeout(() => {
      if(AdvanceProcessStore.advanceProcessDiscovery.process_application_tools){
        this._aprService.updateAssets(ProcessStore.process_id,this.assetData()).subscribe(res=>{

        })
      }else{
        this._aprService.saveAssets(this.assetData()).subscribe(res=>{
        
        })
      }
    }, 150);
  }

  saveApplicationTools(){
    this._utilityService.hideSuccessMessage()
    setTimeout(() => {
      let saveApp = this.processApplicationTools()
      if(AdvanceProcessStore.advanceProcessDiscovery.process_application_tools){
        this._aprService.updateApplicationTools(ProcessStore.process_id,saveApp).subscribe(res=>{

        })
      }else{
        this._aprService.savApplicationTools(saveApp).subscribe(res=>{
        
        })
      }
    }, 150);
  }

  processResourceLevelInfoData(){
    let saveData = {
      process_id:ProcessStore.process_id,
      process_accessibility_id: this.form.value.accessibility,
      sla_status_id:this.form.value.sla_status,
      primary_process_owner_id:this.form.value.primary_process_owner?this.form.value.primary_process_owner.id:null,
      secondary_process_owner_id:this.form.value.secondary_process_owner?this.form.value.secondary_process_owner.id:null,
      data_backup_owner_id:this.form.value.data_backup_owner?this.form.value.data_backup_owner.id:null,
      total_number_of_staff:this.form.value.total_number_of_staff,
      // recovery_procedure_details:this.form.value.recovery_procedure_details,
      remarks:this.form.value.rli_remark,
    }
    return saveData
  }

  saveResourceLevInfo(){
    this._utilityService.hideSuccessMessage()
    setTimeout(() => {
      let save = this.processResourceLevelInfoData()
      if(AdvanceProcessStore.advanceProcessDiscovery.resource_level_information){
        this._aprService.updateResourceLevelInformation(AdvanceProcessStore.advanceProcessDiscovery.resource_level_information.id,save).subscribe(res=>{
        
        })
      }else{
        this._aprService.saveResourceLevelInformation(save).subscribe(res=>{
        
        })
      }
    }, 150);
  }

  processCriticalData(){
    let saveData = {
      process_id: ProcessStore.process_id,
      process_operation_frequency_id:this.form.value.operation_freq,
      process_operation_mode_id:this.form.value.mode,
      high_availability_status_id:this.form.value.high_availabililty_status,
      location_id:this.form.value.location,
      is_single_point_of_failure:this.form.value.is_single_point_of_failure,
      normal_working_hour_start_time:this.passSaveFormatDate(this.form.value.normal_working_hours_from),
      normal_working_hour_end_time:this.passSaveFormatDate(this.form.value.normal_working_hours_to),
      peak_period_start_time:this.passSaveFormatDate(this.form.value.peak_period_from),
      peak_period_end_time:this.passSaveFormatDate(this.form.value.peak_period_to),
      description:this.form.value.cpo_description?this.form.value.cpo_description:''
    }
    return saveData
  }

  saveCriticalProcess(){
    this._utilityService.hideSuccessMessage()
    setTimeout(() => {
      let save = this.processCriticalData()
      if(AdvanceProcessStore.advanceProcessDiscovery.critical_operation){
        this._aprService.updateProcessOperations(AdvanceProcessStore.advanceProcessDiscovery.critical_operation.id,save).subscribe(res=>{
        
        })
      }else{
        this._aprService.saveProcessOperations(save).subscribe(res=>{
        
        })
      }
    }, 150);
  }

  removeProcess(){
    
  }

  relatedProcessArrayFormation(){
    if(AdvanceProcessStore.savedDependencies.length!=0){
      return AdvanceProcessStore.savedDependencies
    }else{
      let relatedProcess = []
      this.relatedProcessArray.forEach(res=>{
        let saveData={
          related_process_id:res.related_process_id?res.related_process_id:'',
          process_activity_ids:[]
        }
        if(res.dependancy_related_process_activities.length!=0){
          res.dependancy_related_process_activities.forEach(element => {
            saveData.process_activity_ids.push(element.id)
          });
        }
        relatedProcess.push(saveData)
      })
      return relatedProcess
    }
  }

  processDependencies(){
    let saveData = {
      process_id:ProcessStore.process_id,
      related_processes:this.relatedProcessArrayFormation(),
      // description:this.form.value.dependencies_description,
      internal_dependencies:this.form.value.internal_dependencies,
      external_dependencies:this.form.value.external_dependencies
    }
    return saveData
  }

  saveDependencies(){
    this._utilityService.hideSuccessMessage()
    setTimeout(() => {
      let save = this.processDependencies()
      if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.process_dependency){
        this._aprService.updateDependencies(ProcessStore.process_id,save).subscribe(res=>{
        
        })
      }else{
        this._aprService.saveDependencies(save).subscribe(res=>{
        
        })
      }
    }, 150);
  }

  processVitalRecords(){
    let saveData = {
      process_id:ProcessStore.process_id,
      title:this.form.value.vital_record_name,
      storage_type_id:this.form.value.storage_type,
      storage_location_id:this.form.value.storage_location,
      backup_storage_location_id:this.form.value.backup_storage,
      backup_responsible_user_id:this.form.value.person_responsible?this.form.value.person_responsible.id:null,
      backup_frequency_id:this.form.value.frequancy_backup,
      backup_at_offsite_status_id:this.form.value.backup_offsite,
      record_retention_policy:this.form.value.record_retention_policy,
      periodic_backup_id:this.form.value.periodic_backup,
      offsite_backup_details:this.form.value.details_backup_offsite,
      is_fireproof_cabin:this.form.value.is_fireproof_cabin==1?true:false,
      is_single_point_of_failure:this.form.value.single_point_failure==1?true:false
    }
    return saveData
  }

  vitalAccordianClick(index){
    let vital = AdvanceProcessStore.advanceProcessDiscovery?.process_vital_record
    for (let i = 0; i < vital.length; i++) {
      const element = vital[i];
      if(i==index){
        element["is_accordion_active"]=!element["is_accordion_active"]
      }else{
        element["is_accordion_active"]= false
      }
    }
  }

  saveVitalRecords(){
    let save = this.processVitalRecords()
    // if(AdvanceProcessStore.advanceProcessDiscovery&&AdvanceProcessStore.advanceProcessDiscovery?.process_vital_record){
    //   this._aprService.updateVitalRecords(AdvanceProcessStore.advanceProcessDiscovery?.process_vital_record.id,save).subscribe(res=>{
      
    //   })
    // }else{
    //   this._aprService.saveVitalRecords(save).subscribe(res=>{
      
    //   })
    // }
  }

// ================= TAB SETTINGS =====================
  saveTabDetails(){
    if(this.currentTab==0)this.saveCriticalProcess();
    if(this.currentTab==1)this.saveResourceLevInfo();
    if(this.currentTab==2)this.saveAssets()
    if(this.currentTab==3)this.saveDependencies();
    if(this.currentTab==4)this.saveVitalRecords();
  }
  nextPrev(n,status:boolean=false) {
    this.is_save = status
    var x: any = document.getElementsByClassName("tab");
    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
        if(this.currentTab==3&&status)this.saveDependencies()
        if(this.currentTab==4){
          this.saveVitalRecords()
        }
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    this.currentTab = this.currentTab + n;
    if (this.currentTab >= x.length) {
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.saveAdvancedProcess()
      return false;
    }
    this.showTab(this.currentTab);
  }

  showTab(n) {
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    if (this.currentTab == 4) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == x.length - 1) {
      // this.saveDependencies();
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
    } else {
      if(n==1 && this.is_save){
        this.saveCriticalProcess();
      }

      if(n==2 && this.is_save){
        this.saveResourceLevInfo();
      }
      if(n==3 && this.is_save){
        this.saveAssets();
      }
      if(this.currentTab==4 && this.is_save || n==4 && this.is_save){
        this.saveDependencies();
      }
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
    }
    this.fixStepIndicator(n);
  }

  fixStepIndicator(n) {
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    if (x[n]) x[n].className += " active";
  }

  // Setting Intial Tab

  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");

    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  changeStep(step){
    if(step > this.currentTab && this.checkFormObject(step)){
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if(step < this.currentTab){
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }  
  }

  checkFormObject(tabNumber?:number){
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          if(!this.form.controls[i]?.valid){
            setValid = false;
            break;
          }
        }
      }
    }
    else{
      for(var i = 0; i < tabNumber; i++){
        if(this.formObject.hasOwnProperty(i)){
          for(let k of this.formObject[i]){
            if(!this.form.controls[k]?.valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

// ================= END TAB SETTINGS =====================

confirmCancel() {
  this.confirmationObject.type="Cancel"
  this.confirmationObject.title = 'Cancel?';
  this.confirmationObject.subtitle = 'apr_cancel_confirmation'
  setTimeout(() => {
    $(this.cancelPopup.nativeElement).modal('show');
  }, 100);
}

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  changeZIndex(){
    if($(this.criteriaPopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.criteriaPopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.criteriaPopup.nativeElement,'overflow','auto');
    }
    else if($(this.objectivePopup.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.objectivePopup.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.objectivePopup.nativeElement,'overflow','auto');
    }
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();    
    AdvanceProcessStore.unSetsavedDependencies()
    SubMenuItemStore.makeEmpty();
    this.popupSubscription.unsubscribe()
    this.cancelEventSubscription.unsubscribe()
    this.idleTimeoutSubscription.unsubscribe()
    this.networkFailureSubscription.unsubscribe()
    this.processOperationModeSubscriptionEvent.unsubscribe()
    this.applicationSubscription.unsubscribe()
    this.vitalSubscription.unsubscribe()
    this.locationMasterSubscription.unsubscribe()
    this.processAccessibilitySubscription.unsubscribe()
    this.slaCOntractModalSubscription.unsubscribe()
    this.RelatedProcessModalSubscription.unsubscribe()
    this.supplierSubscription.unsubscribe()
    this.ArciModalSubscription.unsubscribe()
  }

}
