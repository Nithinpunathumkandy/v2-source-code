import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AprService } from 'src/app/core/services/bpm/advanced-process/apr.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { BusinessApplicationTypesService } from 'src/app/core/services/masters/bcm/business-application-types.service';
import { BusinessApplicationsService } from 'src/app/core/services/masters/bcm/business-applications/business-applications.service';
import { BackupAtOffsiteStatusesService } from 'src/app/core/services/masters/bpm/backup-at-offsite-statuses/backup-at-offsite-statuses.service';
import { FrequencyBackupService } from 'src/app/core/services/masters/bpm/frequency-backup/frequency-backup.service';
import { HighAvialabilityStatusService } from 'src/app/core/services/masters/bpm/high-availability-status/high-avialability-status.service';
import { PeriodicBackupService } from 'src/app/core/services/masters/bpm/periodic-backup/periodic-backup.service';
import { ProcessAccessibilityService } from 'src/app/core/services/masters/bpm/process-accessibility/process-accessibility.service';
import { ProcessModesMasterService } from 'src/app/core/services/masters/bpm/process-modes/process-modes-master.service';
import { RecordRetentionPoliciesService } from 'src/app/core/services/masters/bpm/record-retention-policies/record-retention-policies.service';
import { StorageLocationsService } from 'src/app/core/services/masters/bpm/storage-locations/storage-locations.service';
import { StorageTypesService } from 'src/app/core/services/masters/bpm/storage-types.service';
import { AprDemoStore } from 'src/app/modules/bpm/apr-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { AdvancePrStore } from 'src/app/stores/bpm/process/adavanc-pr-store';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { BackupAtOffsiteStatusesMasterStore } from 'src/app/stores/masters/bpm/backup-at-offsite-statuses.master.store';
import { FrequencyBackupMasterStore } from 'src/app/stores/masters/bpm/frequency-backup.store';
import { PeriodicBackupMasterStore } from 'src/app/stores/masters/bpm/periodic-backup.store';
import { ProcessAccessibilityMasterStore } from 'src/app/stores/masters/bpm/process-accesibility.store';
import { OperationModesMasterStore } from 'src/app/stores/masters/bpm/process-operation-modes.store';
import { RecordRetentionPoliciesMasterStore } from 'src/app/stores/masters/bpm/record-retention-policies.master.store';
import { StorageLocationMasterStore } from 'src/app/stores/masters/bpm/storage-location.store';
import { StorageTypesMasterStore } from 'src/app/stores/masters/bpm/storage-types.master.store';
import { SlaStatusesMasterStore } from 'src/app/stores/masters/compliance-management/sla-statuses-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { SuppliersMasterStore } from 'src/app/stores/masters/suppliers-management/suppliers';

declare var $: any;
@Component({
  selector: 'app-add-vital-records',
  templateUrl: './add-vital-records.component.html',
  styleUrls: ['./add-vital-records.component.scss']
})
export class AddVitalRecordsComponent implements OnInit {

  @Input ('source') source:any;
  @ViewChild('storageTypeModal') storageTypeModal: ElementRef;
  @ViewChild('storageLocationModal') storageLocationModal: ElementRef;
  @ViewChild('backupFrequencyModal') backupFrequencyModal: ElementRef;
  @ViewChild('recordRetentionModal') recordRetentionModal: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('periodicModal') periodicModal: ElementRef;

  
  AdvancePrStore= AdvancePrStore
  AprDemoStore = AprDemoStore
  formErrors: any;
  AppStore = AppStore
  AuthStore = AuthStore
  form: FormGroup;

  BackupAtOffsiteStatusesMasterStore = BackupAtOffsiteStatusesMasterStore
  ProcessAccessibilityMasterStore = ProcessAccessibilityMasterStore
  StorageLocationMasterStore = StorageLocationMasterStore
  OperationModesMasterStore = OperationModesMasterStore
  PeriodicBackupMasterStore = PeriodicBackupMasterStore
  RecordRetentionPoliciesMasterStore = RecordRetentionPoliciesMasterStore
  FrequencyBackupMasterStore = FrequencyBackupMasterStore
  StorageTypesMasterStore = StorageTypesMasterStore;
  SlaStatusesMasterStore = SlaStatusesMasterStore
  DepartmentMasterStore = DepartmentMasterStore
  SuppliersMasterStore = SuppliersMasterStore
  UsersStore = UsersStore
  processCatFormErros: any;
  storageTypesObject = {
    component: 'Master',
    values: null,
    type: null
  };
  storageLocationsObject = {
    component: 'Master',
    values: null,
    type: null
  };
  backupFrequencyObject = {
    component: 'Master',
    values: null,
    type: null
  };
  RecordRetentionPoliciesObject = {
    component: 'Master',
    values: null,
    type: null
  };
  periodicBackupObject = {
    component: 'Master',
    values: null,
    type: null
  };
  controlStorageTypesSubscriptionEvent: any;
  controlStorageLocationSubscriptionEvent: any;
  controlBackupFrequencySubscriptionEvent: any;
  recordRetentionPoliciesSubscriptionEvent: any;
  periodicBackupSubscription: any;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _storageLocationService: StorageLocationsService,
    private _storageTypesService: StorageTypesService,
    private _recordRetentionPoliciesService:RecordRetentionPoliciesService,
    private _processOperationModesService: ProcessModesMasterService,
    private _highAvailabilityStatusService: HighAvialabilityStatusService,
    private _processAccessabilityService: ProcessAccessibilityService,
    private _BackupAtOffsiteStatusesService:BackupAtOffsiteStatusesService,
    private _periodicBackupService:PeriodicBackupService,
    private _FrequencyBackupService:FrequencyBackupService,
    private _imageService: ImageServiceService,
    private _usersService: UsersService,
    private _aprService:AprService,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 50);
    this.form = this._formBuilder.group({
      id:[null],
      vital_record_name:['',[Validators.required]],
      storage_type:[null,[Validators.required]],
      storage_location:[null,[Validators.required]],
      backup_storage:[null],
      person_responsible:[null],
      periodic_backup:[null],
      frequancy_backup:[null],
      backup_offsite:[null],
      details_backup_offsite:[''],
      record_retention_policy:[null],
      availability_storing_documents:[null],
      recovery_verififcarion_process:[null],
      single_point_failure:[0],
      is_fireproof_cabin:[0]
    })
    // for closing the modal
    this.controlStorageTypesSubscriptionEvent = this._eventEmitterService.storageTypes.subscribe(res => {
      this.closestorageTypeModal();
    })
    this.controlStorageLocationSubscriptionEvent = this._eventEmitterService.storageLocation.subscribe(res => {
      this.closestorageLocationModal();
    })
    this.controlBackupFrequencySubscriptionEvent = this._eventEmitterService.backupFrequency.subscribe(res => {
      this.closebackupFrequencyModal();
    })
    this.recordRetentionPoliciesSubscriptionEvent = this._eventEmitterService.recordRetentionPolicies.subscribe(res => {
      this.closeRecordRetentionModal();
    })
    this.periodicBackupSubscription = this._eventEmitterService.periodicBackup.subscribe(res => {
      this.closePeriodicBackup();
    })

    this.getRecordRetentionPolicy()
    this.getBackupAtOffsite()
    this.getStorageLocation()
    this.getStorageType()
    this.getPeriodicBackup()
    this.getFrequencyBackup()
    if(this.source.hasOwnProperty('values') && this.source.values){
      console.log("values",this.source.values)
      let {id,title,storage_type,storage_location,backup_storage,backup_responsible_user,periodic_backup,backup_freequency,backup_at_offsite_status,offsite_backup_details,record_retension_policy,is_fireproof_cabin,is_single_point_of_failure}=this.source.values
      this.form.patchValue({
      id:id,
      vital_record_name:title,
      storage_type:storage_type,
      storage_location:storage_location,
      backup_storage:backup_storage,
      person_responsible:backup_responsible_user,
      periodic_backup:periodic_backup,
      frequancy_backup:backup_freequency,
      backup_offsite:backup_at_offsite_status,
      details_backup_offsite:offsite_backup_details,
      record_retention_policy:record_retension_policy,
      single_point_failure:is_single_point_of_failure,
      is_fireproof_cabin:is_fireproof_cabin
      })
    }
  }

  processDataForSave(){
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

  openstorageLocationModal(type:string) {
    this.storageLocationsObject.type="Add"
    this.storageLocationsObject.component=type
    setTimeout(() => {
      $(this.storageLocationModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 50);
  }

  closestorageLocationModal() {
    if(StorageLocationMasterStore.lastInsertedId) {
      if(this.storageLocationsObject.component=='location'){
        this.setStorageLocation({term: StorageLocationMasterStore.lastInsertedId},true);
      }else{
        this.setBackupStorage({term: StorageLocationMasterStore.lastInsertedId},true);
      }
      
    }
    this.storageLocationsObject.type = '';
    this.storageLocationsObject.component=''
    $(this.storageLocationModal.nativeElement).modal('hide');
    this.storageLocationsObject.type = null;
  }

  setStorageLocation(e,patchValue:boolean = false){
    this._storageLocationService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { storage_location:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setBackupStorage(e,patchValue:boolean = false){
    this._storageLocationService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { backup_storage:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openstorageTypeModal() {
    this.storageTypesObject.type="Add"
    setTimeout(() => {
      $(this.storageTypeModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 50);
  }

  closestorageTypeModal() {
    if(StorageTypesMasterStore.lastInsertedId) {
      this.setStorageType({term: StorageTypesMasterStore.lastInsertedId},true);
    }
    this.storageTypesObject.type = '';
    $(this.storageTypeModal.nativeElement).modal('hide');
    this.storageTypesObject.type = null;
  }

  setStorageType(e,patchValue:boolean = false){
    this._storageTypesService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { storage_type:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openbackupFrequencyModal() {
    this.backupFrequencyObject.type="Add"
    setTimeout(() => {
      $(this.backupFrequencyModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 50);
  }

  closebackupFrequencyModal() {
    if(FrequencyBackupMasterStore.lastInsertedId) {
      this.setBackupFrequency({term: FrequencyBackupMasterStore.lastInsertedId},true);
    }
    this.backupFrequencyObject.type = '';
    $(this.backupFrequencyModal.nativeElement).modal('hide');
    this.backupFrequencyObject.type = null;
  }

  setBackupFrequency(e,patchValue:boolean = false){
    this._FrequencyBackupService.getItems(false,'&q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { frequancy_backup:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openRecordRetentionModal() {
    this.RecordRetentionPoliciesObject.type="Add"
    setTimeout(() => {
      $(this.recordRetentionModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 50);
  }

  closeRecordRetentionModal() {
    if(RecordRetentionPoliciesMasterStore.lastInsertedId) {
      this.setRecordRetentionModal({term: RecordRetentionPoliciesMasterStore.lastInsertedId},true);
    }
    this.RecordRetentionPoliciesObject.type = '';
    $(this.recordRetentionModal.nativeElement).modal('hide');
    this.RecordRetentionPoliciesObject.type = null;
  }

  setRecordRetentionModal(e,patchValue:boolean = false){
    this._recordRetentionPoliciesService.getItems(false,'q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { record_retention_policy:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  openPeriodicBackup() {
    this.periodicBackupObject.type="Add"
    setTimeout(() => {
      $(this.periodicModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    }, 50);
  }

  closePeriodicBackup() {
    if(PeriodicBackupMasterStore.lastInsertedId) {
      this.setPeriodicBackup({term: PeriodicBackupMasterStore.lastInsertedId},true);
    }
    this.periodicBackupObject.type = '';
    $(this.periodicModal.nativeElement).modal('hide');
    this.periodicBackupObject.type = null;
  }

  setPeriodicBackup(e,patchValue:boolean = false){
    this._periodicBackupService.getItems(false,'&q='+e.term).subscribe((res) =>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue(
              { periodic_backup:i.id
              }
            );
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  saveVitalCategory(close:boolean=false){
    if(this.form.value){
      let save
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._aprService.updateVitalRecords(this.form.value.id, this.processDataForSave());
      } else {
        // Deleting ID before POST
        delete this.form.value.id
        save = this._aprService.saveVitalRecords(this.processDataForSave());
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.processCatFormErros = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
            this.closeModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
  }

  getFrequencyBackup(event:any=null) {
    this._FrequencyBackupService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getPeriodicBackup(event:any=null) {
    this._periodicBackupService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getStorageLocation(event:any=null) {
    this._storageLocationService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getBackupAtOffsite(event:any=null) {
    this._BackupAtOffsiteStatusesService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getRecordRetentionPolicy(event:any=null) {
    this._recordRetentionPoliciesService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getStorageType(event:any=null) {
    this._storageTypesService.getItems(false,'&limit=1000',false).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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

  closeModal(){
    this.resetForm();
    this._eventEmitterService.dismissVitalModal()
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  ngOnDestroy() {
    this.controlStorageTypesSubscriptionEvent.unsubscribe()
    this.controlStorageLocationSubscriptionEvent.unsubscribe()
    this.controlBackupFrequencySubscriptionEvent.unsubscribe()
    this.recordRetentionPoliciesSubscriptionEvent.unsubscribe()
    this.periodicBackupSubscription.unsubscribe()
  }

}
