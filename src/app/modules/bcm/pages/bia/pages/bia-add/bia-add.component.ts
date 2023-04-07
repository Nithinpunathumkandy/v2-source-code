import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { LocationService } from 'src/app/core/services/masters/general/location/location.service';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { SubsidiaryStore } from "src/app/stores/organization/business_profile/subsidiary/subsidiary.store";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { LocationMasterStore } from 'src/app/stores/masters/general/location-store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { BiaMatrixStore } from 'src/app/stores/bcm/configuration/bia-matrix.store';
import { AprDemoStore } from 'src/app/modules/bpm/apr-store';
import { BiaDemoStore } from 'src/app/modules/bcm/bia-store';
import { element } from 'protractor';
import { AprService } from 'src/app/core/services/bpm/advanced-process/apr.service';
import { AdvanceProcessStore } from 'src/app/stores/bpm/process/advance-process.store';
import { BiaService } from 'src/app/core/services/bcm/bia/bia.service';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { ProcessService } from 'src/app/core/services/bpm/process/process.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { BiaRatingService } from 'src/app/core/services/bcm/bia-rating/bia-rating.service';
import { BiaRatingStore } from 'src/app/stores/bcm/configuration/bia-rating/bia-rating-store';
import { BiaSettingStore } from 'src/app/stores/settings/bia-settings.store';
import { BiaSettingsService } from 'src/app/core/services/settings/organization_settings/bia-settings/bia-settings.service';
import { BiaScaleService } from 'src/app/core/services/bcm/bia-scale/bia-scale.service';
import { BiaScaleStore } from 'src/app/stores/bcm/configuration/bia-scale/bia-scale-store';
import { BiaTireService } from 'src/app/core/services/masters/bcm/bia-tire/bia-tire.service';
import { BiaTireMasterStore } from 'src/app/stores/masters/bcm/bia-tire';
import { BiaImpactCategoryInformationService } from 'src/app/core/services/masters/bcm/bia-impact-category-information/bia-impact-category-information.service';

declare var $: any;
@Component({
  selector: 'app-bia-add',
  templateUrl: './bia-add.component.html',
  styleUrls: ['./bia-add.component.scss']
})
export class BiaAddComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild("formSteps") formSteps: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('criteriaPopup') criteriaPopup: ElementRef;
  @ViewChild('objectivePopup') objectivePopup: ElementRef;
  @ViewChild("navigationBar") navigationBar: ElementRef;
  @ViewChild('locationMaster') locationMaster: ElementRef;
  @ViewChild('listItem') listItem: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  DepartmentStore = DepartmentMasterStore;
  DivisionStore = DivisionMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  SubsidiaryStore = SubsidiaryStore;
  BiaSettingStore = BiaSettingStore
  BiaRatingStore = BiaRatingStore
  AdvanceProcessStore = AdvanceProcessStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  UsersStore = UsersStore
  BiaMatrixStore = BiaMatrixStore
  BiaScaleStore = BiaScaleStore
  AprDemoStore = AprDemoStore
  BiaDemoStore = BiaDemoStore
  ProcessStore = ProcessStore
  AuthStore = AuthStore
  AppStore = AppStore;
  BiaStore = BiaStore
  showFilters = false
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
      'processId',
    ],
    1:[
      'business_impact_analysis_id'
    ],
    2:[
      'manual_rto',
      'manual_mtpd',
      'manual_rpo',
      'manual_rlo'
    ],
    3:[
      
    ]
  }
  emptyTier = "emptyTier";
  popupObject = {
    component: 'Master',
    values: null,
    type: null
  };
  confirmationObject = {
    title: 'Cancel?',
    subtitle: 'This action cannot be undone',
    type: 'Cancel'
  };
  popupSubscription: any;
  cancelEventSubscription: any;
  tableData=[]
  newTableData = [];
  searchTerm: any;
  processItemEmptyList: string;
  selectedProcess: boolean = false;
  currentProcess
  organization_id
  division_id
  department_id
  section_id
  StaffCountLimit:number=20;
  countedArray=[];
  resourceRequirement:any=null
  resourceLoaded: boolean=false;
  manual_rto
  manual_mtpd
  manual_rpo
  manual_rlo
  mtpdValidation: boolean = true;
  rpodValidation: boolean = true;
  assetMappingCondition: boolean = true;
  ImpactCategoryInfo:any =[];
  biaObject = {
    id: null,
    type: null,
    value: null,
  };
  SubscriptionBiaList: any;
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
    private _departmentService: DepartmentService,
    private _divisionService: DivisionService, 
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _subsidiaryService: SubsidiaryService,
    private _aprService: AprService,
    private _biaService:BiaService,
    private _processService: ProcessService,
    private _biaRatingService: BiaRatingService,
    private _biaSettingService: BiaSettingsService,
    private _biaScaleService:BiaScaleService,
    private _biaTireService:BiaTireService,
    private _biaImpactCategoryInformationService: BiaImpactCategoryInformationService,
  ) { }

  ngOnInit(): void {
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
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
    }, 1000);
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([{ type: "close", path: '../' }]);
    window.addEventListener("scroll", this.scrollEvent, true);
    // event calling for cancel pop up using delete popup
    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelByUser(item);
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
    this.SubscriptionBiaList = this._eventEmitterService.eventTaskModal.subscribe(item => {
      this.closeBiaList()
      //this.pageChange()
    })
    this.form = this._formBuilder.group({
      processId:[null,[Validators.required]],
      organization_id:[null],
      division_id:[null],
      section_id:[null],
      department_id:[null],
      business_impact_analysis_id:[null,[Validators.required]],
      resource_requirement:[null,[Validators.required]],
      manual_rto:[null,[Validators.required]],
      manual_mtpd:[null,[Validators.required]],
      manual_rpo:[null,[Validators.required]],
      manual_rlo:['',[Validators.required]]
    })
    // if(BiaStore.selectedProcessId){
    //   this.selectedProcess=true
    //   this.currentProcess = BiaStore.selectedProcessId
    // }
    if (this._router.url.indexOf('edit') != -1) {
      this._utilityService.detectChanges(this._cdr);

      if (BiaStore.selectedProcessId)
      {
        this.selectedProcess=true
        this.currentProcess = BiaStore.selectedProcessId
      }
      else
        this._router.navigateByUrl('/bcm/business-impact-analysis');
    }  else{
    }
    this._biaSettingService.getItems().subscribe()
    this.resetForm();
    setTimeout(() => {
      this.showTab(this.currentTab);
    }, 100);
    this._biaService.getFullBiaItems('?is_all=true').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    this.formModalData()
    this.biaRating()
    this.getProcessList(1)
    // this.getSoftwares()
    // this.getHardwares()
  }

  ngAfterViewInit(){
    this.form.patchValue({
      processId:BiaStore.selectedProcessId
    })
  }

  changeHandler(val){
    if (Number(val) > 100)
    {
      this.form.patchValue({
        manual_rlo:''
      })
      this._utilityService.showWarningMessage('Warning',"RLO should be max 100%",)
    }
  }

  getAllTires(newPage: number = null) {
    this._biaTireService.getItems(false, null, true).subscribe(() => setTimeout(() =>
      this._utilityService.detectChanges(this._cdr), 100));
  }

  checkNumberOfStaff():Boolean{
    if(this.resourceRequirement&&this.resourceRequirement.resource_requirements&&this.currentTab==2){
      var is_existing
      if(this.resourceRequirement.resource_requirements.length!=0){
        this.resourceRequirement.resource_requirements.forEach(element => {
          if(element.no_of_staff!=undefined){
            is_existing =  true
          }else{
            return false
          }
        });
      }else{
        return false
      }
      return is_existing
    }else{
      return false
    }
  }

  conditionForAssetMapping(){
    if(this.currentTab==3){
      if(this.resourceRequirement?.resource_requirements.length>0){
        // for (let i = 0; i < this.resourceRequirement?.resource_requirements.length; i++) {
        //   const element = this.resourceRequirement?.resource_requirements[i];
        //   if(element['no_of_staff']||element['no_of_staff']==0){
        //     this.assetMappingCondition = false
        //   }else{
        //     this.assetMappingCondition = true
        //   }
        // }
        this.assetMappingCondition = true
      }else{
        this.assetMappingCondition = false
      }
    }else{
      this.assetMappingCondition = true
    }
  }

  processExisting(id){
    let existing = false
    var pos = BiaStore.BiaFullList.findIndex(e=>e.process_id==id)
    if(pos!=-1)existing = true
    return existing
  }

  getSoftwares(){
    this._biaService.getSoftware().subscribe(res=>{

    })
  }

  getHardwares(){
    this._biaService.getHardware().subscribe(res=>{
      
    })
  }

  returnManualRTOColorCode(){
    if(this.form.value.manual_rto){
      var param = '&bia_scale_ids='+this.form.value.manual_rto
      this._biaTireService.getItems(false, param, true).subscribe(res =>{
        if(res.data&&res.data.length!=0){
          BiaStore.ImpactResult.manual_rto.id = res.data[0].id
          BiaStore.ImpactResult.manual_rto.bia_tire_color_code = res.data[0].color_code
          BiaStore.ImpactResult.manual_rto.bia_tire_title = res.data[0].title
        }else{
          BiaStore.ImpactResult.manual_rto = null
        }
        setTimeout(() =>
        this._utilityService.detectChanges(this._cdr), 100)
      });
    }
  }

  changeManual(){
    this._biaScaleService.getAllItems().subscribe(res=>{
      res.forEach(element=>{
        if(this.form.value.manual_rto&&this.form.value.manual_rto==element.id){
          this.manual_rto = element.from+(element.to?'-'+element.to:'')+' '+element.bia_scale_category
        }else if(!this.form.value.manual_rto){
          this.manual_rto = null
        }
        if(this.form.value.manual_mtpd&&this.form.value.manual_mtpd==element.id){
          this.manual_mtpd = element.from+(element.to?'-'+element.to:'')+' '+element.bia_scale_category
        }else if(!this.form.value.manual_mtpd){
          this.manual_mtpd = null
        }
        if(this.form.value.manual_rpo&&this.form.value.manual_rpo==element.id){
          this.manual_rpo = element.from+(element.to?'-'+element.to:'')+' '+element.bia_scale_category
        }else if(!this.form.value.manual_rpo){
          this.manual_rpo = null
        }
        
       
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 100);
      })
      this.validationRto()
      this.validationRpo()
    })
  }

  validationRpo(){
    if(this.form.value.manual_rto && this.form.value.manual_rpo)
    if(this.getSelectedRpoFrom() > this.getSelectedRtoTo()  ){
      this.form.patchValue({
        manual_rpo : null
      })
      this.rpodValidation = false
    }else {
      this.rpodValidation = true

    }
  }

  validationRto(){
    if(this.form.value.manual_rto && this.form.value.manual_mtpd)
    if(this.getSelectedRtoTo() > this.getSelectedMtpdTo()){
      this.form.patchValue({
        manual_mtpd : null
      })
      this.mtpdValidation = false
    }else {
      this.mtpdValidation = true

    }
  }

  getSelectedRpoFrom(){
    if(this.form.value.manual_rpo){
      let pos = BiaScaleStore.allItems.findIndex(e=>e.id == this.form.value.manual_rpo)
      if(pos != -1){
        return parseInt(BiaScaleStore.allItems[pos].from)
      }
    }else {
      return null
    }
  }
  getSelectedRtoTo(){
    if(this.form.value.manual_rto){
      let pos = BiaScaleStore.allItems.findIndex(e=>e.id == this.form.value.manual_rto)
      if(pos != -1){
        return parseInt(BiaScaleStore.allItems[pos].from) 
      }
    }else {
      return null
    }

  }
  getSelectedMtpdTo(){
    if(this.form.value.manual_mtpd){
    let pos = BiaScaleStore.allItems.findIndex(e=>e.id == this.form.value.manual_mtpd )
      if(pos != -1){
        return parseInt(BiaScaleStore.allItems[pos].from) 
      }
    }
    else {
      return null
    }
  }

  checkDownwardsValue(index,value){
    var highest_value = 0
    for (let i = 0; i < BiaStore?.Bia?.scales.length; i++) {
      const element = BiaStore?.Bia?.scales[i];
      if(i==index){
        if(value>=highest_value){
          return true
        }else{
          setTimeout(() => {
            // element['count'+i]=null
            // element['software'+i]=null
            // element['hardware'+i]=null
            var pos = this.resourceRequirement['resource_requirements'].findIndex(e=>e.bia_scale_id==element.id)
            element['count'+i] = this.resourceRequirement['resource_requirements'][pos]['no_of_staff']
            this._utilityService.showWarningMessage('warning', this._helperService.translateToUserLanguage('resource_level_warning'))
            this._utilityService.detectChanges(this._cdr);
            return false
          }, 100);
        }
      }else{
        if(element['count'+i]>highest_value){
          highest_value = element['count'+i]
        }
      }
    }
  }

  changeCountSelection(scaleId:number,count,index){
    if(this.checkDownwardsValue(index,count)){
      let saveObj = {
        bia_scale_id:scaleId,
        no_of_staff:count
      }
      let staffAssigned = true
     if( this.resourceRequirement&&this.resourceRequirement.resource_requirements){
       for (let i = 0; i < BiaStore?.Bia?.scales.length; i++) {
         const element = BiaStore?.Bia?.scales[i];
         if(i==index){
          var pos = this.resourceRequirement.resource_requirements.findIndex(e=>e.bia_scale_id===element.id)
          if(pos!=-1){
            this.resourceRequirement.resource_requirements[pos]['no_of_staff']=count
          }else{
            this.resourceRequirement.resource_requirements.push(saveObj)
          }
         }
         else if(i>index){
           element['count'+i]=count
           var pos = this.resourceRequirement.resource_requirements.findIndex(e=>e.bia_scale_id===element.id)
          if(pos!=-1){
            this.resourceRequirement.resource_requirements[pos]['no_of_staff']=count
          }else{
            this.resourceRequirement.resource_requirements.push({bia_scale_id:element.id,no_of_staff:count})
          }
         }
       }
     }
     setTimeout(() => {
      if(staffAssigned){
        this.form.patchValue({
          resource_requirement:this.resourceRequirement
        })
      }
      this.conditionForAssetMapping()
      this._utilityService.detectChanges(this._cdr);
     }, 100);
    }
  }

  changeAssetesSelection(scaleId,assets,count,index){
    let saveObj = {
      bia_scale_id:scaleId,
      asset_ids:assets,
      no_of_staff:count
    }
    if( this.resourceRequirement&&this.resourceRequirement.resource_requirements){
      for (let i = 0; i < BiaStore?.Bia?.scales.length; i++) {
        const element = BiaStore?.Bia?.scales[i];
        if(i==index){
          var pos = this.resourceRequirement.resource_requirements.findIndex(e=>e.bia_scale_id===element.id)
          if(pos!=-1){
            this.resourceRequirement.resource_requirements[pos]['asset_ids']=assets
          }else{
            this.resourceRequirement.resource_requirements.push(saveObj)
          }
         }else if(i>index){
          element['assets'+i]=assets
          var pos = this.resourceRequirement.resource_requirements.findIndex(e=>e.bia_scale_id===element.id)
         if(pos!=-1){
           this.resourceRequirement.resource_requirements[pos]['asset_ids']=assets
         }else{
           this.resourceRequirement.resource_requirements.push({bia_scale_id:element.id,asset_ids:assets})
         }
        }
      }
    }
    setTimeout(() => {
      this.conditionForAssetMapping()
        this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  changeSoftwareSelection(scaleId,software){
    let saveObj = {
      bia_scale_id:scaleId,
      software_ids:software
    }
    if( this.resourceRequirement&&this.resourceRequirement.resource_requirements){
      if(this.resourceRequirement.resource_requirements.length==0){          //Push count value to array initially
        this.resourceRequirement.resource_requirements.push(saveObj)
        this.form.patchValue({
          resource_requirement:null
        })
      }else{                                                                 //Alrdy haviing resource_requirements
        var pos = this.resourceRequirement.resource_requirements.findIndex(e=>e.bia_scale_id===scaleId)
        if(pos!=-1){
          this.resourceRequirement.resource_requirements[pos]['software_ids']=software
        }else{
          this.resourceRequirement.resource_requirements.push(saveObj)
        }
        setTimeout(() => {
          this.resourceRequirement.resource_requirements.forEach(element => {
            if(!element.no_of_staff){
              // this.form.patchValue({
              //   resource_requirement:null
              // })
            }
          });
        }, 50);
      }
    }
    setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  changeHardwareSelection(scaleId,hardware){
    let saveObj = {
      bia_scale_id:scaleId,
      hardware_ids:hardware
    }
    if( this.resourceRequirement&&this.resourceRequirement.resource_requirements){
      if(this.resourceRequirement.resource_requirements.length==0){          //Push count value to array initially
        this.resourceRequirement.resource_requirements.push(saveObj)
        this.form.patchValue({
          resource_requirement:null
        })
      }else{                                                                 //Alrdy haviing resource_requirements
        var pos = this.resourceRequirement.resource_requirements.findIndex(e=>e.bia_scale_id===scaleId)
        if(pos!=-1){
          this.resourceRequirement.resource_requirements[pos]['hardware_ids']=hardware
        }else{
          this.resourceRequirement.resource_requirements.push(saveObj)
        }
        setTimeout(() => {
          this.resourceRequirement.resource_requirements.forEach(element => {
            if(!element.no_of_staff){
              // this.form.patchValue({
              //   resource_requirement:null
              // })
            }
          });
        }, 50);
      }
    }
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  getTopCounts(){
    this.countedArray=[0]
    this._biaService.getTopCounts().subscribe(res=>{
      this.StaffCountLimit = res.total_number_of_staff
      if(this.StaffCountLimit!=0){
        for (let i = 1; i < this.StaffCountLimit+1; i++) {
          // if(i!=0)
          this.countedArray.push(i)
          this._utilityService.detectChanges(this._cdr);
        }
      }
    })
  }

  getResourceRequirement(){
    this._biaService.getResourceRequirement().subscribe(res=>{
      
      if(BiaStore.ResourceRequirement&&BiaStore.ResourceRequirement.resource_requirements?.length!=0){
        this.resourceRequirement=BiaStore.ResourceRequirement
        this.form.patchValue({
          resource_requirement:this.resourceRequirement
        })
        this.conditionForAssetMapping()
      for (let i = 0; i < BiaStore.Bia.scales.length; i++) {
        const element = BiaStore.Bia.scales[i];
        BiaStore.ResourceRequirement.resource_requirements.forEach(res=>{
          if(res.bia_scale_id==element.id){
            element['count'+i]=res.no_of_staff
            // if(res.software_ids&&res.software_ids.length!=0){
            //   let array = []
            //   res.software_ids.forEach(element => {
            //     array.push(element)
            //   });
            //   element['software'+i]=array
            //   this._utilityService.detectChanges(this._cdr);
            // }
            // if(res.hardware_ids&&res.hardware_ids.length!=0){
            //   let array = []
            //   res.hardware_ids.forEach(element => {
            //     array.push(element)
            //   });
            //   element['hardware'+i]=array
            //   this._utilityService.detectChanges(this._cdr);
            // }  
            if(res.asset_ids&&res.asset_ids.length!=0){
              let array = []
              res.asset_ids.forEach(element => {
                array.push(element)
              });
              element['assets'+i]=array
              this._utilityService.detectChanges(this._cdr);
            }
          }
        })
      }
      this._utilityService.detectChanges(this._cdr);
      }else{
        this.form.patchValue({
          resource_requirement:null
        })
      }
    })
    setTimeout(() => {
      this.resourceLoaded=true
      this.conditionForAssetMapping()
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    this._utilityService.detectChanges(this._cdr);
  }

  getResourceInfo(){
    let resourceObj={
      business_impact_analysis_id:BiaStore.businessAnalysisId,
      resource_requirements:[]
    }
    this.resourceLoaded = false
    if(!this.resourceRequirement){
      this.resourceRequirement = resourceObj;
    }
    this.getResourceRequirement()
    this.getSoftwares()
    this.getHardwares()
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  calculateSpan(rowSpanLength,bia){
    let rowSpan = rowSpanLength
    if(bia.bia_impact_area.length>1){
          rowSpan = rowSpan+(bia.bia_impact_area.length-1)
        }
    // bia.bia_impact_scenario.forEach(element => {
    //   if(element.bia_impact_area.length>1){
    //     rowSpan = rowSpan+(element.bia_impact_area.length-1)
    //   }
    // });
    return rowSpan
  }

  biaRating(newPage: number = null) {
    this._biaRatingService.getItems(false,null,false).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getBiaScaleList() {
    this._biaScaleService.getAllItems().subscribe(() =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }
  searchBiaScale(e, patchValue: boolean = false) {
    this._biaScaleService.getItems(false, '&q=' + e.term).subscribe((res: any) => {
      if (res.data.length > 0 && patchValue) {
        for (let i of res.data) {
          if (i.id == e.term) {
            this.form.patchValue({ scale_id: i.id });
            this._utilityService.detectChanges(this._cdr);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  

  getProcessList(newPage: number = null) {
    if (newPage) ProcessStore.setCurrentPage(newPage);
    ProcessStore.processes_loaded = false
    this._processService
      .getAllItems(false,null,false)
      .subscribe(() =>
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      );
  }

  getBiaAssets(){
    this._biaService.getBiaAssets(BiaStore.selectedProcessId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr)
    })
  }

  returnInHours(from,to?){
    let inHours
    if(!to){
      if(from<1){
        inHours = from*24
      }
    }
    return Math.round(inHours)
  }

  businessImpactList(update:boolean=false){
    if(!update)BiaStore.BiaLoaded = false
    this._biaService.getItem().subscribe(res=>{
      if(res){
        this.form.patchValue({
          business_impact_analysis_id:res.analysis_id
        })
        BiaStore.Bia.data.forEach(cat=>{
          cat.bia_impact_scenario.forEach(sce=>{
            for (let j = 0; j < sce.bia_impact_area.length; j++) {
              const area = sce.bia_impact_area[j];
              for (let i = 0; i < area.bia_matrix_values.length; i++) {
                const matrix = area.bia_matrix_values[i];
                matrix['value'+j+i]=matrix.bia_impact_rating?.id
                matrix['color'+j+i]=matrix.bia_impact_rating?.color_code
              }
            }
          })
        })
      }
    })
    if(this.resourceRequirement){
      this.resourceRequirement = null
      this.form.patchValue({
        resource_requirement:null
      })
    }
  }


  getProcess(process){
    this.currentProcess = process?.id
    BiaStore.selectedProcessId = process?.id
    this.form.patchValue({
      processId:process?.id
    })
    if(this.currentProcess==process.id){
      this.selectedProcess = true;
    }else{
      this.selectedProcess = false
      this.currentProcess = null
      BiaStore.selectedProcessId=null
    }
  }

  changeProcess(){
    this.selectedProcess=!this.selectedProcess
    this.currentProcess = null
    this.form.patchValue({
      processId:''
    })
  }

  getProcessRecoveries(){
    this._aprService.getProcessWithActivities().subscribe(res=>{

    })
  }

  searchProcessWithActivities() {
    AdvanceProcessStore.setCurrentPage(1);
     let params = "";
      if (this.searchTerm) {
        this._processService
        .getAllItems(false, `&q=${this.searchTerm}` + params).subscribe(res => {
          if(res&&res.data.length==0){
            this.processItemEmptyList = "Your search did not match any process. Please make sure you typed the process name correctly, and then try again."
          }
          this._utilityService.detectChanges(this._cdr);
        });
      } else {
        this.getProcessList();
      }
  }

  sortProcess() {
    var params = '';
    if (this.form.value.organization_id) params = `&organization_ids=${this.form.value.organization_id.id}`;
    if (this.form.value.division_id) {
      if (params)
        params = params + `&division_ids=${this.form.value.division_id.id}`;
      else
        params = `&division_ids=${this.form.value.division_id.id}`;
    }
    if (this.form.value.department_id) {
      if (params)
        params = params + `&department_ids=${this.form.value.department_id.id}`;
      else
        params = `&department_ids=${this.form.value.department_id.id}`;
    }
    if (this.form.value.section_id) {
      if (params)
        params = params + `&section_ids=${this.form.value.section_id.id}`;
      else
        params = `&section_ids=${this.form.value.section_id.id}`;
    }
    this._processService.getAllItems(false, params).subscribe(res => {
      if(res.data.length == 0){
        this.processItemEmptyList = "Your search did not match any process. Please make sure you typed the process name correctly, and then try again."
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  clearSearchBar() {
    this.searchTerm = '';
    this.searchProcessWithActivities();
  }

  formModalData(){
    //  To find th total columns for assgning to ng select ngmodel===================
    var columnLength = 0
    BiaDemoStore.biaArray.forEach(element=>{
      if(element.impact_scenario.length==0){
        columnLength++
      }else{
        element.impact_scenario.forEach(elem=>{
          if(elem.impact_area.length==0){
            columnLength++  
          }else{
            columnLength=columnLength+elem.impact_area.length
          }
        })
      }
    })
// ===================================================================================
    for (let i = 0; i < columnLength; i++) {
      let obj = {};
      for (let j = 0; j < BiaDemoStore.tierArray.length; j++) {
        obj['key'+i.toString()+j.toString()] = BiaDemoStore.tierArray[j];
        obj['value'+i.toString()+j.toString()] = 53;
        
      }
      this.newTableData.push(obj)
    }
  }

  returnRating(ratingId){
    var Rating = null
    BiaRatingStore.BiaRatingDetails.forEach(res=>{
      if(res.id==ratingId){
        Rating = res.rating
        return Rating
      }
    })
    return Rating
  }

  removeBIA(matrix){
    let obj = new Object();
    obj["bia_impact_rating_id"]=''
    this._biaService.updateItem(matrix.id,obj).subscribe(res=>{
      if(res){
        this.businessImpactList(true)
      } 
    })
  }

  selctionChange(matrix,bia_rating_id,areaMatrixValues){
    let highest_value = 0
    for (let index = 0; index < areaMatrixValues.length; index++) {
      const element = areaMatrixValues[index];
      if(element.id==matrix.id){
        if(this.returnRating(bia_rating_id)>=highest_value){
          var obj = new Object()
          obj["bia_impact_rating_id"]=bia_rating_id
          this._biaService.updateItem(matrix.id,obj).subscribe(res=>{
            if(res){
              this.businessImpactList(true)
            } 
          })
          break;
        }else{
          this.businessImpactList(true)
          break;
        }
      }else{
        if(highest_value<element.bia_impact_rating.rating){
          highest_value = element.bia_impact_rating.rating
        }
      }
    }

  }

  cancelByUser(status) {
    if (status) {
      if(BiaStore.businessAnalysisId)this._router.navigateByUrl('/bcm/business-impact-analysis/'+BiaStore.businessAnalysisId);
      else this._router.navigateByUrl('/bcm/business-impact-analysis');
    } else {
      
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  saveAdvancedProcess(){
    if(ProcessStore.process_id){
      this._router.navigateByUrl('/bpm/process/' + ProcessStore.process_id + '/advanced-process-recovery');
    }else{
      this._router.navigateByUrl('/bpm/process');
    }
  }

  getDepartment(){
      var params = '';
      // params = '&organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id.id : '')
      // +'&division_ids='+(this.form.value.division_id ? this.form.value.division_id.id : '')
      this._departmentService.getItems(false,'&is_full_list=true').subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
  }


  getDivision(){
      // let parameters = this.form.value.organization_id.id;
      this._divisionService.getItems(false,'&is_full_list=true').subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getSection(){
      // var params = '';
      // params = '&organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id.id : '')
      // +'&division_ids='+(this.form.value.division_id ? this.form.value.division_id.id : '')
      // +'&department_ids='+(this.form.value.department_id ? this.form.value.department_id.id : '')
      this._sectionService.getItems(false,'&is_full_list=true').subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
  }


  getSubSection(){
      var params = '';
      // params = '&organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id.id : '')
      // +'&division_ids='+(this.form.value.division_id ? this.form.value.division_id.id : '')
      // +'&department_ids='+(this.form.value.department_id ? this.form.value.department_id.id : '')
      // +'&section_ids='+(this.form.value.section_id ? this.form.value.section_id.id : '')
      this._subSectionService.getItems(false).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
  }

  getSubsidiary() {
    this._subsidiaryService.getAllItems(false).subscribe((res:any)=>{
      if(!OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
        this.form.patchValue({organization_ids:[res.data[0]]});
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchSubsidiary(e) {
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this._subsidiaryService.searchSubsidiary('?is_full_list=true&q='+e.term).subscribe(res=>{
    //     this._utilityService.detectChanges(this._cdr);
    //   })
    // }
    this._subsidiaryService.searchSubsidiary('?is_full_list=true&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  searchDepartment(e){
    
    var params = '';
      // params = '&organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id.id : '')
      // +'&division_ids='+(this.form.value.division_id ? this.form.value.division_id.id : '');

    this._departmentService.getItems(false,params+'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchDivision(e){
    if(this.form.value.organization_id){
      let parameters = this.form.value.organization_id.id;
      this._divisionService.getItems(false,'&organization_ids='+parameters+'&q='+e.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
      });
    }
    this._divisionService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchSection(e){
    // if(this.form.value.organization_id){
    //   var params = '';
    //   params = '&organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id.id : '')
    //   +'&division_ids='+(this.form.value.division_id ? this.form.value.division_id.id : '')
    //   +'&department_ids='+(this.form.value.department_id ? this.form.value.department_id.id : '')
    //   this._sectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
    //     this._utilityService.detectChanges(this._cdr);
    //   });
    // }
    this._sectionService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchSubSection(e){
    // if(this.form.value.organization_id){
    //   var params = '';
    //   params = '&organization_ids='+(this.form.value.organization_id ? this.form.value.organization_id.id : '')
    //   +'&division_ids='+(this.form.value.division_id ? this.form.value.division_id.id : '')
    //   +'&department_ids='+(this.form.value.department_id ? this.form.value.department_id : '')
    //   +'&section_ids='+(this.form.value.section_id ? this.form.value.section_id.id : '')
    //   this._subSectionService.getItems(false,params+'&q='+e.term).subscribe(res=>{
    //     this._utilityService.detectChanges(this._cdr);
    //   });
    // }
    this._subSectionService.getItems(false,'&q='+e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

  saveResourceRequired(){
    if(this.resourceRequirement&&BiaStore.ResourceRequirement.resource_requirements.length==0){
      this._biaService.saveResource(this.resourceRequirement).subscribe(res=>{

      })
    }else{
      this._biaService.updateResource(this.resourceRequirement).subscribe(res=>{

      })
    }
  }

  getImpactResult(){
    this.getBiaScaleList()
    BiaStore.ImpactResultLoaded = false
    this._biaService.getImpactResult(BiaStore.businessAnalysisId).subscribe(res=>{
      let ImpactResult = BiaStore.ImpactResult
      if(ImpactResult.manual_rlo)this.form.patchValue({manual_rlo:ImpactResult.manual_rlo})
      this.form.patchValue({manual_rto:ImpactResult.manual_rto?ImpactResult.manual_rto.id:ImpactResult.recommended_rto?ImpactResult.recommended_rto.id:null})
      this.form.patchValue({manual_mtpd:ImpactResult.manual_mtpd?ImpactResult.manual_mtpd.id:ImpactResult.recommended_mtpd?ImpactResult.recommended_mtpd.id:null})
      if(ImpactResult.manual_rpo)this.form.patchValue({manual_rpo:ImpactResult.manual_rpo.id})
      setTimeout(() => {
        this.changeManual()
      }, 50);
    });
  }

  processDataForSaveImpact(){
    let impactSaveData = {
      manual_rto:this.form.value.manual_rto,
      manual_mtpd:this.form.value.manual_mtpd,
      manual_rlo:this.form.value.manual_rlo,
      manual_rpo:this.form.value.manual_rpo
    }
    return impactSaveData
  }

  saveImpactResult(){
    this._biaService.saveImpactResult(this.processDataForSaveImpact()).subscribe(res=>{

    })
  }

  saveTabDetails(){
    if(this.currentTab==0){
      this.businessImpactList();
      this._utilityService.showSuccessMessage('success', 'Process selected successfully');
    }
    if(this.currentTab==1){
      this.getResourceInfo()
      this._utilityService.showSuccessMessage('success', 'BIA updated successfully');
    }
    if(this.currentTab==2){
      this.saveResourceRequired();
      this.getImpactResult()
    }
    if(this.currentTab==3){
      this._utilityService.showSuccessMessage('success', 'BIA updated successfully');
    }
    // if(this.currentTab==4)this.saveVitalRecords();
  }

  // ================= TAB SETTINGS =====================
  nextPrev(n,is_save:boolean=false) {
    var x: any = document.getElementsByClassName("tab");
    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className +=
        " finish";
    }

    // Hide the current tab:
    x[this.currentTab].style.display = "none";
    this.currentTab = this.currentTab + n;
    if (this.currentTab >= x.length) {
      this.currentTab =
        this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      x[this.currentTab].style.display = "block";
      // this.saveImpactResult()
      if(BiaStore.businessAnalysisId){
        this._router.navigateByUrl('/bcm/business-impact-analysis/'+BiaStore.businessAnalysisId)
      }else{
        this._router.navigateByUrl('/bcm/business-impact-analysis');
      }
      return false;
    }
    this.showTab(this.currentTab,is_save);
  }

  showTab(n,is_save:boolean=false) {
    
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    if (n==0) {
      if (document.getElementById("prevBtn"))document.getElementById("prevBtn").style.display = "none";
    } else {
      if (document.getElementById("prevBtn"))document.getElementById("prevBtn").style.display = "inline";
    }

    if(n==1){
      this.businessImpactList()
      if(is_save)this._utilityService.showSuccessMessage('success', 'Process selected successfully');
      this.getTopCounts()
      this.getBiaAssets()
    }

    if(n==2){
      if(is_save)this._utilityService.showSuccessMessage('success', 'BIA updated successfully');
      this.getImpactResult()
      // this.getResourceInfo()
      // this.conditionForAssetMapping()
    }
    if(n==3)this.conditionForAssetMapping();
    if(n==3&&is_save){
      this.saveImpactResult()
      this.getResourceInfo()
      this.conditionForAssetMapping();
      // this.saveResourceRequired()
      // this.getImpactResult()
    }else if(n==3&&!is_save){
      this.getResourceInfo()
    }
    if(n==4&&is_save){
      this.saveResourceRequired()
      this.getImpactResult()
    }else if(n==3&&!is_save){
      this.getImpactResult()
    }

    if (n == x.length - 1) {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "none";
    } else {
      if (document.getElementById("nextBtn")) this.nextButtonText = "Save & Next";
      if (document.getElementById("saveBtn")) document.getElementById("saveBtn").style.display = "inline";
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
          if(!this.form.controls[i].valid){
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
            if(!this.form.controls[k].valid){
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

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  returnFilterName(){
    if(this.showFilters)return 'hide_filters';
    else return 'show_filters';
  }

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
  listItems(id){    
    var params = '&bia_impact_category_ids='+id
    this._biaImpactCategoryInformationService.getItems(false,params,false).subscribe(res=>{
      this.biaObject.type = "add";
       this.biaObject.value= res
       this.listModalOpen()
    })
  }
  listModalOpen(){
    setTimeout(() => {
    $(this.listItem.nativeElement).modal('show');
      this._renderer2.setStyle(this.listItem?.nativeElement,'display','block');
      this._utilityService.detectChanges(this._cdr);
      },100)
  }
  closeBiaList(){
    setTimeout(() => {
      $(this.listItem.nativeElement).modal('hide');
      this._renderer2.setStyle(this.listItem.nativeElement,'display','none');
      this.biaObject.type = null;
      this.biaObject.value = null;
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  ngOnDestroy(){
    BiaStore.selectedProcessId=null
    BiaStore.is_edit = false
    BiaStore.ImpactResultLoaded = false
    this.resourceLoaded = false
    BiaStore.BiaLoaded =false
    ProcessStore.processes_loaded =false
    this.cancelEventSubscription.unsubscribe()
    this.idleTimeoutSubscription.unsubscribe()
    this.networkFailureSubscription.unsubscribe()
    this.SubscriptionBiaList.unsubscribe()
  }

}
