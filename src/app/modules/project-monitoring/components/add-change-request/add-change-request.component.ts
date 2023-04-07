import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ProjectChangeRequestService } from 'src/app/core/services/project-monitoring/project-change-request/project-change-request.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-add-change-request',
  templateUrl: './add-change-request.component.html',
  styleUrls: ['./add-change-request.component.scss']
})
export class AddChangeRequestComponent implements OnInit {
  @Input('source') changeRequestSource: any;
  @ViewChild('externalUsers', {static: true}) externalUsers: ElementRef;

  ProjectChangeRequestStore = ProjectChangeRequestStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  ProjectMonitoringStore = ProjectMonitoringStore

  AppStore = AppStore;
  UsersStore = UsersStore;
  form: FormGroup;
	formErrors: any;
  selectedItems: any = [];
  is_duration = true;
  is_teams = true;
  is_scopeofwork = true;
  is_budget = true;
  is_delivarables = true;
  startDate = null;
  endDate = null;
  durationJustification
  selectedId: any;
  externalUserObject = {
    type : null,
    id : null,
    value : null
  }
  projectExternalUserEventSubscrion: any;

  constructor(private _changeRequestService : ProjectChangeRequestService,
              private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _eventEmitterService: EventEmitterService,
              private _usersService: UsersService,
              private _imageService: ImageServiceService,
              private _humanCapitalService: HumanCapitalService,
              private _helperService: HelperServiceService,
              private _renderer2: Renderer2,


    ) { }

  ngOnInit(): void {
    
    
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

    this.projectExternalUserEventSubscrion = this._eventEmitterService.externalUserChangeReq.subscribe(item => {
      this.closeNewExternalUser()
    })
    this.getItems()
  }

  changeFirstStepForm(){
    let obj = {
      change_request_item_ids : this.selectedItems
    }
    this._changeRequestService.saveChangeRequestItems(obj).subscribe(res=>{
      this.selectedId = res.id
      this._utilityService.detectChanges(this._cdr);
    })

  }

  cancel(){
  this._eventEmitterService.dissmissProjectChangeRequestModal()
  }

  changeSecondtStepForm(){
    let obj = {
      type : 'existing',
      start_date : this._helperService.processDate(this.startDate,'join'),
      end_date : this._helperService.processDate(this.endDate,'join'),
      justification : this.durationJustification ? this.durationJustification : null
    }
    this._changeRequestService.saveDuration(obj,this.selectedId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr); 
    })
  }

  changeThirdtStepForm(){
    
  }

  getItems(){
    this._changeRequestService.getItem().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changeItems(event,item){
    if(event){
      this.selectedItems.push(item.id)
    }else {
      let pos = this.selectedItems.findIndex(e=>e == item.id)
      if(pos != -1){
        this.selectedItems.splice(pos,1)
      }
    }
    this._utilityService.detectChanges(this._cdr);

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

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token);
  }
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
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

  openExternalUserPopup(){
    this.externalUserObject.type = 'Add',
    setTimeout(() => {
      $(this.externalUsers.nativeElement).modal('show');
    }, 100);
    // this._renderer2.addClass(this.deliverables.nativeElement,'show');
    this._renderer2.setStyle(this.externalUsers.nativeElement,'display','block');
    this._renderer2.setStyle(this.externalUsers.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.externalUsers.nativeElement,'z-index',99999);
  }

  closeNewExternalUser(){
 
    setTimeout(() => {
      // $(this.newProject.nativeElement).modal('hide');
      this.externalUserObject.type = null;
      this.externalUserObject.value = null;
      $(this.externalUsers.nativeElement).modal('hide');
      this._renderer2.removeClass(this.externalUsers.nativeElement,'show');
      this._renderer2.setStyle(this.externalUsers.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

}
