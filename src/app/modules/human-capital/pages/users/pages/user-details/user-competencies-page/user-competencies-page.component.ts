import { Component, OnInit,ChangeDetectorRef,ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UsersStore} from 'src/app/stores/human-capital/users/users.store';
import {AssessmentService} from 'src/app/core/services/human-capital/assessment/assessment.service';
import { AssessmentStore } from 'src/app/stores/human-capital/assessment/assessment.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;


@Component({
  selector: 'app-user-competencies-page',
  templateUrl: './user-competencies-page.component.html',
  styleUrls: ['./user-competencies-page.component.scss']
})
export class UserCompetenciesPageComponent implements OnInit,OnDestroy {
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UsersStore = UsersStore;
  AssessmentStore = AssessmentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  DesignationMasterStore = DesignationMasterStore;
  AuthStore = AuthStore;
  currentAssessment = null;

  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _assessmentService:AssessmentService,
    private _humanCapitalService:HumanCapitalService,
    private _imageService:ImageServiceService,
    private _helperService:HelperServiceService,
    private _designationService:DesignationService,
    private _usersService:UsersService,
    private _router:Router) { }

  ngOnInit() {

    this.reactionDisposer = autorun(() => {
      NoDataItemStore.setNoDataItems({title: "competencies_nodata_title"});
    
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
         
          case "template":
            var fileDetails = {
              ext: 'xlsx',
              title: 'UserCompetencyTemplate.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('competency-assessments-template', null, null, fileDetails.title, null, fileDetails);
            break;
          case "export_to_excel":

            var fileDetails = {
              ext: 'xlsx',
              title: 'UserCompetency.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('competency-assessments-export', null, null, fileDetails.title, null, fileDetails);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.gotoAssessment();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })


    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['']
    });

    SubMenuItemStore.setNoUserTab(true);


    SubMenuItemStore.setSubMenuItems([
      //{ type: 'new_modal' },
      // { type: 'template' },
      // { type: 'export_to_excel' },
      { type: 'close', path: '/human-capital/users' },
    ]);
    DesignationMasterStore.unsetCompetencies();

    this._assessmentService.getUserAssessments(UsersStore.user_id).subscribe(res=>{
      setTimeout(() => {
        if(res['details']?.length>0){
          this.currentAssessment = res['details'][0].competency_group_id;
          AssessmentStore.userAssessment[0]['is_accordion_active']=true;
        }
        else{
          if(UsersStore.designation_id==null){
            this._usersService.getItem('/'+UsersStore.user_id).subscribe(resp=>{
              UsersStore.designation_id = resp['designation'].id;
              this._utilityService.detectChanges(this._cdr);
              this.getCompetencies();
            })
          }
          else{
            this.getCompetencies();
          }
         
        }
       
        this._utilityService.detectChanges(this._cdr);
       }, 200);
    })

  
  }

  getCompetencies(){
   
    // console.log(AssessmentStore?.userAssessment?.length);
    this._designationService.getCompetencies(UsersStore.designation_id).subscribe(response=>{
        if(DesignationMasterStore.competencies.length>0){
          NoDataItemStore.setNoDataItems({title: "assessment_nodata_title", subtitle: 'perform_assessment_subtitle',buttonText: 'new_assessment'});
    
          DesignationMasterStore.competencies[0]['is_accordion_active'] = true;
      this.currentAssessment = DesignationMasterStore?.competencies[0]?.competency_group_id;
        }
      
      this._utilityService.detectChanges(this._cdr);
    })
  }

  gotoAssessment(){
    this._router.navigateByUrl('/human-capital/assessments/edit-assessment')
  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  setCurrentAssessment(id,num){
    // console.log(id);
    if(AssessmentStore?.userAssessment?.length>0){
      if(this.currentAssessment==id && AssessmentStore.userAssessment[num]['is_accordion_active']==true){
        AssessmentStore.userAssessment[num]['is_accordion_active'] = false;
        // this.currentAssessment = null;
      }
      else{
        this.currentAssessment = id;
        AssessmentStore.userAssessment[num]['is_accordion_active'] = true;
        this.closeOthers(id);
      }
    }
    else{
      if(this.currentAssessment==id && DesignationMasterStore.competencies[num]['is_accordion_active'] ==true){
        DesignationMasterStore.competencies[num]['is_accordion_active'] = false;
        // this.currentAssessment = null;
      }
      else{
        this.currentAssessment = id;
        DesignationMasterStore.competencies[num]['is_accordion_active'] = true;
        this.closeOthers(id);
      }
    }
    
  }

    /**
   * changing the number of days in to month and years
   * @param days -number of days
   */
  createDaysString(days) {
    return this._helperService.daysConversion(days);
  }


  closeOthers(id){
    if(AssessmentStore?.userAssessment?.length>0){
      for(let i of AssessmentStore.userAssessment){
        if(i.competency_group_id==id){
  
        }
        else{
          i['is_accordion_active'] = false;
        }
      }
    }
    else{
      for(let i of DesignationMasterStore.competencies){
        if(i.competency_group_id==id){
  
        }
        else{
          i['is_accordion_active'] = false;
        }
      }
    }
    
  }


  save(params:boolean=false){  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    DesignationMasterStore.unsetCompetencies();
  }

}
