import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer, toJS } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { KpiService } from 'src/app/core/services/masters/human-capital/kpi/kpi.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';
import { KpiMasterStore } from 'src/app/stores/masters/human-capital/kpi-master.store';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { KpiReviewFrequenciesStore } from 'src/app/stores/masters/kpi-management/kpi-review-frequencies-store';
import { KpiReviewFrequenciesService } from 'src/app/core/services/masters/kpi-management/kpi-review-frequencies/kpi-review-frequencies.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import { KpiCalculationTypesService } from 'src/app/core/services/masters/strategy/kpi-calculation-types/kpi-calculation-types.service';
import { KpiCalculationTypesMasterStore } from 'src/app/stores/masters/strategy/kpi-calculation-type.store';
import { KpiReviewFrequency, CalculationType } from 'src/app/core/models/kpi-management/kpi/kpi';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { KpiManagementFileService } from 'src/app/core/services/kpi-management/file-service/kpi-management-file.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { DomSanitizer } from '@angular/platform-browser';
import { KpisService } from 'src/app/core/services/kpi-management/kpi/kpis.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { DatePipe } from '@angular/common';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { AuditPlanScheduleMasterStore } from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';

declare var $: any;

@Component({
  selector: 'app-kpi-add',
  templateUrl: './kpi-add.component.html',
  styleUrls: ['./kpi-add.component.scss']
})
export class KpiAddComponent implements OnInit, OnDestroy {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;//File-Upload
  @ViewChild('kpiformModal', { static: true }) kpiformModal: ElementRef;//kpi-Master
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;//File-Upload
  @ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;//File-Upload
  @ViewChild ('filePreviewModal') filePreviewModal: ElementRef;//-document
  @ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;

  currentTab = 0;
  form: FormGroup;
  formErrors: any;
  saveData: any = null;
  nextButtonText = "Save & Next";
  previousButtonText = "previous";
  openModelPopup: boolean = false;

  todayDate: any = new Date();
  minTodayDate:{
    year:number;
    month:number;
    day:number;
  };

  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;
  AuthStore = AuthStore;
  KpisStore = KpisStore;
  UsersStore = UsersStore;
  MsTypeStore = MsTypeStore;
  KpiMasterStore = KpiMasterStore;//HC-Master
  UnitMasterStore = UnitMasterStore;//Hc-Master
  SubMenuItemStore = SubMenuItemStore;
  SectionMasterStore = SectionMasterStore;
  fileUploadPopupStore = fileUploadPopupStore; //kh-fileUpload
  DepartmentMasterStore = DepartmentMasterStore;//Master
  DesignationMasterStore = DesignationMasterStore;//Master
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  KpiReviewFrequenciesStore = KpiReviewFrequenciesStore;//Master
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  KpiCalculationTypesMasterStore = KpiCalculationTypesMasterStore;//Master
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  
  formObject = {
    0: [
      //'reference_code',
      'kpi_id',
      'kpi_review_frequency_id',
      'sub_section_ids',
			'section_ids',
			'organization_ids',
			'division_ids',
			'department_ids',
			'start_date',
      'responsible_user_ids',
    ],
    1: [
      'time_frame',
      'target',
      'unit_id',
      'current_value',
      'kpi_calculation_type_id',
      // 'formula',
      // 'data_inputs',
    ]
  }

  cancelObject = {
    type: '',
    title: '',
    subtitle: '',
    position:null,
    sub_position:null
  }

  // -document
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
  };

  FileUploadScoreObject={
    department_id:null
  }

  cancelEventSubscription: any;
  userKpiSubscriptionEvent: any;
  fileUploadPopupSubscriptionEvent: any = null;
  organisationChangesModalSubscription: any = null;

  dataInputArray=[];
  deleteDataInputArray=[];
  newDataInput:string;
  alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
  syboml = [...'+-*/()^1234567890%'];
  dataInputError:boolean=false;

  formulaError:string=null;
  formulaSymbolError:string=null;
  forumlaNotFillError:string=null;
  timeFrameValidtionError:boolean=false;

  automation:boolean=true;

  // reviewFrequenciesObj:any;
  msTypeClauses = [];
  AuditPlanScheduleMasterStore =AuditPlanScheduleMasterStore;

  feastActtiveClassFlagIndexId:number;
  datePlaceholder: any;

  constructor(
    private _router:Router,
    private datePipe: DatePipe,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef, 
    private _kpiService: KpiService,//HC-Master
    private _sanitizer: DomSanitizer,
    private _formBuilder: FormBuilder,
    private _kpisService: KpisService,//*
    private _unitService: UnitService,//Master
    private _usersService: UsersService,
    private _msTypeService: MstypesService,
    private _utilityService: UtilityService,
		private _sectionService: SectionService,
		private _divisionService: DivisionService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _subSectionService: SubSectionService,
    private _departmentService: DepartmentService,//Master
		private _subsiadiaryService: SubsidiaryService,
    private _designationService: DesignationService,//Hc-Master
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,//File-Upload
    private _humanCapitalService: HumanCapitalService,
    private _fileUploadPopupService: FileUploadPopupService,//File-Upload
    private _kpiManagementFileService: KpiManagementFileService, //File-Upload
    private _kpiCalculationTypesService: KpiCalculationTypesService,//Master
    private _kpiReviewFrequenciesService: KpiReviewFrequenciesService,//Master
  ) { }

  ngOnInit(): void {

    this.minTodayDate={
      year: parseInt(this.datePipe.transform(this.todayDate, 'yyyy')), 
      month: parseInt(this.datePipe.transform(this.todayDate, 'MM')), 
      day: parseInt(this.datePipe.transform(this.todayDate, 'dd')) 
    };

    AppStore.showDiscussion = false;
    AppStore.disableLoading();
    this.datePlaceholder = this._helperService.getDateFormatType();
    this.reactionDisposer = autorun(() => {
      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.form = this._formBuilder.group({
      id: [null],
      //reference_code: ['', [Validators.required]],
      kpi_id:[null, [Validators.required]],
      description: [''],
      kpi_review_frequency_id: [null, [Validators.required]],
      ms_type_organization_id: [null],
      ms_type_clause_ids: [[]],
			organization_ids: ['', [Validators.required]],
			division_ids: [[]],
			department_ids: [[]],
      sub_section_ids: [[]],
			section_ids: [[]],
      start_date: ['', [Validators.required]],
      // end_date: ['', [Validators.required]],
      designation_ids: [[]],
      responsible_user_ids: [[],[Validators.required]],
      // review_user_ids: [[], [Validators.required]],
      time_frame:[null, [Validators.pattern("^[0-9]*$"), Validators.minLength(50)]],
      target:['', [Validators.required]],
      unit_id:[null, [Validators.required]],
      current_value:[''],
      data_inputs:[[]],
      formula:[''],
      kpi_calculation_type_id:[null, [Validators.required]],
    });

    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
			this.form.controls['division_ids'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
			this.form.controls['section_ids'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
			this.form.controls['sub_section_ids'].setValidators(Validators.required);

      this.form.get('kpi_calculation_type_id').valueChanges.subscribe(val => {// prv Kpi title set title
        this.manual(val?.type);
      });

    this.dataInputArray=[];
    this.msTypeClauses=[];
    KpisStore.emptyArray();

    this.getKpireviewfrequency();
    this.getOrganization();

    setTimeout(() => {
      window.addEventListener("scroll", this.scrollEvent, true);  // scroll event
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    }, 1000);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: "../" }]);

    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelKpi(item);
    });

    // kpi modal
    this.userKpiSubscriptionEvent = this._eventEmitterService.userKpiControl.subscribe(res => {
      this.closeKpiModalAdd();
      this.searchKpi({ term: KpiMasterStore.lastInsertedId });
    });

    this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(res => {
				this.closeOrganizationModal();
		});

    //File-Upload
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		});

    // for showing initial tab
    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);

    this.form.get('ms_type_organization_id').valueChanges.subscribe(val =>{
      this.msTypeClauses.length=0;
      if(val?.ms_type_id){
        this.msTypeClausesDetials(val?.ms_type_id);
      }
    })

    this.form.get('kpi_id').valueChanges.subscribe(val => {//kpi select depents on descprtion,traget and unit
      if (val) {

        setTimeout(() => {
          this.form.patchValue({ 
            description: KpisStore.individualKpiDetails?.description? KpisStore.individualKpiDetails?.description: (val?.description? val?.description:''),
            unit_id:{
              id: KpisStore.individualKpiDetails?.unit ? KpisStore.individualKpiDetails?.unit?.id :(val?.unit_id? val?.unit_id: (val?.unit ? val?.unit?.id : 1)),
              title: KpisStore.individualKpiDetails?.unit ? KpisStore.individualKpiDetails?.unit?.title :(val?.unit_title? val?.unit_title :(val?.unit ? val?.unit?.title : '%')),
            },
            target: KpisStore.individualKpiDetails?.target ? KpisStore.individualKpiDetails?.target : (val?.target? val?.target:''),
          });
        }, (this.currentTab==1?100:0));
      }

    });

    if(this._router.url.indexOf('edit-kpi') != -1){
      if(KpisStore.editFlag && KpisStore.kpiId){
          this.getDetails();
      }else{
        this._router.navigateByUrl('/kpi-management/kpis');
      }
    } else {
			this.setInitialOrganizationLevels();
		}
  }

  getDetails(flag:boolean=true){
    this._kpisService.getItem( KpisStore.kpiId ).subscribe(res => {
      if(flag){
        this.kpiEdit();
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  
  //MS type logic sction
  
  //changeStatus in the item
  //array id push
  //array INDEX check with remove
  changeCheckItemStatus(event, id){
    
    if(event.target.checked){
      KpisStore.pushId(id);
    }else{
      KpisStore.removeId(id);
    }
  }  
    // check item in form array
    checkedItem(id){
      return  KpisStore.checkId(id);
    }
  

  feastActtiveClassFlag(id){
    if(id==this.feastActtiveClassFlagIndexId)
      this.feastActtiveClassFlagIndexId=null;
    else  
      this.feastActtiveClassFlagIndexId=id;
  }

  setMSTypeClauseslist(items){
    this.msTypeClauses.length=0;

    this.msTypeClauses=[...items];
    // msTypeClauses
  }

  //** MS TYPE logic sction
  
  //Time Frame  
  numberValidation(event){
    // if(isNaN(this.form.value.time_frame))
    //   this.timeFrameValidtionError=false;
    // else
    //   this.timeFrameValidtionError=true;

  }

  // gretherThanCrrentValue(){
  //   if(parseInt(this.form?.value?.target)<parseInt(this.form?.value?.current_value)){
  //     return true;
  //   }else{
  //     return false;
  //   }

  // }

  //Formula
  formulaButtonValidtion(){
    
    if(this.currentTab==1 && this.automation){
      let valuedation:boolean;
      if(this.formulaSymbolError==null && this.formulaError==null){

        if(this.dataInputArray.length>0){
          for (let index = 0; index < this.dataInputArray.length; index++) {

            if(this.checkVaribleFormula(this.dataInputArray[index].variable)){
              this.forumlaNotFillError=null;
              valuedation= false;
            }else{
          
              if(this.form.value.formula.length>1){
                this.forumlaNotFillError=this.dataInputArray[index].variable;
              }
              valuedation= true;
              break;
            }
          }
        }else{
          valuedation= true;
        }
      } else{
        valuedation= true;  
      }
      return valuedation;
    }  
  }

  checkVaribleFormula(variable){
    if(this.form.value.formula.includes(variable)){
      return true;
    }else{
      return false;
    }
  }

  formulaCheck(event:any){
    this.formulaSymbolError=null;
    let foundLettter=[];
    for (const c of event.target.value) {
      
      let found = this.alphabet.find(element => element==c);
      
      if(found){
        foundLettter.push(found);
      }else{
        let syboml= this.syboml.find(element=> element==c);
        if(syboml){
          this.formulaError=null;
        } else{    
          this.formulaSymbolError=c;
        }
      }
    }

    if(foundLettter.length>0){
      for (let index = 0; index < foundLettter.length; index++) {
        const found = this.dataInputArray.find(item => item.variable== foundLettter[index]);
        if(found){
          this.formulaError=null;
        }else{
          this.formulaError=foundLettter[index];
          break;
        }
      }
    }else{
      this.formulaError=null;
    }

    this._utilityService.detectChanges(this._cdr);
  }
  //**Formula

  //remove Designation Base
  removeDesignatioBaseRemove(event){

    let responsibleUserArrayTemp=this.form.value.responsible_user_ids;
    let responsibleUserArray=[];

    this.form.patchValue({ "responsible_user_ids": [] });
  
    responsibleUserArrayTemp.forEach((item) => {
        if(item.designation_id!=event.value.id){
          responsibleUserArray.push(item);
        }
    });

    this.form.patchValue({ "responsible_user_ids": responsibleUserArray });
    
    

    // let reviewUserArrayTemp=this.form.value.review_user_ids;
    // let reviewUserArray=[];

    // this.form.patchValue({ "review_user_ids": [] });
  
    // reviewUserArrayTemp.forEach((item) => {
    //     if(item.designation_id!=event.value.id){
    //       reviewUserArray.push(item);
    //     }
    // });

    // this.form.patchValue({ "review_user_ids": reviewUserArray });
  }

  // removeDesignatioAllClear(){
  //   this.form.patchValue({ "responsible_user_ids": [] ,"review_user_ids": [] });
  // }
  //**remove Designation Base

  //Data input
  addDataInput(data){
    this.dataInputError=false;
    this.dataInputArray.forEach(res=>{
      if(res.title==data){
        this.dataInputError=true;
      }
    });
    
    if(!this.dataInputError){
      this.dataInputArray.push({
        "title":data,
        "variable":this.dataInputArray.length>25 ?`${this.alphabet[this.dataInputArray.length-26]}-${this.dataInputArray.length-25}` :this.deleteIssueInputOvering()
      });

      this.newDataInput=null;
      
    }
  }

  deleteIssueInputOvering(){
    let variable;
    if(this.dataInputArray.length==0){
      variable=this.alphabet[this.dataInputArray.length];
    }else{
      let lastElement = this.dataInputArray[this.dataInputArray.length-1];
      let alpLastindex = this.alphabet.findIndex(element=> element== lastElement.variable);
      variable= this.alphabet[ alpLastindex + 1 ];
    }
    return variable;
  }

  onKeyDataInput(e){
    if(e.key!='Enter')
      this.dataInputError=false;
  }

  deleteDataInput(item, index){
    
    let value = this.dataInputArray[index];

    if(!value.hasOwnProperty('id')){
      this.dataInputArray.splice(index,1);
    }else{
        this.deleteDataInputArray.push({
          is_deleted:true,
          ...item
      });
      this.dataInputArray.splice(index,1);
    }

    if(this.dataInputArray.length==0){
      this.form.controls['formula'].setValue('');
    }

    this._utilityService.detectChanges(this._cdr);
  }
  //**Data input

  //automtion

  manual(type){

    const index = this.formObject[1].indexOf('formula');// valuddation dinamically 
    if (index > -1) {
      this.formObject[1].splice(index, 1); 
    }

    const index2 = this.formObject[1].indexOf('data_inputs');
    if (index2 > -1) {
      this.formObject[1].splice(index2, 1); 
    }

    if(type!=undefined){
      if (type=="automation"||type=="calculate") {
        this.formObject[1].push('formula','data_inputs');
        this.automation=true;
        this.form.controls.formula.setValidators([Validators.required]);
        this.form.controls.formula.updateValueAndValidity();
      } else{

        this.automation=false;
        this.form.controls.formula.setValidators(null);
        this.form.controls.formula.updateValueAndValidity();
      }
    }
    
    this._utilityService.detectChanges(this._cdr);
  }

  //Edit
  kpiEdit(){

    this.clearCommonFilePopupDocuments();
    if ( KpisStore.individualKpiDetails.documents.length > 0) {
      this.setDocuments(KpisStore.individualKpiDetails.documents);
    }

    if(KpisStore.individualKpiDetails?.calculation_type){
      this.manual(KpisStore.individualKpiDetails?.calculation_type?.type);
    }
    
    KpisStore.emptyArray();
    if(KpisStore.individualKpiDetails?.ms_type_clauses.length>0){
      for(let item of toJS(KpisStore.individualKpiDetails?.ms_type_clauses)){
        KpisStore.pushId(item?.id);
      }
    }
    
    this.msTypeClausesDetials( KpisStore.individualKpiDetails.ms_type_organization?.ms_type?.id);

    this.form.patchValue({
      id: KpisStore.individualKpiDetails.id? KpisStore.individualKpiDetails.id :null,
      //reference_code: KpisStore.individualKpiDetails.reference_code ? KpisStore.individualKpiDetails.reference_code : '',
      kpi_id: KpisStore.individualKpiDetails.kpi? KpisStore.individualKpiDetails.kpi :null,
      description: KpisStore.individualKpiDetails.description? KpisStore.individualKpiDetails.description :null,
			organization_ids: KpisStore.individualKpiDetails.organizations ? this.getEditValue(KpisStore.individualKpiDetails.organizations) : [],
			division_ids: KpisStore.individualKpiDetails.divisions ? this.getEditValue(KpisStore.individualKpiDetails.divisions) : [],
			department_ids: KpisStore.individualKpiDetails.departments ? this.getEditValue(KpisStore.individualKpiDetails.departments) : [],
			section_ids: KpisStore.individualKpiDetails.sections ? this.getEditValue(KpisStore.individualKpiDetails.sections) : [],
      sub_section_ids: KpisStore.individualKpiDetails.sub_sections ? this.getEditValue(KpisStore.individualKpiDetails.sub_sections) : [],
      // department_id:  KpisStore.individualKpiDetails.department? KpisStore.individualKpiDetails.department :null,
      start_date: KpisStore.individualKpiDetails.start_date ? this._helperService.processDate(KpisStore.individualKpiDetails.start_date, 'split') : '',
      ms_type_organization_id: KpisStore.individualKpiDetails.ms_type_organization? {
        id: KpisStore.individualKpiDetails.ms_type_organization?.id,
        ms_type_id: KpisStore.individualKpiDetails.ms_type_organization?.ms_type?.id,
        ms_type_title: KpisStore.individualKpiDetails.ms_type_organization?.ms_type?.title,
        ms_type_version_title: KpisStore.individualKpiDetails.ms_type_organization?.ms_type_version?.title
      } : null,
        // ms_type_clause_ids: KpisStore.individualKpiDetails?.ms_type_clauses.length>0,
    
      // end_date:KpisStore.individualKpiDetails.end_date ? this._helperService.processDate(KpisStore.individualKpiDetails.end_date, 'split') : '',
      kpi_review_frequency_id:  KpisStore.individualKpiDetails.kpi_review_frequency? this.KpiReviewFrequenciesProcessEdit(KpisStore.individualKpiDetails.kpi_review_frequency) :null,
      designation_ids:  KpisStore.individualKpiDetails.designations? this._helperService.getArrayProcessed(KpisStore.individualKpiDetails.designations, null) : [],
      responsible_user_ids: KpisStore.individualKpiDetails.responsible_users ?  this._helperService.getArrayProcessed(KpisStore.individualKpiDetails.responsible_users, false) : [],
      // review_user_ids: KpisStore.individualKpiDetails.review_users ?  this._helperService.getArrayProcessed(KpisStore.individualKpiDetails.review_users, false) : [],
      time_frame: KpisStore.individualKpiDetails.time_frame? KpisStore.individualKpiDetails.time_frame :null,
      target: KpisStore.individualKpiDetails.target? KpisStore.individualKpiDetails.target :'',
      unit_id: KpisStore.individualKpiDetails.unit? KpisStore.individualKpiDetails.unit :null,
      current_value: KpisStore.individualKpiDetails.current_value? KpisStore.individualKpiDetails.current_value :'',
      formula: KpisStore.individualKpiDetails.formula? KpisStore.individualKpiDetails.formula :'',
      kpi_calculation_type_id: KpisStore.individualKpiDetails.calculation_type? this.KpiCalculationTypeProcessEdit(KpisStore.individualKpiDetails.calculation_type) :null,
    });

    if(KpisStore.individualKpiDetails?.data_inputs){
      this.dataInputArray=KpisStore.individualKpiDetails?.data_inputs;
    }

     //This object collect dates and id is use form_3 calculations
    // this.reviewFrequenciesObj={
    //   kpi_review_frequency_id:  KpisStore.individualKpiDetails.kpi_review_frequency?KpisStore.individualKpiDetails.kpi_review_frequency.id :null,
    //   start_date: KpisStore.individualKpiDetails.start_date ,
    //   end_date:KpisStore.individualKpiDetails.end_date ,
    // }
  }

  KpiCalculationTypeProcessEdit(CalculationType:CalculationType){
    let Calculation={
      id:CalculationType.id,
      title: CalculationType?.kpi_calculation_type_language[0]?.pivot?.title
    }

    return Calculation ;
  }

  KpiReviewFrequenciesProcessEdit(Review:KpiReviewFrequency){
    let reviewFrequnce={
      id:Review.id,
      title: Review.title
    }

    return reviewFrequnce ;
  }
  //**Edit

  // *Common File Upload/Attach Modal Functions Starts Here

  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	setDocuments(documents) {
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
					var purl = this._kpiManagementFileService.getThumbnailPreview('kpi-document', element.token)
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

	openFileUploadModal() {
  
    this.FileUploadScoreObject['department_ids']=this._helperService.getArrayProcessed(this.form.value.department_ids, 'id').toString();
    
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
			this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
			setTimeout(() => {
				this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
				this._utilityService.detectChanges(this._cdr)
			}, 100);
		}, 250);
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
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999'); // For Modal to Get Focus
				this._utilityService.detectChanges(this._cdr)
			}, 200);
		}, 100);
	}

	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

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
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

	// **Common File Upload/Attach Modal Functions Ends Here

  //Modal
  kpiModalAdd() {
    KpisStore.kpiformModal=true; 
    setTimeout(() => {
      $(this.kpiformModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.kpiformModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.kpiformModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.kpiformModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
  }

  closeKpiModalAdd() {
    KpisStore.kpiformModal=false; 
    $(this.kpiformModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.kpiformModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.kpiformModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.kpiformModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  	// calling required datas for form

	organisationChanges() {
		this.openModelPopup = true;
		this._renderer2.addClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	closeOrganizationModal(data?) {
		if (data) {
			this.form.patchValue({
				organization_ids: data.organization_ids ? data.organization_ids : [],
				division_ids: data.division_ids ? data.division_ids : [],
				department_ids: data.department_ids ? data.department_ids : [],
				section_ids: data.section_ids ? data.section_ids : [],
				sub_section_ids: data.sub_section_ids ? data.sub_section_ids : [],
			})
		}
		this._renderer2.removeClass(this.organisationChangeFormModal.nativeElement, 'show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
		this.openModelPopup = false;
		this._utilityService.detectChanges(this._cdr);
	}
  //**Modal

  // getting organization
	getOrganization() {
		this._subsiadiaryService.getAllItems(false).subscribe((res: any) => {
			if (!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
				this.form.patchValue({ organization_ids: [res.data[0]] });
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

  setInitialOrganizationLevels() {
		this.form.patchValue({
			division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
			department_ids: AuthStore.user.department ? [AuthStore.user.department] : [],
			section_ids: AuthStore.user.section ? [AuthStore.user.section] : [],
			sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : []
		});
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this.form.patchValue({ organization_ids: [AuthStore.user?.organization] });
		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.form.value.division_ids });
		this.searchDepartment({ term: this.form.value.department_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.form.value.section_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.form.value.sub_section_ids });
		this._utilityService.detectChanges(this._cdr);
	}

  handleDropDownClear(type) {
		switch (type) {
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
			case 'section_id': this.form.controls['sub_section_ids'].reset();

				break;
			default: '';
				break;
		}
	}

	handleDropDownItemClear(event, type) {
		switch (type) {
			case 'organization_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
				this.checkDivision(event.value.id, type);
				this.checkDepartment(event.value.id, type);
				if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
					this.checkSection(event.value.id, type);
				if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
					this.checkSubSection(event.value.id, type);

				break;
			case 'division_id': this.checkDepartment(event.value.id, type);

				break;
			case 'department_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
				this.checkSection(event.value.id, type);

				break;
			case 'section_id': if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
				this.checkSubSection(event.value.id, type);

				break;

			default: '';
				break;
		}
	}

	checkDivision(organizationId: number, type: string) {
		let divisionValue: [] = this.form.value.division_ids;
		for (var i = 0; i < divisionValue?.length; i++) {
			let divOrganizationId = divisionValue[i][type];
			if (organizationId == divOrganizationId) {
				divisionValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['division_ids'].setValue(divisionValue);
		this._utilityService.detectChanges(this._cdr);
	}

	checkDepartment(divisionId: number, type: string) {
		let departmentValue: [] = this.form.value.department_ids;
		for (var i = 0; i < departmentValue?.length; i++) {
			let deptDivisionId = departmentValue[i][type];
			if (divisionId == deptDivisionId) {
				if (type == 'division_id') this.checkSection(departmentValue[i]['id'], 'department_id');
				departmentValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['department_ids'].setValue(departmentValue);
		this._utilityService.detectChanges(this._cdr);
	}

	checkSection(departmentId: number, type: string) {
		let sectionValue: [] = this.form.value.section_ids;
		for (var i = 0; i < sectionValue?.length; i++) {
			let sectionDepartmentId = sectionValue[i][type];
			if (departmentId == sectionDepartmentId) {
				if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.checkSubSection(sectionValue[i]['id'], 'section_id');
				sectionValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['section_ids'].setValue(sectionValue);
		this._utilityService.detectChanges(this._cdr);
	}

	checkSubSection(sectionId: number, type: string) {
		let subSectionValue: [] = this.form.value.sub_section_ids;
		for (var i = 0; i < subSectionValue?.length; i++) {
			let subSectionSectionId = subSectionValue[i][type];
			if (sectionId == subSectionSectionId) {
				subSectionValue.splice(i, 1);
				i--;
			}
		}
		this.form.controls['sub_section_ids'].setValue(subSectionValue);
		this._utilityService.detectChanges(this._cdr);
	}

	subsidiariesChange() {
		if (this.form.value.organization_ids.length == 0) {
			this.form.controls['division_ids'].reset();
			this.form.controls['department_ids'].reset();
			this.form.controls['section_ids'].reset();
			this.form.controls['sub_section_ids'].reset();
		}
	}


	// geting department
	getDepartment() {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}


			this._departmentService.getItems(false, params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			DepartmentMasterStore.setAllDepartment([]);
		}
	}
	// for searching the department

	searchDepartment(event) {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}


			this._departmentService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}

	// for getting  division

	getDivision() {
		let params = '';
		if (this.form.value.organization_ids) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.value.organization_ids);

			this._divisionService.getItems(false, params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			DivisionMasterStore.setAllDivision([]);
		}

	}


	// getting section
	getSection() {

		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}


			this._sectionService.getItems(false, params).subscribe(res => {

				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			SectionMasterStore.setAllSection([]);
		}
	}

	// getting sub section
	getSubSection() {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}

			if (this.form.get('section_ids').value) {
				if (params)
					params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
				else
					params = '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
			}


			this._subSectionService.getItems(false, params).subscribe(res => {

				this._utilityService.detectChanges(this._cdr);
			})
		} else {
			SubSectionMasterStore.setAllSubSection([]);
		}

	}


	// search sub section

	searchSubSection(e) {

		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}

			if (this.form.get('section_ids').value) {
				if (params)
					params = params + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
				else
					params = '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
			}

			this._subSectionService.getItems(false, '&q=' + e.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}



	// for searching the Section

	searchSection(event) {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			if (this.form.get('division_ids').value) {
				if (params)
					params = params + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
				else
					params = '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			}
			if (this.form.get('department_ids').value) {
				if (params)
					params = params + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
				else
					params = '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			}

			this._sectionService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}

	// seraching division

	searchDivision(event) {
		let params = '';
		if (this.form.get('organization_ids').value) {
			params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value);

			this._divisionService.getItems(false, '&q=' + event.term + params).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
	}


	// for searching organization

	searchOrganization(event) {
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this._subsiadiaryService.getAllItems(false, '&q=' + event.term).subscribe((res) => {
				this._utilityService.detectChanges(this._cdr);
			});
		}

	}

  	// Returns Values as Array for multiple select case
	getEditValue(field) {
		var returnValue = [];
		for (let i of field) {
			returnValue.push(i);
		}
		return returnValue;

	}

  msTypeClausesDetials(msTypeId){
    this._kpisService.getClausesByMstypes(msTypeId).subscribe(res => {
      this.setMSTypeClauseslist(toJS(AuditPlanScheduleMasterStore.msTypeClauses));
      this._utilityService.detectChanges(this._cdr);
    });
  }
  

  //List and search 
  getKpi() {
    this._kpiService.getKpis(false,'is_kpi_management=true').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchKpi(event) {
    this._kpiService.getSearchItems('q=' + event.term +'&is_kpi_management=true').subscribe(res => {
      if (KpiMasterStore.lastInsertedId ) {
        for (let item of res.data) {
          if (KpiMasterStore.lastInsertedId  == item.id) {
            this.form.patchValue({ 
              kpi_id: item,
              description: item?.description? item?.description :null,
              unit_id:{
                id: item?.unit_id? item?.unit_id:1,
                title: item?.unit_title? item?.unit_title:"%",
              },
              target: item?.target? item?.target :'',
            });
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getKpireviewfrequency(){
    this._kpiReviewFrequenciesService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchKpireviewfrequency(event) {
    this._kpiReviewFrequenciesService.getSearchItems('q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDesignatios() {
    this._designationService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDesignations(e) {
    this._designationService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMsType(event) {
    this._msTypeService.getItems(false, '&q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getMsType() {
    this._msTypeService.getItems(true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getAllUsers() {
    UsersStore.setAllUsers([]);
    
    if(this.form.value.designation_ids.length>0){
      var params = '?page=1&designation_ids=' + this._helperService.createParameterFromArray(this.form.get('designation_ids').value);
      this._usersService.getAllItems(params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }else{
      this._usersService.getAllItems().subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  searchUsers(e) {
    if(this.form.value.designation_ids.length>0){
      let params = '';
		  params = '?designation_ids=' + this._helperService.createParameterFromArray(this.form.get('designation_ids').value);
      if (params) params = params + '&q=' + e.term;
      else params = '?q=' + e.term;
      
      this._usersService.searchUsers(params ? params : '').subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }else{
      let params = '';
      if (params) params = params + '&q=' + e.term;
      else params = '?q=' + e.term;
      this._usersService.searchUsers(params ? params : '').subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
    }
  }

  getUnit() {
    this._unitService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchUnit(event) {
    this._unitService.searchItem('q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getkpiCalculationType() {
    this._kpiCalculationTypesService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchkpiCalculationType(e) {
    this._kpiCalculationTypesService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  //**List and search 

  //common support

  createImageUrl(type,token) {
    if(type=='document-version'){
      return this._documentFileService.getThumbnailPreview(type, token);
    }else if(type=='kpi-document'){
      return this._kpiManagementFileService.getThumbnailPreview(type, token);
    }else{
      return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
    }
  }

  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  getNoDataSource(type){
    let noDataSource = {
      noData:"no_attachments_found", border: false, imageAlign: type
    }
    return noDataSource;
  }

  generateIdforString(id:number){
    return `id${id.toString()}`;
  }

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

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  //**common support


  // ************ step from 
  changeStep(step) {
    if (step > this.currentTab && this.checkFormObject(step)) {
      let dif = step - this.currentTab;
      this.nextPrev(dif)
    }
    else if (step < this.currentTab) {
      let dif = this.currentTab - step;
      this.nextPrev(-dif);
    }
  }

  checkFormObject(tabNumber?: number) {
    
    var setValid = true;
    if (!tabNumber) {
      if (this.formObject.hasOwnProperty(this.currentTab)) {

        for (let i of this.formObject[this.currentTab]) {
          if(i=='data_inputs'){
            if(this.dataInputArray.length>0){
              setValid = true;
            }else{
              if(this.automation){
                setValid = true;
              }else{
                setValid = false;
              }
            }
          }else{
            if (!this.form.controls[i].valid) {
              setValid = false;
              break;
            }
          }
        
        }
      }
    }
    else {
      for (var i = 0; i < tabNumber; i++) {
        if (this.formObject.hasOwnProperty(i)) {
        
          for (let k of this.formObject[i]) {
            if(k=='data_inputs'){
              if(this.dataInputArray.length>0){
                setValid = true;
              }else{
                if(this.automation){
                  setValid = true;
                }else{
                  setValid = false;
                }
              }
            }else{
              if (!this.form.controls[k].valid) {
                setValid = false;
                break;
              }
            }
          }
        }
      }
    }
    
    return setValid;
  }

  nextPrev(n?: number, buttonClick?:boolean) { //next button and prv button
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
    this.currentTab = this.currentTab + n;

    if (n != -1 && buttonClick) {
      switch (this.currentTab) {
        case 1:
            this.submitForm_1();
          break;
        // case 2:
        //     this.submitForm_2();
        //   break;
        case 2:
            this.submitForm_2();
          break;
        default:
          break;
      }
		}
    
    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
    
      this.submitForm_3();
      return false;
    }
    // Otherwise, display the correct tab:
    this.showTab(this.currentTab);
    
  }

  saveTabDetails(){
    switch (this.currentTab) {
      case 0:
          this.submitForm_1();
        break;
      // case 1:
      //     this.submitForm_2();
      //   break;
      case 1:
          this.submitForm_2();
        break;
      default:
        break;
    }
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

    if (n == (x.length - 1)) {
      this.getSelectedValues();
      if (document.getElementById("nextBtn")) this.nextButtonText = "save";
    } else {

      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n);
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

  getSelectedValues() {//last tab data collection //old setform change 
    if(KpisStore.kpiId){
      this.getDetails(false);
    }
  }

  // Setting Intial Tab
  setIntialTab() {
    var x: any = document.getElementsByClassName("tab");
    for (let i = 0; i < x.length; i++) {
      if (i == 0) x[i].style.display = "block";
      else x[i].style.display = "none";
    }
  }

  confirmCancel() {
    this.cancelObject.type = 'Cancel';
    this.cancelObject.title = 'cancel_kpi_creation';
    this.cancelObject.subtitle = 'entered_data_will_lost';
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    },100);
  }

  cancelKpi(status) {
    if (status) {
      if (KpisStore.kpiId) {
        this._router.navigateByUrl('kpi-management/kpis/' + KpisStore.kpiId);
      }else{
        this._router.navigateByUrl('kpi-management/kpis');
      }
      AppStore.disableLoading();
    }
      setTimeout(() => {
        $(this.cancelPopup.nativeElement).modal('hide');
        this.clearCancelObject();
    }, 250);
  }

  clearCancelObject() {
    this.cancelObject.type = '';
    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';
  }

  // scroll event
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.formSteps.nativeElement, 'small');
        this._renderer2.addClass(this.navigationBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.formSteps.nativeElement, 'small');
        this._renderer2.removeClass(this.navigationBar.nativeElement, 'affix');
      }
    }
  };
  // ********* step from *************

  setSaveData_1(){
    let saveData:any=null;
    // this.reviewFrequenciesObj={};

    saveData={
      //reference_code: this.form.value.reference_code? this.form.value.reference_code : null,
      kpi_id: this.form.value.kpi_id? this.form.value.kpi_id?.id: null,
      description: this.form.value.description? this.form.value.description: '',
      kpi_review_frequency_id: this.form.value.kpi_review_frequency_id? this.form.value.kpi_review_frequency_id?.id: null,
			organization_ids: [],
			division_ids: [],
			department_ids: [],
			section_ids: [],
      sub_section_ids: [],
      responsible_user_ids: this.form.value.responsible_user_ids ? this._helperService.getArrayProcessed(this.form.value.responsible_user_ids, 'id') : [],
      ms_type_organization_id: this.form.value.ms_type_organization_id? this.form.value.ms_type_organization_id.id: null,
      ms_type_clause_ids: KpisStore.allClauseItemsArray,
      start_date: this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date, 'join') : '',
      // end_date: this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date, 'join') : '',
      documents: KpisStore.kpiId?this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile): this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save'),
    }

    if (this.form.value.organization_ids) {
			this.form.value.organization_ids.forEach(element => {
				saveData.organization_ids.push(element.id);
			});
		}

    if (this.form.value.division_ids) {
			this.form.value.division_ids.forEach(element => {
				saveData.division_ids.push(element.id);
			});
		}

		if (this.form.value.department_ids) {
			this.form.value.department_ids.forEach(element => {
				saveData.department_ids.push(element.id);
			});

		}

		if (this.form.value.section_ids) {
			this.form.value.section_ids.forEach(element => {
				saveData.section_ids.push(element.id);
			});
		}

		if (this.form.value.sub_section_ids) {
			this.form.value.sub_section_ids.forEach(element => {
				saveData.sub_section_ids.push(element.id);
			});
		}

    return saveData;
  }

  saveDocument(){
    if (KpisStore.kpiId) {
			return this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);     
		} else{
      return this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');   
		} 
  }

  saveProceesDataInput(){
    let array=[];
    
      this.dataInputArray.forEach(item=>{
        if(item.id){
          array.push({
            "is_new":false,
            "is_deleted":false,
            ...item
          })
        } else{
          array.push({
            "is_new":true,
            ...item
          })
        }
      });

      if(this.deleteDataInputArray.length){
        this.deleteDataInputArray.forEach(item=>{
          array.push({
            "is_new":false,
            "is_deleted":true,
            ...item
          })
        })
      }

    return array;
  }

  setSaveData_3(){
    let saveData=null;
    if(this.automation){
      saveData=null;
      saveData={
      
        time_frame: this.form.value.time_frame? this.form.value.time_frame: null,
        target: this.form.value.target? this.form.value.target: '',
        unit_id: this.form.value.unit_id? this.form.value.unit_id.id: null,
        current_value: this.form.value.current_value? this.form.value.current_value: '',
        data_inputs: this.dataInputArray.length>0 ? this.saveProceesDataInput():[],
        formula: this.form.value.formula? this.form.value.formula: '',
        kpi_calculation_type_id: this.form.value.kpi_calculation_type_id ?this.form.value.kpi_calculation_type_id.id :null,
      }
    }else{
      saveData=null;
      saveData={
        time_frame: this.form.value.time_frame? this.form.value.time_frame: null,
        target: this.form.value.target? this.form.value.target: '',
        unit_id: this.form.value.unit_id? this.form.value.unit_id.id: null,
        current_value: this.form.value.current_value? this.form.value.current_value: '',
        kpi_calculation_type_id: this.form.value.kpi_calculation_type_id ?this.form.value.kpi_calculation_type_id.id :null,
      }
    }

    return saveData;
  }

  submitForm_1(){
    AppStore.enableLoading();
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";
    this.formErrors = null;

    let save;
    if (KpisStore.kpiId) {
      save = this._kpisService.updateItem_tab_1(KpisStore.kpiId, this.setSaveData_1());
    }
    else {
      save = this._kpisService.saveItem_tab_1(this.setSaveData_1());
    }

    save.subscribe(res => {
      AppStore.disableLoading();
      this.nextButtonText = "Save & Next";
      this.previousButtonText = "previous";
      KpisStore.setKpiId(res.id);
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422 || err.status == 405) {
        this.formErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "Save & Next";
        this.previousButtonText = "previous";
        this.setIntialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }else {
        KpisStore.setKpiId(null);
      }
    })
  }

  submitForm_2(){
    AppStore.enableLoading();
    this.nextButtonText = "loading";
    this.previousButtonText = "loading";
    this.formErrors = null;

    let save;
    if (KpisStore.kpiId) {
      save = this._kpisService.updateItem_tab_3(KpisStore.kpiId, this.setSaveData_3());
    }

    save.subscribe(res => {
      AppStore.disableLoading();
      this.getDetails();
      this.nextButtonText = "save";
      this.previousButtonText = "previous";
      this._utilityService.detectChanges(this._cdr);
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422|| err.status == 405) {
        this.formErrors = err.error.errors;
        this.currentTab = 0;
        this.nextButtonText = "Save & Next";
        this.previousButtonText = "previous";
        this.setIntialTab();
        this.showTab(this.currentTab);
        this._utilityService.detectChanges(this._cdr);
      }
      else {
        KpisStore.setKpiId(null);
      }
    })
  }

  submitForm_3(){
    this._kpisService.showSubmitMsg();
    this._router.navigateByUrl('kpi-management/kpis/' + KpisStore.kpiId);
    this._utilityService.detectChanges(this._cdr);
  }

  // document
  // kh-module base document-document
  viewDocument(type, documents, documentFile) {
    
    switch (type) {
      case "kpi-document":
        this._kpiManagementFileService
          .getFilePreview(type, documents.kpi_management_kpi_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(type, resp, documentFile, documents);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
  
        case "document-version":
          this._documentFileService
            .getFilePreview(type, documents.document_id, documentFile.id)
            .subscribe((res) => {
              var resp: any = this._utilityService.getDownLoadLink(
                res,
                documents.title
              );
              this.openPreviewModal(type, resp, documentFile, documents);
            }),
            (error) => {
              if (error.status == 403) {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Permission Denied"
                );
              } else {
                this._utilityService.showErrorMessage(
                  "Error",
                  "Unable to generate Preview"
                );
              }
            };
          break;

    }
  }

  // kh-module base document-document
  downloadDocumentFile(type, document, docs?) {
    event.stopPropagation();
    switch (type) {
      case "kpi-document":
        this._kpiManagementFileService.downloadFile(
          type,
          document.kpi_management_kpi_id,
          document.id,
          null,
          document.title,
          document
        );
        break;
      case "document-version":
        this._documentFileService.downloadFile(
          type,
          document.document_id,
          docs.id,
          null,
          document.title,
          docs
        );
        break;
    }
  }

  // kh-module base document-document
  openPreviewModal(type, filePreview, documentFiles, document) {
    this.previewObject.component=type;
  
    let previewItem = null;
    if (filePreview) {
      previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
      this.previewObject.preview_url = previewItem;
      this.previewObject.file_details = documentFiles;
      this.previewObject.componentId = document.kpi_management_kpi_id;
      
      this.previewObject.uploaded_user = KpisStore.individualKpiDetails.created_by;
      document.updated_by ? document.updated_by : document.created_by;
      this.previewObject.created_at = document.created_at;
      $(this.filePreviewModal.nativeElement).modal("show");
      this._utilityService.detectChanges(this._cdr);
    }
  }

  // Closes from preview-document
  closePreviewModal(event) {
  $(this.filePreviewModal.nativeElement).modal("hide");
  this.previewObject.preview_url = "";
  this.previewObject.uploaded_user = null;
  this.previewObject.created_at = "";
  this.previewObject.file_details = null;
  this.previewObject.componentId = null;
  }

  // **document

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    KpisStore.unsetEditFlag();
    this.cancelEventSubscription.unsubscribe();
    this.userKpiSubscriptionEvent.unsubscribe();
    KpisStore.unsetIndividualKpiDetails();
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.organisationChangesModalSubscription.unsubscribe();

    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }
}
