import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssessmentStore } from 'src/app/stores/human-capital/assessment/assessment.store';
import { AssessmentService } from 'src/app/core/services/human-capital/assessment/assessment.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { Router } from '@angular/router';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse } from '@angular/common/http';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { autorun, IReactionDisposer } from 'mobx';

declare var $: any;
@Component({
  selector: 'app-new-assessment',
  templateUrl: './new-assessment.component.html',
  styleUrls: ['./new-assessment.component.scss']
})
export class NewAssessmentComponent implements OnInit, OnDestroy {
  @ViewChild('input') input: ElementRef;
  @ViewChild('resultModal') resultModal: ElementRef;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;
  @ViewChild('detailModal') detailModal: ElementRef;

  UsersStore = UsersStore;
  AssessmentStore = AssessmentStore;
  options = [];
  DesignationMasterStore = DesignationMasterStore;
  scrollNext = new EventEmitter<any>();
  result = {};
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  cancelEventSubscription:any;
  designationCompetencySubscriptionEvent:any;
  editAssessment = false;
  cancelObject = {
    type: '',
    subtitle: 'are_you_sure_cancel'
  };
  formErrors = null;
  AppStore = AppStore;
  designationCompetencyObject = {
    component: 'Master',
    values: null,
    type: null
  };
  reactionDisposer :IReactionDisposer;

  constructor(private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _assessmentService: AssessmentService,
    private elem: ElementRef,
    private _router: Router,
    private _imageService: ImageServiceService,
    private _designationService: DesignationService,
    private _humanCpitalService: HumanCapitalService,
    private _eventEmitterService:EventEmitterService,
    private _renderer2:Renderer2,
    private _helperService:HelperServiceService) { }


  ngOnInit() {
    this.options.length = 10;
    this.reactionDisposer = autorun(() => {
    NoDataItemStore.setNoDataItems({title: "no_competency_title", subtitle: 'no_competency_subtitle',buttonText: 'add_competency'});
    if(NoDataItemStore.clikedNoDataItem){
      this.addCompetency();
      NoDataItemStore.unSetClickedNoDataItem();
    }
  });
     
    this.result['competencies'] = [];
    if (UsersStore.user_id != null) {
      this._usersService.getItemById(UsersStore.user_id).subscribe(res => {
        // this._utilityService.detectChanges(this._cdr);
        AssessmentStore.setUserSelected();
        // this.startAssessment(true);
        this.editAssessment=true;
        
        this._utilityService.detectChanges(this._cdr);
        
       
      });
      
    }
    else {
      this._usersService.getAllItems().subscribe(res=>{this._utilityService.detectChanges(this._cdr);});
      
    }



    SubMenuItemStore.setNoUserTab(true);
    SubMenuItemStore.setSubMenuItems([
      // { type: 'new_modal' },
      // { type: 'template' },
      { type: 'close',path:'../' },
    
    ]);

    // SubMenuItemStore.makeEmpty();

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancelAssessment(item);
    })

    
    this.designationCompetencySubscriptionEvent = this._eventEmitterService.designationDetailControl.subscribe(res => {
      this.closeDetailModal();
    })


  }

  addCompetency(){
    this.designationCompetencyObject.values = {
      designation_id: UsersStore.individualUser.designation.id,
    }
    this.designationCompetencyObject.type = 'View';
    this._renderer2.setStyle(this.detailModal.nativeElement, 'display', 'block');
    this._renderer2.setStyle(this.detailModal.nativeElement, 'z-index', '99999');
    // this._renderer2.addClass(this.detailModal.nativeElement, 'show');
    // this._renderer2.setStyle(this.detailModal.nativeElement, 'overflow', 'auto');
    $(this.detailModal.nativeElement).modal('show');
  }

  closeDetailModal() {
    this._renderer2.setStyle(this.detailModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    // this._renderer2.setStyle(this.detailModal.nativeElement, 'z-index', '9999');
    $(this.detailModal.nativeElement).modal('hide');
    this.designationCompetencyObject.type = null;

  }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    let elements = this.elem.nativeElement.querySelectorAll('.input-block');
 
    //we'll do some stuff here when the window is scrolled
    elements.forEach((elem) => {
      var etop = elem.getBoundingClientRect().top;
      var diff = etop - window.pageYOffset;

      if (this.elementInViewport(elem)) {
        this.reinitState(elem, elements);
      }
    });
  }


  reinitState(elem, elements) {
    elements.forEach(elem => {
      elem.classList.remove('active');
    })
    elem.classList.add('active');

  }

  elementInViewport(el) {
    var top = el.offsetTop;
    var diff = top - window.scrollY;
    // return (diff > 0 && diff < 250);
    return (diff > 0 && diff < 250);
  }


  //@HostListener('click', ['$event'])
  scrollToItem(event,type?) {
    // console.log(event);
    var top = window.pageYOffset;
    
    if (event.screenY < 200) {
     
    
      top = top + this.elem.nativeElement.offsetTop - 200;
      window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
  

      setTimeout(() => {
        // top = top + this.elem.nativeElement.offsetTop + 230;
        top = top + this.elem.nativeElement.offsetTop + 230;
        window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
      }, 200);

    
      // top = top + this.elem.nativeElement.offsetTop - 260;
    
    }
    else {
      if(type=='start'){
        top = top + this.elem.nativeElement.offsetTop + 200;
      }
      else
      top = top + this.elem.nativeElement.offsetTop + 200;
    }


    window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
  };

  editAnswer() {
    var top = 200;
    // top = top + this.elem.nativeElement.offsetTop - 1380;
    window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
  }


  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if ((e.which == 13 || e.keyCode == 13)) {
      e.preventDefault();
      if (e.srcElement.nextElementSibling) {
        e.srcElement.nextElementSibling.focus();
      }
      
      return;
    }

  }


  getCount(gIndex, index, competency, answer, event) {
    this.scrollToItem(event);
    AssessmentStore.total_score = 0;
    let competency_res = { competency_id: competency, score: answer };
    AssessmentStore.setAssessmentResult(gIndex, index, competency_res);
    this._utilityService.detectChanges(this._cdr);
    if (AssessmentStore.result_loaded) {
      for (let answers of AssessmentStore.result) {
        for (let ans of answers) {
          if(ans.score)
          AssessmentStore.total_score = AssessmentStore.total_score + ans.score;
        }
      }
    }
  }

  setAnswers() {
    
    if(DesignationMasterStore._competencyLoaded){
    for (let i = 0; i < AssessmentStore.totalResult.competency_score.length; i++) {
     
        let competency_res = { competency_id: AssessmentStore.totalResult.competency_score[i].pivot.competency_id, score: AssessmentStore.totalResult.competency_score[i].pivot.score };
        const gIndex: number = DesignationMasterStore.competencies.findIndex(e => e.competency_group_id == AssessmentStore.totalResult.competency_score[i].competency_group_id);
      //  console.log(gIndex);
        // const index: number = DesignationMasterStore.competencies.findIndex(e => e.id == AssessmentStore.totalResult.competency_score[i].competency_group_id);
        const index: number = DesignationMasterStore.competencies[gIndex]?.competencies.findIndex(k => k.id == AssessmentStore.totalResult.competency_score[i].pivot.competency_id);
          
        // this.checkAnswerStatus(i, j, AssessmentStore.totalResult.competency_score[i].pivot[j]?.score);
        // let competency_res = { competency_id: competency, score: answer };
        if( AssessmentStore.result[gIndex])
        AssessmentStore.result[gIndex][index]= competency_res;
        AssessmentStore.setAssessmentResult(gIndex, index, competency_res);

        // console.log( AssessmentStore.result);
        
        // AssessmentStore.setAssessmentResult(i, index, competency_res);
    }
    for (let answers of AssessmentStore.result) {
      for (let ans of answers) {
        if(ans.score)
        AssessmentStore.total_score = AssessmentStore.total_score + ans.score;
      }
    }
    
  }
  }



  checkAnswerStatus(gIndex, index, answer) {
    if (gIndex < AssessmentStore.result.length) {
      if (AssessmentStore.result[gIndex][index]?.score == answer) {
        return true
      }
      else
        return false;
    }
    else
      return false
  }

  startAssessment(checked:boolean=false) {
    AppStore.disableLoading();
    this.formErrors = null;
    // if(!this.editAssessment){
      DesignationMasterStore.unsetCompetencies();
      let designation_id = UsersStore.individualUser.designation;
      this._designationService.getCompetencies(designation_id.id).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        for(let i=0;i<DesignationMasterStore.competencies.length;i++){
          AssessmentStore.result[i]=[];
          for(let j=0;j<DesignationMasterStore.competencies[i].competencies.length;j++){
            AssessmentStore.result[i][j]=[];
          }
        }
        // if(!checked)
          AssessmentStore.setAssessmentStarted();
        // console.log(DesignationMasterStore?.competencies.length);
  
      })
    // }
    if(this.editAssessment){
      setTimeout(() => {
        if (AssessmentStore.assessmentId != null) {
          this._assessmentService.getResult(UsersStore.user_id, AssessmentStore.assessmentId).subscribe(res => {
            this._utilityService.detectChanges(this._cdr);
            this.setAnswers();
           
             
          })
        }
      }, 300);
      // AssessmentStore.setAssessmentStarted();
    }
   
    
  }


  submitAnswer() {
    this.formErrors = null;
    let save;
    AppStore.enableLoading();
    for (let answers of AssessmentStore.result) {
      for (let ans of answers) {
        this.result['competencies'].push({ competency_id: ans.competency_id, score: ans.score });
      }
    }

    if(AssessmentStore.assessmentId){
      save = this._assessmentService.updateAnswer(UsersStore.user_id, this.result,AssessmentStore.assessmentId);
    }
    else{
      save=this._assessmentService.saveAnswer(UsersStore.user_id, this.result)
    }
    save.subscribe(res => {
      AssessmentStore.unsetAssessmentStarted();
      
      this._utilityService.detectChanges(this._cdr);
      this.result['competencies'] = [];
      this._assessmentService.getResult(UsersStore.user_id, res['id']).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
        this.openResultModal();
      }

      );
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
    }

    );
   
  }

  openResultModal(){
    $(this.resultModal.nativeElement).modal('show');
  }

  cancelAssessment(status) {
    // console.log(AssessmentStore.currentPage);
    if(status){
      // AssessmentStore.currentPage = Math.ceil(AssessmentStore.totalItems/15);
    // console.log(AssessmentStore.currentPage);
    
    this._router.navigateByUrl('/human-capital/assessments');

    }
    
    setTimeout(() => {
      AppStore.disableLoading();
      $(this.cancelPopup.nativeElement).modal('hide');
      this.clearCancelObject();
    }, 250);
    
  }

  closeModal(){
    // AssessmentStore.currentPage = Math.ceil(AssessmentStore.totalItems/15);
    // console.log(AssessmentStore.currentPage);
    
    this._router.navigateByUrl('/human-capital/assessments');
    AppStore.disableLoading();
  }

  clearCancelObject() {

    this.cancelObject.type = null;
  }


  cancel() {
    
    this.cancelObject.type = 'Cancel';

    $(this.cancelPopup.nativeElement).modal('show');
  }


  getDefaultGeneralImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }


  createImageUrl(type, token) {
    return this._humanCpitalService.getThumbnailPreview(type, token);
  }

  selectUser(event) {
    AssessmentStore.unsetAssessmentStarted();
    UsersStore.user_id = event.id;
    this._usersService.getItemById(event.id).subscribe(res => {
      AssessmentStore.setUserSelected();
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getUsers() {
    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  searchUers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  clearSelectedUser(){
    AssessmentStore.assessment_started = false;
    this._utilityService.scrollToTop();
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
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  getCompetencyTitle(competencyId,competencyGroup){
    let pos = competencyGroup.competency_score.findIndex(e => e.competency_group.id == competencyId);
    return competencyGroup.competency_score[pos].title;
  }
  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    UsersStore.unsetUserId();
    UsersStore.unsetIndividualUser();
    AssessmentStore.assessment_started = false;
    AssessmentStore.assessmentId = null;
    // AssessmentStore.unsetUserSelected();
    AssessmentStore.unsetAssessmentResult();
    AssessmentStore.unsetUserSelected();
    DesignationMasterStore.unsetCompetencies();
    this.cancelEventSubscription.unsubscribe();
    this.designationCompetencySubscriptionEvent.unsubscribe();
    NoDataItemStore.unsetNoDataItems();
    this.editAssessment=false;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
