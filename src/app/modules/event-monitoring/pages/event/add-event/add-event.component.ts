import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer, autorun, toJS } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventTypeService } from "src/app/core/services/masters/event-monitoring/event-type/event-type.service";
import { EventTypeMasterStore } from "src/app/stores/masters/event-monitoring/event-type-store";
import { PeriodicityService } from "src/app/core/services/masters/event-monitoring/periodicity/periodicity.service";
import { PeriodicityMasterStore } from "src/app/stores/masters/event-monitoring/periodicity-store"
import { RangeService } from "src/app/core/services/masters/event-monitoring/range/range.service";
import { RangeMasterStore } from "src/app/stores/masters/event-monitoring/range-store"
import { EntranceService } from "src/app/core/services/masters/event-monitoring/entrance/entrance.service";
import { EntranceMasterStore } from "src/app/stores/masters/event-monitoring/entrance-store"
import { DimensionService } from "src/app/core/services/masters/event-monitoring/dimension/dimension.service";
import { DimensionMasterStore } from "src/app/stores/masters/event-monitoring/dimension-store"
import { SpaceTypeService } from "src/app/core/services/masters/event-monitoring/space-type/space-type.service";
import { SpaceTypeMasterStore } from "src/app/stores/masters/event-monitoring/space-type-store"
import { TargetAudienceService } from "src/app/core/services/masters/event-monitoring/target-audience/target-audience.service";
import { TargetAudienceMasterStore } from "src/app/stores/masters/event-monitoring/target-audience-store"
import { DepartmentService } from "src/app/core/services/masters/organization/department/department.service";
import { DepartmentMasterStore } from "src/app/stores/masters/organization/department-store";
import { UsersService } from "src/app/core/services/human-capital/user/users.service";
import { UsersStore } from "src/app/stores/human-capital/users/users.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { EventsService } from "src/app/core/services/event-monitoring/events/events.service";
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { EventFileServiceService } from "src/app/core/services/event-monitoring/event-file-service/event-file-service.service";
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { LocationsService } from 'src/app/core/services/masters/event-monitoring/locations/locations.service';
import {LocationsMasterStore} from 'src/app/stores/masters/event-monitoring/locations-store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ProjectPriorityMasterStore } from 'src/app/stores/masters/project-monitoring/project-priority-store';
import { ProjectPriorityService } from 'src/app/core/services/masters/project-monitoring/project-priority/project-priority.service';


declare var $: any;
@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('formSteps') formSteps: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('eventTypeModal', { static: true }) eventTypeModal: ElementRef;
  @ViewChild('eventPeriodicityModal', { static: true }) eventPeriodicityModal: ElementRef;
  @ViewChild('eventRangeModal', { static: true }) eventRangeModal: ElementRef;
  @ViewChild('eventEntranceModal', { static: true }) eventEntranceModal: ElementRef;
  @ViewChild('eventDimensionModal', { static: true }) eventDimensionModal: ElementRef;
  @ViewChild('eventTypeSpaceModal', { static: true }) eventTypeSpaceModal: ElementRef;
  @ViewChild('eventTargetAudienceModal', { static: true }) eventTargetAudienceModal: ElementRef;
  @ViewChild('priorityFormModal', { static: true }) priorityFormModal: ElementRef;
  @ViewChild('eventLocationModal', { static: true }) eventLocationModal: ElementRef;

  currentTab = 0;
  nextButtonText = 'next';
  previousButtonText = "previous";
  regForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  AuthStore=AuthStore;
  reactionDisposer: IReactionDisposer;
  EventTypeMasterStore = EventTypeMasterStore;
  PeriodicityMasterStore = PeriodicityMasterStore;
  RangeMasterStore = RangeMasterStore;
  EntranceMasterStore = EntranceMasterStore;
  DimensionMasterStore = DimensionMasterStore;
  SpaceTypeMasterStore = SpaceTypeMasterStore;
  TargetAudienceMasterStore = TargetAudienceMasterStore;
  LocationsMasterStore = LocationsMasterStore;
  ProjectPriorityMasterStore = ProjectPriorityMasterStore;
  UsersStore = UsersStore;
  DepartmentMasterStore = DepartmentMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupSubscriptionEvent: any = null;
  cancelEventSubscription: any = null;
  formObject = {
    0:[
      'title',
      'description',
      'start_date',
      'end_date',
      'is_budgeted',
      'event_priority_id',
      'event_type_id',
      'event_periodicity_id',
      'event_entrance_id',
      'event_target_audience_id',
      'event_type_space_id'
    ],
    1:[
      'secondary_owner_ids',
      'secondary_department_ids',
      'department_id',
      'owner_id'
    ],
    2:[
     
    ]
  }
  displayForm: any = {};
  eventTypeSubscriptionEvent: any;
  eventPeriodicitySubscriptionEvent: any;
  eventRangeSubscriptionEvent: any;
  eventEntranceSubscriptionEvent: any;
  eventDimensionSubscriptionEvent: any;
  eventTypeSpaceSubscriptionEvent: any;
  eventTargetAudienceSubscriptionEvent: any;
  eventLocationSubscriptionEvent: any;
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'cancel_current_process',
    type: 'Cancel'
  };
  eventTypeObject = {
    component: 'Master',
    type: null,
    values: null
  };
  eventPeriodicityObject = {
    component: 'Master',
    type: null,
    values: null
  };
  eventRangeObject = {
    component: 'Master',
    type: null,
    values: null
  };
  eventEntranceObject = {
    component: 'Master',
    type: null,
    values: null
  };
  eventDimensionObject = {
    component: 'Master',
    type: null,
    values: null
  };
  eventTypeSpaceObject = {
    component: 'Master',
    type: null,
    values: null
  };
  eventTargetAudienceObject = {
    component: 'Master',
    type: null,
    values: null
  };
  projectPriorityObject = {
    component: 'Master',
    type: null,
    values: null
  };
  eventLocationObject = {
    component: 'Master',
    type: null,
    values: null
  };
  

  constructor(private _formBuilder: FormBuilder, private _renderer2: Renderer2,
    private _eventTypeService: EventTypeService, private _periodicityService: PeriodicityService,
    private _rangeService: RangeService, private _entranceService: EntranceService,
    private _dimensionService: DimensionService, private _spaceTypeService: SpaceTypeService,private _locationsService: LocationsService,
    private _targetAudienceService: TargetAudienceService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _userService: UsersService, private _departmentService: DepartmentService,
    private _helperService: HelperServiceService,private _imageService: ImageServiceService,
    private _eventService: EventsService,
    private _router: Router,private _eventEmitterService: EventEmitterService,
    private _projectPriorityService: ProjectPriorityService,
    private _documentFileService: DocumentFileService, private _eventFileService: EventFileServiceService,
    private _fileUploadPopupService: FileUploadPopupService) { }

  ngOnInit(): void {
    // this.reactionDisposer = autorun(() => {
    //   if (SubMenuItemStore.clikedSubMenuItem) {
    //     switch (SubMenuItemStore.clikedSubMenuItem.type) {
    //       default:
    //         break;
    //     }
    //     // Don't forget to unset clicked item immediately after using it
    //     SubMenuItemStore.unSetClickedSubMenuItem();
    //   }
      
    // })

    SubMenuItemStore.setNoUserTab(true);

    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '/event-monitoring/events' },
    ]);
    // Form Initialization
    this.regForm = this._formBuilder.group({
      id: null,
      event_status_id:null,
      title:  ['',[Validators.required]],
      description: '',
      event_location_id: null,
      start_date: [null,[Validators.required]],
      end_date: [null,[Validators.required]],
      department_id: [null,[Validators.required]],
      is_budgeted: "1",
      owner_id:[null,[Validators.required]],
      event_dimension_id: null,
      event_range_id: null,
      event_type_space_id: [null],
      event_priority_id:[null,[Validators.required]],
      event_type_id:[null],
      event_periodicity_id: [null],
      event_entrance_id:[null],
      secondary_owner_ids:[[]],
      secondary_department_ids:[[]],
      event_target_audience_id:[null],
    });

    if(this._router.url.indexOf('edit') != -1){
      if(EventsStore.selectedEventId != null){
        this.getEventDetails(EventsStore.selectedEventId);
      }
      else{
        this._router.navigateByUrl('event-monitoring/events')
      }
    }

    setTimeout(() => {
      this.startForm();
    }, 200);

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.closeFileUploadModal();
    });
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
    })
    this.eventTypeSubscriptionEvent = this._eventEmitterService.eventType.subscribe(res=>{
      this.closeEventTypeMasterModal();
    });

    this.eventPeriodicitySubscriptionEvent = this._eventEmitterService.periodicity.subscribe(res=>{
      this.closeEventPeriodicityMasterModal();
    });

    this.eventRangeSubscriptionEvent = this._eventEmitterService.range.subscribe(res=>{
      this.closeEventRangeMasterModal();
    });

    this.eventEntranceSubscriptionEvent = this._eventEmitterService.entrance.subscribe(res=>{
      this.closeEventEntranceMasterModal();
    });

    this.eventDimensionSubscriptionEvent = this._eventEmitterService.dimension.subscribe(res=>{
      this.closeEventDimensionMasterModal();
    });

    this.eventTypeSpaceSubscriptionEvent = this._eventEmitterService.spaceType.subscribe(res=>{
      this.closeEventTypeSpaceMasterModal();
    });

    this.eventTargetAudienceSubscriptionEvent = this._eventEmitterService.targetAudience.subscribe(res=>{
      this.closeEventTargetAudienceMasterModal();
    });

    this.eventLocationSubscriptionEvent = this._eventEmitterService.locations.subscribe(res=>{
      this.closeEventLocationMasterModal();
    });
  }

  startForm(){
    this.showTab(this.currentTab);
    this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
    window.addEventListener('scroll',this.scrollEvent,true);
  }

  getEventDetails(id){
    this._eventService.getItem(id).subscribe(res=>{
      this.setFormValues(res);
      this._utilityService.detectChanges(this._cdr);
    })
  }

  setFormValues(eventDetails){
    this.regForm.patchValue({
      id: eventDetails.id ? eventDetails.id : '',
      event_status_id: eventDetails.event_status ? eventDetails.event_status : '',
      title: eventDetails.title ? eventDetails.title : '',
      description: eventDetails.description ? eventDetails.description : '',
      event_location_id: eventDetails.event_location ? this.getEventLocation({term:eventDetails.event_location.id},true) : null,
      start_date: eventDetails.start_date ? new Date(eventDetails.start_date) : null,
      end_date: eventDetails.end_date ? new Date(eventDetails.end_date) : null,
      department_id: eventDetails.departments ? this.getDepartments({term:eventDetails.departments.id},true) : null,
      is_budgeted: eventDetails.is_budgeted.toString(),
      owner_id: eventDetails.owner ? eventDetails.owner : null,
      event_dimension_id: eventDetails.event_dimension ? this.getDimensions({term: eventDetails.event_dimension.id},true) : null,
      event_range_id: eventDetails.event_range ? this.getRange({term: eventDetails.event_range.id},true) : null,
      event_type_space_id: eventDetails.event_space_type ? this.getSpaceTypes({term: eventDetails.event_space_type.id},true) : null,
      event_priority_id: eventDetails.event_priority ? this.getProjectPriorities({term: eventDetails.event_priority.id},true) :null,
      event_type_id: eventDetails.event_type ? this.getEventTypes({term:eventDetails.event_type.id},true) : null,
      event_periodicity_id: eventDetails.event_periodicity ? this.getPeriodicity({term: eventDetails.event_periodicity.id},true) : null,
      event_entrance_id: eventDetails.event_entrance ? this.getEntrances({term: eventDetails.event_entrance.id},true) : null,
      secondary_owner_ids: eventDetails.secondary_owners ? eventDetails.secondary_owners : [],
      secondary_department_ids: eventDetails.secondary_departments ? this._helperService.getArrayProcessed(eventDetails.secondary_departments,'id') : [],
      event_target_audience_id: eventDetails.event_target_audience ? this.getTargetAudiences({term: eventDetails.event_target_audience.id},true) : null,
    })
    this.processSecondaryDepartmentIds();
    if(eventDetails.documents.length > 0){
      this.setDocuments(eventDetails.documents);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  setDocuments(documents) {
    this.clearFIleUploadPopupData()
		let khDocuments = [];
		documents.forEach(element => {
			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {
					if (innerElement.is_latest) {
						khDocuments.push({
							...innerElement,
              title:element?.kh_document.title,
							'is_kh_document': true
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
							...innerElement
						})
					}
				});
			}
			else {
				if (element && element.token) {
					var purl = this._eventFileService.getThumbnailPreview('event-file', element.token)
					var lDetails = {
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,
					}
				}
				this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
	}

  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == 0) {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn"))
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == x.length - 1) {
      console.log(this.regForm.value);
      console.log(this.displayForm);
      if (document.getElementById("nextBtn")){
        this.nextButtonText = "Save";
      }
    } else {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n);
  }

  nextPrev(n) {
    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    // if (n == 1 && !validateForm()) return false;

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }
    
    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      this.save();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i,
      x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  // Setting Intial Tab
  setInitialTab() {
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

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  /**
   * removing document file from the selected list
   * @param token -image token
   */
   removeDocument(doc) {
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  checkFormObject(tabNumber?:number){
    var setValid = true;
    if(!tabNumber){
      if(this.formObject.hasOwnProperty(this.currentTab)){
        for(let i of this.formObject[this.currentTab]){
          
          if(!this.regForm.controls[i].valid){
            
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
            if(!this.regForm.controls[k].valid){
              setValid = false;
              break;
            }
          }
        }
      }
    }
    return setValid;
  }

  formFieldChange(formField,event){
    if(event){
      switch(formField){
        case 'event_location_id': this.displayForm[formField] = LocationsMasterStore.getLocationsById(event);
        break;
        case 'event_type_id': this.displayForm[formField] = EventTypeMasterStore.getEventTypeById(event);
          break;
        case 'event_dimension_id': this.displayForm[formField] = DimensionMasterStore.getDimensionById(event);
          break;
        case 'event_range_id': this.displayForm[formField] = RangeMasterStore.getRangeById(event);
          break;
        case 'event_type_space_id': this.displayForm[formField] = SpaceTypeMasterStore.getSpaceTypeById(event);
          break;
        case 'event_priority_id': this.displayForm[formField] = ProjectPriorityMasterStore.getProjectPriorityById(event);
          break;
        case 'event_periodicity_id': this.displayForm[formField] = PeriodicityMasterStore.getPeriodicityById(event);
          break;
        case 'event_entrance_id': this.displayForm[formField] = EntranceMasterStore.getEntranceById(event);
          break;
        case 'event_target_audience_id': this.displayForm[formField] = TargetAudienceMasterStore.getTargetAudienceById(event);
          break;
        case 'department_id': this.displayForm[formField] = DepartmentMasterStore.getDepartmentById(event);
          break;
      }
    }
    else{
      this.displayForm[formField] = null;
    }
    
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.formSteps.nativeElement,'small');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.formSteps.nativeElement,'small');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  getEventTypes(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._eventTypeService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_type_id: i.id });
            this.displayForm['event_type_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getPeriodicity(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._periodicityService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_periodicity_id: i.id });
            this.displayForm['event_periodicity_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getRange(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._rangeService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_range_id: i.id });
            this.displayForm['event_range_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEntrances(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._entranceService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_entrance_id: i.id });
            this.displayForm['event_entrance_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDimensions(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._dimensionService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_dimension_id: i.id });
            this.displayForm['event_dimension_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getSpaceTypes(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._spaceTypeService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_type_space_id: i.id });
            this.displayForm['event_type_space_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getEventLocation(e?,patchValue:boolean = false)
  {
    let params = e ? '&q='+e.term : '';
    this._locationsService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_location_id: i.id });
            this.displayForm['event_location_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getTargetAudiences(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._targetAudienceService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_target_audience_id: i.id });
            this.displayForm['event_target_audience_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getProjectPriorities(e?,patchValue:boolean = false){
    let params = e ? '&q='+e.term : '';
    this._projectPriorityService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            this.regForm.patchValue({ event_priority_id: i.id });
            this.displayForm['event_priority_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDepartments(e?,patchValue:boolean = false,formField?){
    let params = e ? '&q='+e.term : '';
    this._departmentService.getItems(false,params).subscribe(res=>{
      if(patchValue){
        for (let i of res.data) {
          if (i.id == e.term) {
            if(!formField){
              this.regForm.patchValue({ department_id: i.id });
              this.displayForm['department_id'] = i;
            }
            else{
              if(this.displayForm.hasOwnProperty(formField))
                this.displayForm[formField].push(i);
              else
                this.displayForm[formField] = [i];
            }
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  processSecondaryDepartmentIds(){
    let departments = this.regForm.value.secondary_department_ids;
    for(let i of departments){
      this.getDepartments({term: i},true,'secondary_department_ids')
    }
  }

  searchUers(e,departmentFormField?){
    var params = '';
    UsersStore.setAllUsers([])
    if(departmentFormField && this.regForm.value[departmentFormField] && this.regForm.value[departmentFormField].toString() != ''){
      params = `&department_ids=${this.regForm.value[departmentFormField].toString()}`;
      this._userService.searchUsers('?q='+e.term+params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      UsersStore.setAllUsers([]);
    }
  }

  // Get all users
  getUsers(departmentFormField?){
    var params = '';
    UsersStore.setAllUsers([])
    if(departmentFormField && this.regForm.value[departmentFormField] && this.regForm.value[departmentFormField].toString() != ''){
      params = `?department_ids=${this.regForm.value[departmentFormField].toString()}`;
      this._userService.getAllItems(params).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      })
    }
    else{
      UsersStore.setAllUsers([]);
    }
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
  }

  // Returns default image
  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  cancelClicked() {
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);
    this._utilityService.detectChanges(this._cdr);

  }

  cancelByUser(status) {
    if (status) {
      this._router.navigateByUrl('/event-monitoring/events')
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  createSaveData(){
    let saveData = {};
    saveData['id'] = this.regForm.value.id ? this.regForm.value.id : ''
    saveData['event_status_id'] = this.regForm.value.event_status_id ? this.regForm.value.event_status_id : ''
    saveData['title'] = this.regForm.value.title ? this.regForm.value.title : ''
    saveData['description'] = this.regForm.value.description ? this.regForm.value.description : ''
    saveData['event_location_id'] = this.regForm.value.event_location_id ? this.regForm.value.event_location_id : ''
    saveData['start_date'] = this.regForm.value.start_date ? this._helperService.passSaveFormatDate(this.regForm.value.start_date) : null;
    saveData['end_date'] = this.regForm.value.end_date ? this._helperService.passSaveFormatDate(this.regForm.value.end_date) : null;
    saveData['department_id'] = this.regForm.value.department_id ? this.regForm.value.department_id : null;
    saveData['owner_id'] = this.regForm.value.owner_id ? this.regForm.value.owner_id.id : null;
    saveData['event_dimension_id'] = this.regForm.value.event_dimension_id ? this.regForm.value.event_dimension_id : null;
    saveData['event_range_id'] = this.regForm.value.event_range_id ? this.regForm.value.event_range_id : null;
    saveData['event_space_type_id'] = this.regForm.value.event_type_space_id ? this.regForm.value.event_type_space_id : null;
    saveData['event_target_audience_id'] = this.regForm.value.event_target_audience_id ? this.regForm.value.event_target_audience_id : null;
    saveData['event_priority_id'] = this.regForm.value.event_priority_id ? this.regForm.value.event_priority_id : null;
    saveData['event_type_id'] = this.regForm.value.event_type_id ? this.regForm.value.event_type_id : null;
    saveData['event_entrance_id'] = this.regForm.value.event_entrance_id ? this.regForm.value.event_entrance_id : null;
    saveData['event_periodicity_id'] = this.regForm.value.event_periodicity_id ? this.regForm.value.event_periodicity_id : null;
    saveData['secondary_owner_ids'] = this.regForm.value.secondary_owner_ids ? this._helperService.getArrayProcessed(this.regForm.value.secondary_owner_ids,'id') : []
    saveData['secondary_department_ids'] = this.regForm.value.secondary_department_ids ? this.regForm.value.secondary_department_ids : []
    saveData['is_budgeted'] = this.regForm.value.is_budgeted ? (this.regForm.value.is_budgeted == '1' ? true : false) : false;
    if(this.regForm.value.id) saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    else saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    return saveData;
  }

  save(){
    let save: any;
    AppStore.enableLoading();
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";
    if(this.regForm.value.id){
      save = this._eventService.updateItem(this.regForm.value.id,this.createSaveData());
    }
    else{
      save = this._eventService.saveItem(this.createSaveData());
    }
    save.subscribe(res=>{
      AppStore.disableLoading();
      if(this.regForm.value.id)
        this._router.navigateByUrl('/event-monitoring/events/'+res.id);
      else
        this._router.navigateByUrl('/event-monitoring/events/'+res.id);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
        this.nextButtonText = "next";
        this.previousButtonText = "previous";
       
        if(this.formErrors.title && this.formErrors.owner_id)
        {
         
          this.changeStep(0);
        }
        else if(this.formErrors.owner_id && !this.formErrors.title)
        {
  
          this.changeStep(1);
        }
        else
        {
          this.changeStep(0);
        }
        
      
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(key.startsWith('secondary_owner_ids.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['secondary_owner_ids'] = this.formErrors['secondary_owner_ids']? this.formErrors['secondary_owner_ids'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
        }
        if(key.startsWith('secondary_department_ids.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['secondary_department_ids'] = this.formErrors['secondary_department_ids']? this.formErrors['secondary_department_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation?.title ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  departmentChange(event,type){
    if(type == 'add'){
      if(this.displayForm.hasOwnProperty('secondary_department_ids'))
        this.displayForm['secondary_department_ids'].push(DepartmentMasterStore.getDepartmentById(event));
      else
        this.displayForm['secondary_department_ids'] = [DepartmentMasterStore.getDepartmentById(event)];
    }
    else{
      let pos = this.displayForm['secondary_department_ids'].findIndex(e => e.id == event.value);
      if(pos != -1) this.displayForm['secondary_department_ids'].splice(pos,1);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  departmentCleared(event){
    this.displayForm['secondary_department_ids'] = [];
  }

  clearAttachments(){
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

  addEvenetType(){
    this.eventTypeObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventTypeMasterModal();
  }

  eventTypeMasterModal() {
    this._renderer2.addClass(this.eventTypeModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventTypeModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventTypeModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventTypeMasterModal() {
    this.eventTypeObject.type = null;
    this._renderer2.removeClass(this.eventTypeModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventTypeModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventTypeModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventType({term : EventTypeMasterStore.lastInsertedEventType},true)

  }
  searchEventType(e,patchValue:boolean = false){
    this._eventTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({ event_type_id: i.id });
            this.displayForm['event_type_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }


  addEventPeriodicity(){
    this.eventPeriodicityObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventPeriodicityMasterModal();
  }

  eventPeriodicityMasterModal() {
    this._renderer2.addClass(this.eventPeriodicityModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventPeriodicityModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventPeriodicityModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventPeriodicityMasterModal() {
    this.eventPeriodicityObject.type = null;
    this._renderer2.removeClass(this.eventPeriodicityModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventPeriodicityModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventPeriodicityModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventPeriodicity({term : PeriodicityMasterStore.lastInsertedPeriodicity},true)

  }
  searchEventPeriodicity(e,patchValue:boolean = false){
    this._periodicityService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({ event_periodicity_id: i.id });
            this.displayForm['event_periodicity_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addEventRange(){
    this.eventRangeObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventRangeMasterModal();
  }

  eventRangeMasterModal() {
    this._renderer2.addClass(this.eventRangeModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventRangeModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventRangeModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventRangeMasterModal() {
    this.eventRangeObject.type = null;
    this._renderer2.removeClass(this.eventRangeModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventRangeModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventRangeModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventRange({term : PeriodicityMasterStore.lastInsertedPeriodicity},true)

  }
  searchEventRange(e,patchValue:boolean = false){
    this._rangeService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({event_range_id: i.id });
            this.displayForm['event_range_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addEventEntrance(){
    this.eventEntranceObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventEntranceMasterModal();
  }

  eventEntranceMasterModal() {
    this._renderer2.addClass(this.eventEntranceModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventEntranceModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventEntranceModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventEntranceMasterModal() {
    this.eventRangeObject.type = null;
    this._renderer2.removeClass(this.eventEntranceModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventEntranceModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventEntranceModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventEntrance({term : EntranceMasterStore.lastInsertedEntrance},true)

  }
  searchEventEntrance(e,patchValue:boolean = false){
    this._entranceService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({event_entrance_id: i.id });
            this.displayForm['event_entrance_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addEventDimension(){
    this.eventDimensionObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventDimensionMasterModal();
  }

  eventDimensionMasterModal() {
    this._renderer2.addClass(this.eventDimensionModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventDimensionModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventDimensionModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventDimensionMasterModal() {
    this.eventRangeObject.type = null;
    this._renderer2.removeClass(this.eventDimensionModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventDimensionModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventDimensionModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventDimension({term : DimensionMasterStore.lastInsertedDimension},true)

  }
  searchEventDimension(e,patchValue:boolean = false){
    this._dimensionService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({event_dimension_id: i.id });
            this.displayForm['event_dimension_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addEventTypeSpace(){
    this.eventTypeSpaceObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventTypeSpaceMasterModal();
  }

  eventTypeSpaceMasterModal() {
    this._renderer2.addClass(this.eventTypeSpaceModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventTypeSpaceModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventTypeSpaceModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventTypeSpaceMasterModal() {
    this.eventTypeSpaceObject.type = null;
    this._renderer2.removeClass(this.eventTypeSpaceModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventTypeSpaceModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventTypeSpaceModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventTypeSpace({term : SpaceTypeMasterStore.lastInsertedSpaceType},true)

  }
  searchEventTypeSpace(e,patchValue:boolean = false){
    this._spaceTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({event_type_space_id: i.id });
            this.displayForm['event_type_space_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addEventTargetAudience(){
    this.eventTargetAudienceObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventTargetAudienceMasterModal();
  }

  eventTargetAudienceMasterModal() {
    this._renderer2.addClass(this.eventTargetAudienceModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventTargetAudienceModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventTargetAudienceModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventTargetAudienceMasterModal() {
    this.eventTargetAudienceObject.type = null;
    this._renderer2.removeClass(this.eventTargetAudienceModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventTargetAudienceModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventTargetAudienceModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventTargetAudience({term : TargetAudienceMasterStore.lastInsertedTargetAudience},true)

  }
  searchEventTargetAudience(e,patchValue:boolean = false){
    this._targetAudienceService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({event_target_audience_id: i.id });
            this.displayForm['event_target_audience_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addEventLocation(){
    this.eventLocationObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.eventLocationMasterModal();
  }

  eventLocationMasterModal() {
    this._renderer2.addClass(this.eventLocationModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventLocationModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.eventLocationModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  closeEventLocationMasterModal() {
    this.eventTargetAudienceObject.type = null;
    this._renderer2.removeClass(this.eventLocationModal.nativeElement,'show');
    this._renderer2.setStyle(this.eventLocationModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.eventLocationModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchEventLocation({term : LocationsMasterStore.lastInsertedLocations},true)

  }
  searchEventLocation(e,patchValue:boolean = false){
    this._locationsService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({event_location_id: i.id });
            this.displayForm['event_location_id'] = i;
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  
  getPriority(){
    this._projectPriorityService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  searchPriority(e,patchValue:boolean = false){
    this._projectPriorityService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.regForm.patchValue({ location_id: i.id });
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  addNewPriorityType(){
    this.projectPriorityObject.type = 'Add';
    this._utilityService.detectChanges(this._cdr);
    this.priorityTypeMasterModal();
  }

  priorityTypeMasterModal() {
    this._renderer2.addClass(this.priorityFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'z-index','99999');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'display','block');
    this._utilityService.detectChanges(this._cdr);
  }

  
  closePriorityTypeMasteModal() {
    this.projectPriorityObject.type = null;
    this._renderer2.removeClass(this.priorityFormModal.nativeElement,'show');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'z-index','9999');
    this._renderer2.setStyle(this.priorityFormModal.nativeElement,'display','none');
    this._utilityService.detectChanges(this._cdr);
    this.searchPriority({term : ProjectPriorityMasterStore.lastInsertedProjectPriority},true)

  }

  
  

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    window.removeEventListener('scroll', this.scrollEvent);
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.cancelEventSubscription.unsubscribe();
    this.eventTypeSubscriptionEvent.unsubscribe();
    this.eventPeriodicitySubscriptionEvent.unsubscribe();
    this.eventRangeSubscriptionEvent.unsubscribe();
    this.eventEntranceSubscriptionEvent.unsubscribe();
    this.eventDimensionSubscriptionEvent.unsubscribe();
    this.eventTypeSpaceSubscriptionEvent.unsubscribe();
    this.eventTargetAudienceSubscriptionEvent.unsubscribe();
    this.eventLocationSubscriptionEvent.unsubscribe();
    this.clearAttachments();
  }

}
