import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { IncidentDamageSeverityService } from 'src/app/core/services/masters/incident-management/incident-damage-severity/incident-damage-severity.service';
import { IncidentDamageTypeService } from 'src/app/core/services/masters/incident-management/incident-damage-type/incident-damage-type.service';
import { IncidentRootCauseService } from 'src/app/core/services/masters/incident-management/incident-root-cause/incident-root-cause.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { IncidentDamageSeverityMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-severity-store';
import { IncidentDamageTypeMasterStore } from 'src/app/stores/masters/incident-management/incident-damage-type-master-store';
import { IncidentRootCauseMasterStore } from 'src/app/stores/masters/incident-management/incident-root-cause-master-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
declare var $: any;

@Component({
  selector: 'app-investigation-add',
  templateUrl: './investigation-add.component.html',
  styleUrls: ['./investigation-add.component.scss']
})
export class InvestigationAddComponent implements OnInit {
  @ViewChild("investigations") investigations: ElementRef;
  @ViewChild("significant") significant: ElementRef;
  @ViewChild("recommendations") recommendations: ElementRef;
  @ViewChild("references") references: ElementRef;
  @ViewChild('othersPopup') othersPopup: ElementRef;
  @ViewChild('controlPopup') controlPopup: ElementRef;
  @ViewChild('WitnessPopup') WitnessPopup:ElementRef;
  @ViewChild('involvedPerson') involvedPerson: ElementRef;
  @ViewChild('witnessPerson') witnessPerson:ElementRef;
  @ViewChild('incidentTitle') incidentTitle:ElementRef;
  @ViewChild('addTypeDamage') addTypeDamage:ElementRef;
  @Input ('source') addOrEdit: any;
  @Input ('sources') sources: any;



  yes : boolean 
  no : boolean 
  reactionDisposer: IReactionDisposer;

  IncidentStore = IncidentStore;
  AppStore = AppStore;
  IncidentInvestigationStore = IncidentInvestigationStore

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  IncidentDamageTypeMasterStore = IncidentDamageTypeMasterStore;
  IncidentRootCauseMasterStore = IncidentRootCauseMasterStore;
  IncidentDamageSeverityMasterStore = IncidentDamageSeverityMasterStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
 investigationEmptyList : string = 'common_nodata_title'
  pipe = new DatePipe('en-US');

  controlObject= {
    type: null
  };
  witnessObject= {
    type: null
  };
  addInves: any;
  addSignif: any;
  addrecommendation: any;
  reference: any;
  form: FormGroup;
  formErrors: any;
  otherUsers: any;
  otherUserSubscription: any;
  addInvolvedPersonSubscription: any;
  addWitnessPersonSubscription: any;
  InvolvedWitnessPersonSubscription: any;
  InvolvedPersonSubscription: any;
  incidentId: any;




  constructor(private  _cdr: ChangeDetectorRef, private _renderer2: Renderer2,
    private _utilityService: UtilityService,private _router: Router,private _investigationService : InvestigationService,
    private _incidentService : IncidentService,private _incidentFileService : IncidentFileService,
    private _imageService: ImageServiceService,private  _eventEmitterService: EventEmitterService,
    private _incidentDamageTypesService: IncidentDamageTypeService,private _incidentRootCauseService: IncidentRootCauseService,
    private _formBuilder: FormBuilder , private _incidentDamageSeverityService: IncidentDamageSeverityService,
    private _helperService: HelperServiceService,

    ) { }

  ngOnInit(): void {

    // this.getIncidentDetails(IncidentStore.selectedId);

    // this.reactionDisposer = autorun(() => {  
  //     if(NoDataItemStore.clikedNoDataItem){
  //     NoDataItemStore.unSetClickedNoDataItem();
  //  }
  // })

  
  //  NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!"});

    this.addInves = this._eventEmitterService.investigationDesModalControl.subscribe(element=>{
      this.closeinvestigationsModal()
    })

    this.addSignif = this._eventEmitterService.significantDesModalControl.subscribe(element=>{
      this.closesignificantModal()
    })
    this.addrecommendation = this._eventEmitterService.recommendationsDesModalControl.subscribe(element=>{
      this.closerecommendationsModal()
    })
    this.reference = this._eventEmitterService.referenceDesModalControl.subscribe(element=>{
      this.closereferencesModal()
    })

    this.otherUserSubscription = this._eventEmitterService.otherUsersModalControl.subscribe(element=>{
      this.closeassignOtherUsers();
    })

    this.addInvolvedPersonSubscription = this._eventEmitterService.personInvolvedAddModalControl.subscribe(element => {
      this.closeModal();
    })

    this.addWitnessPersonSubscription = this._eventEmitterService.witnessAddModalControl.subscribe(element=>{
      this.closeWitnesssModal()
    })


    this.InvolvedWitnessPersonSubscription = this._eventEmitterService.InvolvedWitnessAddModalControl.subscribe(element=>{
      this.closeWitnessPerson();
    })

    this.InvolvedPersonSubscription = this._eventEmitterService.InvolvedPersonAddModalControl.subscribe(element=>{
      this.closeInvolvedPerson()
    })

    

       // form
       this.form = this._formBuilder.group({
         id : '',
        incident_id: [''],
        title: ['', [Validators.required]],
        description : [''],
        location : [''],
        incident_at: ['',[Validators.required]],
        incident_damage_type_id : [null],
        action : [''],
        reported_at : [''], 
        reported_by : [null],
        organization_ids : [null,[Validators.required]],
        division_ids : [null],
        department_ids : [null],
        section_ids : [null],
        sub_section_ids : [null],
        incident_type_ids : [null],
        incident_stakeholder_ids : [null],
        investigation_witness_user_ids : [],
        investigation_involved_user_ids : [],
        documents : [],
        investigation_witness_other_users : [],
        investigation_involved_other_users : [],
        incident_category_ids : [null],
        incident_sub_category_ids : [null],
        investigation_observations : [null],
        investigation_points : [null],
        investigation_recommendations : [null],
        investigation_references : [null],
        is_safe_work : '',
        incident_damage_severity_id : [null],
        investigation_root_cause_ids : [null],



      })

      // this.getIncidentDetails(IncidentStore.selectedId)

    // <script>
    //step-form-small starts
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function () {
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      next_fs = $(this).parent().next();

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale current_fs down to 80%
          scale = 1 - (1 - now) * 0.2;
          //2. bring next_fs from the right(50%)
          left = (now * 50) + "%";
          //3. increase opacity of next_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'transform': 'scale(' + scale + ')'
          });
          next_fs.css({
            'left': left,
            'opacity': opacity
          });
        },
        duration: 500,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeOutQuint'
      });
    });

    $(".previous").click(function () {
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale previous_fs from 80% to 100%
          scale = 0.8 + (1 - now) * 0.2;
          //2. take current_fs to the right(50%) - from 0%
          left = ((1 - now) * 50) + "%";
          //3. increase opacity of previous_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'left': left
          });
          previous_fs.css({
            'transform': 'scale(' + scale + ')',
            'opacity': opacity
          });
        },
        duration: 500,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeOutQuint'
      });
    });

    $(".submit").click(function () {
      return false;
    })

    // this._riskManagementSettingsService.getItems().subscribe(res => {
    //   this._utilityService.detectChanges(this._cdr);
    // })

    // if (RisksStore?.individualRiskDetails?.is_analysis_performed == 1) {



    //   this._riskAssessmentService.getItem().subscribe(res => {

    //     this.activeImpact = res['risk_analysis'].impact;
    //     this.activeLikelihood = res['risk_analysis'].likelihood;
    //     this.impactJustification = res['risk_analysis'].impact_justification;
    //     this.likelihoodJustification = res['risk_analysis'].likelihood_justification;
    //     if (res['risk_analysis'].process_details) {
    //       this.openProcess(res['risk_analysis'].process_details[0].id)
    //     }


    //     this._utilityService.detectChanges(this._cdr);
    //   })
    // }
    // else{
     
    // }

    // </script>

if(this.addOrEdit == "edit"){
  this.setIncidentItemDataForEditInvestigation();

}else{
  this.setInvestigationIncidentData();

}
this.setIncidentItemDataForEdit()


  

  }


  // documentProcess(){
  //   let docDetails = IncidentStore.docDetails
  //   if(docDetails.length > 0){
  //     for (let i of docDetails) {
  //        i['is_old'] = 1
  //     }
  //   }
  //   return docDetails
  // }

  setIncidentItemDataForEditInvestigation(){
    IncidentInvestigationStore.investigationIncidentObjects.documents = [];
    var incidentItem = IncidentStore.IncidentItemDetails;
    IncidentInvestigationStore.investigationIncidentObjects.title = IncidentInvestigationStore.investigationItemDetails.title;
    IncidentInvestigationStore.investigationIncidentObjects.description = IncidentInvestigationStore.investigationItemDetails.description; 
    IncidentInvestigationStore.investigationIncidentObjects.incident_at = IncidentInvestigationStore.investigationItemDetails.incident_at;
    IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id = IncidentInvestigationStore.investigationItemDetails.incident_damage_type;
    IncidentInvestigationStore.investigationIncidentObjects.reported_by = IncidentInvestigationStore.investigationItemDetails.reported_by;
    IncidentInvestigationStore.investigationIncidentObjects.organization_ids = IncidentInvestigationStore.investigationItemDetails.organizations
    IncidentInvestigationStore.investigationIncidentObjects.division_ids = IncidentInvestigationStore.investigationItemDetails.divisions
    IncidentInvestigationStore.investigationIncidentObjects.department_ids = IncidentInvestigationStore.investigationItemDetails.departments
    IncidentInvestigationStore.investigationIncidentObjects.section_ids = IncidentInvestigationStore.investigationItemDetails.sections;
    IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids = IncidentInvestigationStore.investigationItemDetails.sub_sections
    IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids = IncidentInvestigationStore.investigationItemDetails.investigation_categories
    IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids = IncidentInvestigationStore.investigationItemDetails.investigation_sub_categories
    IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids = IncidentInvestigationStore.investigationItemDetails.stakeholders
    IncidentInvestigationStore.investigationIncidentObjects.action = IncidentInvestigationStore.investigationItemDetails.action
    IncidentInvestigationStore.investigationIncidentObjects.reported_at = IncidentInvestigationStore.investigationItemDetails.reported_at;
    IncidentInvestigationStore.investigationIncidentObjects.documents = IncidentInvestigationStore.docDetails

    IncidentStore.recommendations = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.recommendations) 
    IncidentStore.references = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.references) 
    IncidentStore.incidentInvestigations = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.points) 
    IncidentStore.significantObservations = this.getInvestigations(IncidentInvestigationStore.investigationItemDetails.observations) 
    if(IncidentInvestigationStore.investigationItemDetails.is_safe_work == 1){
      this.yes = true
    }else if (IncidentInvestigationStore.investigationItemDetails.is_safe_work == 2){
      this.no = true
    }
    this.form.patchValue({
      id : IncidentInvestigationStore.selectedId,
      investigation_root_cause_ids : IncidentInvestigationStore.investigationItemDetails.investigation_root_causes ? this.getEditValues(IncidentInvestigationStore.investigationItemDetails.investigation_root_causes) : [] ,
      incident_damage_severity_id : IncidentInvestigationStore.investigationItemDetails.incident_damage_severity  ? IncidentInvestigationStore.investigationItemDetails.incident_damage_severity : [],
      is_safe_work: IncidentInvestigationStore.investigationItemDetails?.is_safe_work ? 1 : 2  
      // investigation_recommendations : IncidentInvestigationStore.IncidentItemDetails.recommendations ? this.getInvestigations() 
    })
    if(this.sources == 'investigationDetails'){
      this.form.patchValue({
        incident_id: IncidentInvestigationStore.investigationItemDetails.incident ? IncidentInvestigationStore.investigationItemDetails.incident.id : ''
      })
    }else{
      this.form.patchValue({
        incident_id: IncidentStore.IncidentItemDetails ? IncidentStore.IncidentItemDetails.id : ''

      })

    }

    

    
    this._utilityService.detectChanges(this._cdr);

  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.first_name;
    userDetial['last_name'] = users?.last_name;
    userDetial['designation'] = users?.designation;
    userDetial['image_token'] = users?.image?.token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;
 
  }


  setInvestigationIncidentData(){
    var incidentItem = IncidentStore.IncidentItemDetails;
    IncidentInvestigationStore.investigationIncidentObjects.documents = [];

    IncidentInvestigationStore.investigationIncidentObjects.title = incidentItem.title;
    IncidentInvestigationStore.investigationIncidentObjects.description = incidentItem.description; 
    IncidentInvestigationStore.investigationIncidentObjects.incident_at = incidentItem.incident_at;
    IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id = incidentItem.incident_damage_type;
    IncidentInvestigationStore.investigationIncidentObjects.reported_by = incidentItem.reported_by;
    IncidentInvestigationStore.investigationIncidentObjects.organization_ids = incidentItem.organizations
    IncidentInvestigationStore.investigationIncidentObjects.division_ids = incidentItem.divisions
    IncidentInvestigationStore.investigationIncidentObjects.department_ids = incidentItem.departments
    IncidentInvestigationStore.investigationIncidentObjects.section_ids = incidentItem.sections;
    IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids = incidentItem.sub_sections
    IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids = incidentItem.incident_categories
    IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids = incidentItem.incident_sub_categories
    IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids = incidentItem.stakeholders
    IncidentInvestigationStore.investigationIncidentObjects.action = incidentItem.action
    IncidentInvestigationStore.investigationIncidentObjects.reported_at  = incidentItem.reported_at
    IncidentInvestigationStore.investigationIncidentObjects.location  = incidentItem.location
    IncidentInvestigationStore.investigationIncidentObjects.documents = IncidentInvestigationStore.docDetails

    this._utilityService.detectChanges(this._cdr);





    

  //  return IncidentInvestigationStore.investigationIncidentObjects


  }



  // for user previrews
  assignUserValues(user) {
    if(user){
    var userInfoObject={
      first_name:'',
      last_name:'',
      designation:'',
      image_token:'',
      mobile:null,
      email:'',
      id:null,
      department:'',
      status_id:null
    }

    userInfoObject.first_name = user?.first_name?user?.first_name:user?.user?.first_name;
    userInfoObject.last_name = user?.last_name?user?.last_name:user?.user?.last_name;
    userInfoObject.designation = user?.designation_title ? user?.designation_title: user?.designation ? user?.designation: user?.user?.designation ? user?.user?.designation?.title: null;
    userInfoObject.image_token = user?.image_token ? user?.image_token : user?.image ? user?.image?.token : user?.user ? user?.user?.image_token:null;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status_id
    userInfoObject.department = user?.department? user?.department: user?.user?.department?.title ? user?.user?.department?.title: null;
     return userInfoObject;
  }
  }

  getIncidentDetails(id){
    this._incidentService.getItem(id).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);

    })
  }

  cancel() {
    this._eventEmitterService.dismissAddInvestigationModalControl();
    this._utilityService.detectChanges(this._cdr);

  }

  checkExtension(ext, extType) {

    return this._imageService.checkFileExtensions(ext, extType)
   
  }

    onCheckboxChange1(e,value) {
    
    if (e.target.checked == true) {
      this.yes = true
      this.no = false
      this.form.patchValue({
        is_safe_work: 1
      })
      this._utilityService.detectChanges(this._cdr)

    }

    // this.form.patchValue({
    //   gender: gender
    // })
  }

  onCheckboxChange2(e,value){
    if(e.target.checked == true){
      this.no = true
      this.yes = false
      this.form.patchValue({
        is_safe_work: 2

      })
      this._utilityService.detectChanges(this._cdr)

    }
  }

    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }
  
    createPreviewUrl(type, token) {
      return this._incidentFileService.getThumbnailPreview(type, token)
    }
  
  
    // Returns image url according to type and token
    createImageUrl(type, token) {
      return this._incidentFileService.getThumbnailPreview(type, token);
    }

    createImagePreview(type, token) {
      return this._imageService.getThumbnailPreview(type, token)
    }

    addIncidentDes() {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        // this._renderer2.setStyle(this.investigations.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.investigations.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.investigations.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100);
    }

    closeinvestigationsModal() {
      // this._renderer2.removeClass(this.investigations.nativeElement, 'show')
      // document.body.classList.remove('modal-open')
      // this._renderer2.setStyle(this.investigations.nativeElement, 'display', 'none');
      // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      // this._renderer2.setAttribute(this.investigations.nativeElement, 'aria-hidden', 'true');
      // $('.modal-backdrop').remove();
    
      // setTimeout(() => {
      //   this._renderer2.removeClass(this.investigations.nativeElement, 'show')
      //   this._utilityService.detectChanges(this._cdr)
      // }, 200);
    
    }

    

    addSignificantDes() {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.significant.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.significant.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.significant.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100)

    }


    closesignificantModal() {
      // this._renderer2.removeClass(this.significant.nativeElement, 'show')
      // document.body.classList.remove('modal-open')
      // this._renderer2.setStyle(this.significant.nativeElement, 'display', 'none');
      // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      // this._renderer2.setAttribute(this.significant.nativeElement, 'aria-hidden', 'true');
      // $('.modal-backdrop').remove();
    
      // setTimeout(() => {
      //   this._renderer2.removeClass(this.significant.nativeElement, 'show')
      //   this._utilityService.detectChanges(this._cdr)
      // }, 200);
    
    }
    addRecomendationsDes() {

      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.recommendations.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.recommendations.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.recommendations.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100)

    }

    closerecommendationsModal() {
      // this._renderer2.removeClass(this.recommendations.nativeElement, 'show')
      // document.body.classList.remove('modal-open')
      // this._renderer2.setStyle(this.recommendations.nativeElement, 'display', 'none');
      // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      // this._renderer2.setAttribute(this.recommendations.nativeElement, 'aria-hidden', 'true');
      // $('.modal-backdrop').remove();
    
      // setTimeout(() => {
      //   this._renderer2.removeClass(this.recommendations.nativeElement, 'show')
      //   this._utilityService.detectChanges(this._cdr)
      // }, 200);
    
    }


    addDamage() {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.addTypeDamage.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.addTypeDamage.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.addTypeDamage.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100)

    }
    addReferancesDes() {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.references.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.references.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.references.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100)

    }

    closereferencesModal() {
      // this._renderer2.removeClass(this.references.nativeElement, 'show')
      // document.body.classList.remove('modal-open')
      // this._renderer2.setStyle(this.references.nativeElement, 'display', 'none');
      // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      // this._renderer2.setAttribute(this.references.nativeElement, 'aria-hidden', 'true');
      // $('.modal-backdrop').remove();
    
      // setTimeout(() => {
      //   this._renderer2.removeClass(this.references.nativeElement, 'show')
      //   this._utilityService.detectChanges(this._cdr)
      // }, 200);
    
    }


    //add involved person
    addInvolvedPerson() {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.involvedPerson.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.involvedPerson.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.involvedPerson.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100);
    }

    closeInvolvedPerson(){
      // this._renderer2.removeClass(this.involvedPerson.nativeElement, 'show')
      // document.body.classList.remove('modal-open')
      // this._renderer2.setStyle(this.involvedPerson.nativeElement, 'display', 'none');
      // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      // this._renderer2.setAttribute(this.involvedPerson.nativeElement, 'aria-hidden', 'true');
      // $('.modal-backdrop').remove();
    
      // setTimeout(() => {
      //   this._renderer2.removeClass(this.involvedPerson.nativeElement, 'show')
      //   this._utilityService.detectChanges(this._cdr)
      // }, 200);

    }

    addIncidentTitle() {
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.incidentTitle.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.incidentTitle.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.incidentTitle.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100);
    }

      //add witness person
      addWitnessPerson() {
        $('.modal-backdrop').add();
        document.body.classList.add('modal-open')
          this._renderer2.setStyle(this.witnessPerson.nativeElement, 'display', 'block');
          // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
          this._renderer2.removeAttribute(this.witnessPerson.nativeElement, 'aria-hidden');
      
          setTimeout(() => {
            this._renderer2.addClass(this.witnessPerson.nativeElement, 'show')
            this._utilityService.detectChanges(this._cdr)
          }, 100);
      }

      closeWitnessPerson(){
        // this._renderer2.removeClass(this.witnessPerson.nativeElement, 'show')
        // document.body.classList.remove('modal-open')
        // this._renderer2.setStyle(this.witnessPerson.nativeElement, 'display', 'none');
        // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
        // this._renderer2.setAttribute(this.witnessPerson.nativeElement, 'aria-hidden', 'true');
        // $('.modal-backdrop').remove();
      
        // setTimeout(() => {
        //   this._renderer2.removeClass(this.witnessPerson.nativeElement, 'show')
        //   this._utilityService.detectChanges(this._cdr)
        // }, 200);
      }

     // for getting incident type
  getIncidentType() {
    this._incidentDamageTypesService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchIncidentType(e,patchValue:boolean = false){
    this._incidentDamageTypesService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            // this.form.patchValue({ id: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  getDamageSeverityCause() {
    this._incidentDamageSeverityService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchDamageSeverity(e,patchValue:boolean = false){
    this._incidentDamageSeverityService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            // this.form.patchValue({ id: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }


  getRootCause() {
    this._incidentRootCauseService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchRootCause(e,patchValue:boolean = false){
    this._incidentRootCauseService.getItems(false, '&q=' + e.term).subscribe((res) => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            // this.form.patchValue({ id: i });
            break;
          }
        }
        // _incidentDamageTypesService.lastIsertedId = null;
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }


  setIncidentItemDataForEdit() {
    

    // var incidentItem = IncidentStore.IncidentItemDetails;


    // for (let i of IncidentStore.IncidentItemDetails.documents) {
    //   let docurl = this._incidentFileService.getThumbnailPreview('incident-item', i.token);
    //   let docDetails = {
    //     created_at: i.created_at,
    //     created_by: i.created_by,
    //     updated_at: i.updated_at,
    //     updated_by: i.updated_by,
    //     name: i.title,
    //     ext: i.ext,
    //     size: i.size,
    //     url: i.url,
    //     thumbnail_url: i.url,
    //     token: i.token,
    //     preview: docurl,
    //     id: i.id

    //   };
    //   this._incidentService.setDocumentDetails(docDetails, docurl);
    //   setTimeout(() => {
    //     // this.checkForFileUploadsScrollbar();
    //   }, 200);

    // }

    // if(this.sources == 'investigationDetails'){
    //   this.form.patchValue({
    //     incident_id: IncidentInvestigationStore.IncidentItemDetails ? IncidentInvestigationStore.IncidentItemDetails.incident.id : ''
    //   })
    // }else{
    //   this.form.patchValue({
    //     incident_id: IncidentStore.IncidentItemDetails ? IncidentStore.IncidentItemDetails.id : ''

    //   })

    // }

     this.form.patchValue({

      // incident_id: IncidentStore.IncidentItemDetails ? IncidentStore.IncidentItemDetails.id : '',
    title: IncidentInvestigationStore.investigationIncidentObjects.title ? IncidentInvestigationStore.investigationIncidentObjects.title : '',
    description: IncidentInvestigationStore.investigationIncidentObjects.description ? IncidentInvestigationStore.investigationIncidentObjects.description : '',
    // incident_at: IncidentInvestigationStore.investigationIncidentObjects.incident_at ? new Date (IncidentInvestigationStore.investigationIncidentObjects.incident_at) : '',
    // reported_at: IncidentInvestigationStore.investigationIncidentObjects.reported_at ? new Date (IncidentInvestigationStore.investigationIncidentObjects.reported_at) : '',
    // incident_damage_type_id: incidentItem.incident_damage_type ? incidentItem.incident_damage_type : [],
    action: IncidentInvestigationStore.investigationIncidentObjects.action ? IncidentInvestigationStore.investigationIncidentObjects.action : '',
    reported_by: IncidentInvestigationStore.investigationIncidentObjects.reported_by ? IncidentInvestigationStore.investigationIncidentObjects.reported_by : '',
    // documents: IncidentStore.docDetails,
    incident_sub_category_ids: IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids[0] : [],
    incident_category_ids: IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0] : [],
    incident_stakeholder_ids: IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids[0] : [],


    // incident_witness_other_users: incidentItem.incident_witness_other_users ? this.getEditValue(incidentItem.incident_witness_other_users) : [],
    // incident_involved_other_users: incidentItem.incident_involved_other_users ? this.getEditValue(incidentItem.incident_involved_other_users) : [],
    investigation_witness_user_ids: IncidentInvestigationStore.involvedWitnessUserDetails ? IncidentInvestigationStore.involvedWitnessUserDetails : [],
    investigation_involved_user_ids: IncidentInvestigationStore.involvedOtherUserDetails ? IncidentInvestigationStore.involvedOtherUserDetails : [],
    sub_section_ids: IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids[0]: [],
    section_ids: IncidentInvestigationStore.investigationIncidentObjects.section_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.section_ids[0] : [],
    organization_ids: IncidentInvestigationStore.investigationIncidentObjects.organization_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.organization_ids[0] : [],
    division_ids: IncidentInvestigationStore.investigationIncidentObjects.division_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.division_ids[0] : '',
    department_ids: IncidentInvestigationStore.investigationIncidentObjects.department_ids.length > 0 ? IncidentInvestigationStore.investigationIncidentObjects.department_ids[0] : null,
    location : IncidentInvestigationStore.investigationIncidentObjects.location ? IncidentInvestigationStore.investigationIncidentObjects.location : ''
    
     })



    this._utilityService.detectChanges(this._cdr);


  }

  passSaveFormatDate(date)
  {
   const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
   return fromdate;
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i.id );
    }
    return returnValues;
  }
  getEditValues(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i );
    }
    return returnValues;
  }

  getInvestigations(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i.description);
    }
    return returnValues;
  }

  processDataForEdit(){
    // if(this.sources == 'investigationDetails'){
    //   this.incidentId = IncidentInvestigationStore.IncidentItemDetails.incident.id
    // }else{
    //   this.incidentId = IncidentStore.IncidentItemDetails.id
    // }
    let saveData = {
      id : this.form.value.id ? this.form.value.id : '',
      incident_id: this.form.value.incident_id ? this.form.value.incident_id : '', 
      title: IncidentInvestigationStore.investigationIncidentObjects.title ? IncidentInvestigationStore.investigationIncidentObjects.title : '',
      description:  IncidentInvestigationStore.investigationIncidentObjects.description ?  IncidentInvestigationStore.investigationIncidentObjects.description : '',
      location: IncidentInvestigationStore.investigationIncidentObjects.location ? IncidentInvestigationStore.investigationIncidentObjects.location : '',
      incident_at: IncidentInvestigationStore.investigationIncidentObjects.incident_at? this.passSaveFormatDate(IncidentInvestigationStore.investigationIncidentObjects.incident_at) : '',
      reported_at: IncidentInvestigationStore.investigationIncidentObjects.reported_at ? this.passSaveFormatDate(IncidentInvestigationStore.investigationIncidentObjects.reported_at) : '',
      incident_damage_type_id: IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id ? IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id.id : '',
      action: IncidentInvestigationStore.investigationIncidentObjects.action ? IncidentInvestigationStore.investigationIncidentObjects.action : '',
      reported_by: IncidentInvestigationStore.investigationIncidentObjects.reported_by ? IncidentInvestigationStore.investigationIncidentObjects.reported_by.id : '',
      documents: IncidentInvestigationStore.investigationIncidentObjects.documents,
      incident_sub_category_ids: IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids[0].id] : [],
      incident_category_ids: IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0].id] : [],
      incident_stakeholder_ids : IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids[0].id] : [],
      // incident_witness_other_users: IncidentStore.involvedWitnessUserDetails ? IncidentStore.involvedWitnessUserDetails : [],
      // investigation_involved_other_users: IncidentStore.involvedOtherUserDetails ? IncidentStore.involvedOtherUserDetails : [],
      // investigation_witness_user_ids: IncidentInvestigationStore.involvedWitnessUserDetails ? this.getEditValue(IncidentInvestigationStore.involvedWitnessUserDetails) : [],
      // investigation_involved_user_ids: IncidentInvestigationStore.involvedOtherUserDetails ? this.getEditValue(IncidentInvestigationStore.involvedOtherUserDetails) : [],
      sub_section_ids: IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids[0].id] : [],
      section_ids: IncidentInvestigationStore.investigationIncidentObjects.section_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.section_ids[0].id] : [],
      organization_ids: IncidentInvestigationStore.investigationIncidentObjects.organization_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.organization_ids[0].id] : [],
      division_ids: IncidentInvestigationStore.investigationIncidentObjects.division_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.division_ids[0].id] : [],
      department_ids: IncidentInvestigationStore.investigationIncidentObjects.department_ids.length > 0 ? [IncidentInvestigationStore.investigationIncidentObjects.department_ids[0].id] : [],
      // investigation_observations : IncidentStore.significantObservationsDes ,
      // investigation_points : IncidentStore.investigationsDes,
      // investigation_recommendations : IncidentStore.recommendationsDes,
      // investigation_references : IncidentStore.referencesDes,
      is_safe_work : '1',
      incident_damage_severity_id : this.form.value.incident_damage_severity_id ? this.form.value.incident_damage_severity_id.id : null,
      investigation_root_cause_ids: this.form.value.investigation_root_cause_ids ? this.getEditValue(this.form.value.investigation_root_cause_ids) : []

    };

    return saveData;
  }

  processDataForSave(){
    let saveData = {
      id : this.form.value.id ? this.form.value.id : '',
      incident_id: IncidentStore.selectedId ? IncidentStore.selectedId: '', 
      title: IncidentInvestigationStore.investigationIncidentObjects.title ? IncidentInvestigationStore.investigationIncidentObjects.title : '',
      description:  IncidentInvestigationStore.investigationIncidentObjects.description ?  IncidentInvestigationStore.investigationIncidentObjects.description : '',
      location: IncidentInvestigationStore.investigationIncidentObjects.location ? IncidentInvestigationStore.investigationIncidentObjects.location : '',
      incident_at: IncidentInvestigationStore.investigationIncidentObjects.incident_at? this.passSaveFormatDate(IncidentInvestigationStore.investigationIncidentObjects.incident_at) : '',
      reported_at: IncidentInvestigationStore.investigationIncidentObjects.reported_at ? this.passSaveFormatDate(IncidentInvestigationStore.investigationIncidentObjects.reported_at) : '',
      incident_damage_type_id: IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id ? IncidentInvestigationStore.investigationIncidentObjects.incident_damage_type_id.id : '',
      action: IncidentInvestigationStore.investigationIncidentObjects.action ? IncidentInvestigationStore.investigationIncidentObjects.action : '',
      reported_by: IncidentInvestigationStore.investigationIncidentObjects.reported_by ? IncidentInvestigationStore.investigationIncidentObjects.reported_by.id : '',
      documents: IncidentInvestigationStore.investigationIncidentObjects.documents,
      incident_sub_category_ids: IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids[0]? [IncidentInvestigationStore.investigationIncidentObjects.incident_sub_category_ids[0].id] : [],
      incident_category_ids: IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0] ? [IncidentInvestigationStore.investigationIncidentObjects.incident_category_ids[0].id] : [],
      incident_stakeholder_ids : IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids[0] ? [IncidentInvestigationStore.investigationIncidentObjects.incident_stakeholder_ids[0].id] : [],
      // incident_witness_other_users: IncidentStore.involvedWitnessUserDetails ? IncidentStore.involvedWitnessUserDetails : [],
      investigation_witness_other_users: IncidentStore.involvedWitnessUserDetails ? IncidentStore.involvedWitnessUserDetails : [],
      investigation_involved_other_users: IncidentStore.involvedOtherUserDetails ? IncidentStore.involvedOtherUserDetails : [],
      investigation_witness_user_ids: IncidentInvestigationStore.involvedWitnessUserDetails ? this.getEditValue(IncidentInvestigationStore.involvedWitnessUserDetails) : [],
      investigation_involved_user_ids: IncidentInvestigationStore.involvedOtherUserDetails ? this.getEditValue(IncidentInvestigationStore.involvedOtherUserDetails) : [],
      sub_section_ids: IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids[0] ? [IncidentInvestigationStore.investigationIncidentObjects.sub_section_ids[0].id] : [],
      section_ids: IncidentInvestigationStore.investigationIncidentObjects.section_ids[0] ? [IncidentInvestigationStore.investigationIncidentObjects.section_ids[0].id] : [],
      organization_ids: IncidentInvestigationStore.investigationIncidentObjects.organization_ids[0] ? [IncidentInvestigationStore.investigationIncidentObjects.organization_ids[0].id] : [],
      division_ids: IncidentInvestigationStore.investigationIncidentObjects.division_ids[0] ? [IncidentInvestigationStore.investigationIncidentObjects.division_ids[0].id] : [],
      department_ids: IncidentInvestigationStore.investigationIncidentObjects.department_ids[0] ? [IncidentInvestigationStore.investigationIncidentObjects.department_ids[0].id] : [],
      investigation_observations : IncidentStore.significantObservationsDes ,
      investigation_points : IncidentStore.investigationsDes,
      investigation_recommendations : IncidentStore.recommendationsDes,
      investigation_references : IncidentStore.referencesDes,
      is_safe_work : '1',
      incident_damage_severity_id : this.form.value.incident_damage_severity_id ? this.form.value.incident_damage_severity_id.id : null,
      investigation_root_cause_ids: this.form.value.investigation_root_cause_ids ? this.getEditValue(this.form.value.investigation_root_cause_ids) : []

    };

    return saveData;
  }

  sumbitInvestigation(){
    let save;

    AppStore.enableLoading();


    if(this.addOrEdit == "edit"){
      save = this._incidentService.updateInvestigation(this.form.value.id, this.processDataForEdit());
    }else{
      save = this._incidentService.saveInvestigation(this.processDataForSave());

    }

        save.subscribe((res: any) => {

          this.resetForm();
          $("#file").val('');
          AppStore.disableLoading();
          if(this.addOrEdit == "edit"){
            IncidentInvestigationStore.setSelectedInvestigationId(IncidentInvestigationStore.selectedId)
            this._investigationService.getItem(IncidentInvestigationStore.selectedId).subscribe()

          }else{
            IncidentInvestigationStore.setSelectedInvestigationId(res.id)
            this._investigationService.getItem(res.id).subscribe()

          }
          this.cancel();
          if(this._router.url.indexOf('incident-investigations') != -1){
            this._router.navigateByUrl('/incident-management/incident-investigations/'+res.id)
          }else{
            this._router.navigateByUrl('/incident-management/'+IncidentStore.selectedId+'/investigation')

          }
          this._utilityService.detectChanges(this._cdr);


          // this._router.navigateByUrl('/incident-management/incidents')
          
        },(err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else if(err.status == 500 || err.status == 403){
            this.cancel();
          }
    
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
    
    
        })
     
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;

  }

  involvedOthers(){
    let item =  IncidentStore.involvedOtherUserDetails.slice(0,2)
    return item
   }
 
   othersWitness(){
     let item = IncidentStore.involvedWitnessUserDetails.slice(0,2)
     return item
    }

    openOtherInvolvedPerson(){
      this.assignOtherUsers( IncidentStore.involvedOtherUserDetails);
     }
   
     openOthersWitnessModel(){
       this.assignOtherUsers(IncidentStore.involvedWitnessUserDetails);
   
     }
   
     closeassignOtherUsers(){
      //  $(this.othersPopup.nativeElement).modal('show');
     }
   
     assignOtherUsers(users){
       IncidentStore.setOthersItems(users)
       this._utilityService.detectChanges(this._cdr);
      //  $(this.othersPopup.nativeElement).modal('show');
     }   


     addPersonInvolved(){
      this.controlObject.type ='Add';
    //   this._renderer2.setStyle(this.controlPopup.nativeElement, 'z-index', 999999);
    // this._renderer2.setStyle(this.controlPopup.nativeElement, 'overflow', 'auto');
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.controlPopup.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.controlPopup.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.controlPopup.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100);
    }
    
    closeModal() {
      // this.controlObject.type = null;
      // this._renderer2.removeClass(this.controlPopup.nativeElement, 'show')
      // document.body.classList.remove('modal-open')
      // this._renderer2.setStyle(this.controlPopup.nativeElement, 'display', 'none');
      // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      // this._renderer2.setAttribute(this.controlPopup.nativeElement, 'aria-hidden', 'true');
      // $('.modal-backdrop').remove();
    
      // setTimeout(() => {
      //   this._renderer2.removeClass(this.controlPopup.nativeElement, 'show')
      //   this._utilityService.detectChanges(this._cdr)
      // }, 200);
    
    }
    addWitness(){
      this.witnessObject.type ='Add';
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.WitnessPopup.nativeElement, 'display', 'block');
        // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
        this._renderer2.removeAttribute(this.WitnessPopup.nativeElement, 'aria-hidden');
    
        setTimeout(() => {
          this._renderer2.addClass(this.WitnessPopup.nativeElement, 'show')
          this._utilityService.detectChanges(this._cdr)
        }, 100);
    }
   
    
    closeWitnesssModal() {
      // this.witnessObject.type = null;
      // this._renderer2.removeClass(this.WitnessPopup.nativeElement, 'show')
      // document.body.classList.remove('modal-open')
      // this._renderer2.setStyle(this.WitnessPopup.nativeElement, 'display', 'none');
      // // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
      // this._renderer2.setAttribute(this.WitnessPopup.nativeElement, 'aria-hidden', 'true');
      // $('.modal-backdrop').remove();
    
      // setTimeout(() => {
      //   this._renderer2.removeClass(this.WitnessPopup.nativeElement, 'show')
      //   this._utilityService.detectChanges(this._cdr)
      // }, 200);
    
    }

    changeZIndex(){
      if($(this.controlPopup.nativeElement).hasClass('show')){
        this._renderer2.setStyle(this.controlPopup.nativeElement,'z-index',999999);
        this._renderer2.setStyle(this.controlPopup.nativeElement,'overflow','auto');
      }
      
     
    }

    deleteOtherInvovedPerson(user){
      for (let i = 0; i < IncidentInvestigationStore.involvedOtherUserDetails.length; i++) {
         if(user == IncidentInvestigationStore.involvedOtherUserDetails[i].first_name){
          IncidentInvestigationStore.involvedOtherUserDetails.splice(i,1)
         }
      }
      this._utilityService.detectChanges(this._cdr);
    }

    deleteOthersInvovedPersons(user){
      for (let i = 0; i < IncidentStore.involvedOtherUserDetails.length; i++) {
         if(user == IncidentStore.involvedOtherUserDetails[i].name){
          IncidentStore.involvedOtherUserDetails.splice(i,1)
         }
      }
      this._utilityService.detectChanges(this._cdr);
    }
    deleteOthersWitnessPersons(user){
      for (let i = 0; i < IncidentStore.involvedWitnessUserDetails.length; i++) {
         if(user == IncidentStore.involvedWitnessUserDetails[i].name){
          IncidentStore.involvedWitnessUserDetails.splice(i,1)
         }
      }
      this._utilityService.detectChanges(this._cdr);
    }

    deleteOtherWitnessPerson(user){
      // 
      for (let i = 0; i < IncidentInvestigationStore.involvedWitnessUserDetails.length; i++) {
         if(user == IncidentInvestigationStore.involvedWitnessUserDetails[i].first_name){
          IncidentInvestigationStore.involvedWitnessUserDetails.splice(i,1)
         }
      }
      this._utilityService.detectChanges(this._cdr);
    }

    deleteInvestigations(row){
      for (let i = 0; i < IncidentStore.investigationsDes.length; i++) {
        if(row == IncidentStore.investigationsDes[i]){
         IncidentStore.investigationsDes.splice(i,1)
        }
     }
     this._utilityService.detectChanges(this._cdr);
    }
    deleteRecommendations(row){
      for (let i = 0; i < IncidentStore.recommendationsDes.length; i++) {
        if(row == IncidentStore.recommendationsDes[i]){
         IncidentStore.recommendationsDes.splice(i,1)
        }
     }
     this._utilityService.detectChanges(this._cdr);
    }

    deleteObservations(row){
      for (let i = 0; i < IncidentStore.significantObservationsDes.length; i++) {
        if(row == IncidentStore.significantObservationsDes[i]){
         IncidentStore.significantObservationsDes.splice(i,1)
        }
     }
     this._utilityService.detectChanges(this._cdr);
    }
    deleteReferences(row){
      for (let i = 0; i < IncidentStore.referencesDes.length; i++) {
        if(row == IncidentStore.referencesDes[i]){
         IncidentStore.referencesDes.splice(i,1)
        }
     }
     this._utilityService.detectChanges(this._cdr);
    }
    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    }

    saveInvestigationPoints(data){
      // let saveData = [];
      // // for(let i of IncidentStore.investigationsDes){
      //   let item = {
      //     investigation_point : i
      //   }
      //   saveData.push(item);
      // }
      let saveData = {
        investigation_point : IncidentStore.investigationsDes[0]
      }
      this._investigationService.addInvestigationInvestigationPoint(saveData).subscribe(()=>this._utilityService.detectChanges(this._cdr))
    }

    saveInvestigationRecommendations(){
      let saveData = {
        investigation_recommendation : IncidentStore.recommendationsDes
      }
      this._investigationService.addInvestigationRecomendation(saveData).subscribe(()=>this._utilityService.detectChanges(this._cdr))
    }

    saveInvestigationObservations(){
      let saveData = {
        investigation_observation : IncidentStore.significantObservationsDes
      }
      this._investigationService.addInvestigationObservations(saveData).subscribe(()=>this._utilityService.detectChanges(this._cdr))
    }
    saveInvestigationReferences(){
      let saveData = {
        investigation_reference : IncidentStore.referencesDes
      }
      this._investigationService.addInvestigationReferences(saveData).subscribe(()=>this._utilityService.detectChanges(this._cdr))
    }

     ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      // SubMenuItemStore.makeEmpty();
      this.addInves.unsubscribe();
      this.addSignif.unsubscribe();
      this.addrecommendation.unsubscribe();
      this.reference.unsubscribe();
      this.otherUserSubscription.unsubscribe();
      this.addInvolvedPersonSubscription.unsubscribe();
      this.addWitnessPersonSubscription.unsubscribe();
      this.InvolvedWitnessPersonSubscription.unsubscribe();
      this.InvolvedPersonSubscription.unsubscribe();
      this.IncidentInvestigationStore.setWitnessUserDetails([]);
      this.IncidentInvestigationStore.setInvolvedUserDetails([])
    }


}
