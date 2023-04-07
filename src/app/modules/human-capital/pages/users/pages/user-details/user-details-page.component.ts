import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { Router } from '@angular/router';
import { AddUserStore } from 'src/app/stores/human-capital/users/add-user.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ActivatedRoute } from '@angular/router';
import { UserQualificationService } from 'src/app/core/services/human-capital/user/user-qualification/user-qualification.service';
import { UserCertificateService } from 'src/app/core/services/human-capital/user/user-certificate/user-certificate.service';
import { UserWorkExperienceService } from 'src/app/core/services/human-capital/user/user-work-experience/user-work-experience.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { UserDocumentStore } from 'src/app/stores/human-capital/users/user-document.store';
import { UserJobStore } from 'src/app/stores/human-capital/users/user-job.store';
import { UserRoleStore } from 'src/app/stores/human-capital/users/user-role.store';
import { UserKpiStore } from 'src/app/stores/human-capital/users/user-kpi.store';
import { AssessmentStore } from 'src/app/stores/human-capital/assessment/assessment.store';
import { UserReportStore } from 'src/app/stores/human-capital/users/user-report.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Component({
  selector: 'app-user-details-page',
  templateUrl: './user-details-page.component.html',
  styleUrls: ['./user-details-page.component.scss']
})
export class UserDetailsPageComponent implements OnInit,OnDestroy {
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef
  @ViewChild('sideBarRound', { static: true }) sideBarRound: ElementRef;
  @ViewChild('curveToggle') curveToggle: ElementRef;
  @ViewChildren('userSideBar') userSideBar: QueryList<ElementRef>;
  @ViewChild('userRightDetails') userRightDetails: ElementRef;

  UsersStore = UsersStore;
  sideCollapsed: boolean = false;
  OrganizationModulesStore = OrganizationModulesStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reportingUser = null;
  userDetailObject = {
    first_name:'',
    last_name:'',
    designation:'',
    image_token:'',
    mobile:null,
    email:'',
    id:null,
    department:'',
    status_id:null,
  }
  constructor(private _renderer2: Renderer2, private _router: Router,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _usersService: UsersService,
    private route: ActivatedRoute,
    private _qualificationService: UserQualificationService,
    private _certificateService: UserCertificateService,
    private _experienceService: UserWorkExperienceService,
    private _imageService: ImageServiceService,
    private _humanCpitalService: HumanCapitalService,
    private _helperService: HelperServiceService) { }

  ngOnInit() {
    // setTimeout(() => {
      window.addEventListener('scroll', this.scrollEvent, true);
    // }, 100);
    SubMenuItemStore.setNoUserTab(true);
    
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      this.getUserDetails(id);
      // In a real app: dispatch action to load the details here.
    })
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 10) {
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }

  }


  tabListUlClick(ev) {
    if ((ev.target.tagName == 'A') && (ev.target.classList.contains('full-screen-click')))
      this.collapseSide();
    else if ((ev.target.tagName == 'A') && (ev.target.classList.contains('nav-link-show')))
      this.unCollapseSide();
  }

  collapseSide() {
    if (!this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      setTimeout(() => {
        this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
        this._renderer2.addClass(this.userRightDetails.nativeElement, 'flex-98-width');
      }, 150);
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'block');
      this._renderer2.addClass(this.sideBarRound.nativeElement, 'tActive');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'position', 'fixed');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'z-index', '9999');
      this.sideCollapsed = true;
    }
  }

  unCollapseSide() {
    if (this.sideCollapsed && this.userSideBar.first) {
      this._renderer2.removeClass(this.userSideBar.first.nativeElement, 'user-side-bar-hd');
      this._renderer2.addClass(this.userSideBar.first.nativeElement, 'user-side-bar-sw');
      this._renderer2.removeClass(this.userRightDetails.nativeElement, 'flex-98-width');
      this._renderer2.setStyle(this.sideBarRound.nativeElement, 'display', 'none');
      this._renderer2.removeClass(this.sideBarRound.nativeElement, 'tActive');

      this.sideCollapsed = false;
    }
  }


  getDefaultGeneralImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  editUser() {
    AddUserStore.setEditFlag();
    this._router.navigateByUrl('/human-capital/users/add-user');
  }

  deleteUser() {
    this._usersService.deleteUser(UsersStore.user_id).subscribe(res => {
      this._router.navigateByUrl('/human-capital/users');
    })

  }

  getUserDetails(id) {
      this._usersService.saveUserId(id);
      this._usersService.getItemById(id).subscribe(res => {
        // if(res['user_id']!=null){
        //   this._usersService.getItem('/'+res['user_id']).subscribe(response=>{
        //     this.reportingUser = response;
        //     this._utilityService.detectChanges(this._cdr);
        //     // console.log(this.reportingUser);
        //   })
        // }
        this._qualificationService.getQualification(id).subscribe();
        this._experienceService.getWorkExperience(id).subscribe();
        this._certificateService.getCertificate(id).subscribe();

        this._utilityService.detectChanges(this._cdr);
        this.setSubmenu();
      })
  }

  setSubmenu() {
    // this._usersService.editSubmenu();

  }

  getLanguageTranslate(text){
    return this._helperService.translateToUserLanguage(text);
  }

  //Returns default image, if no image is present
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token) {
    return this._humanCpitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getPopupUserDetails(user){
    if(user?.id){
      $('.modal-backdrop').remove();
      this.userDetailObject.first_name = user.name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation?.title;
      this.userDetailObject.image_token = user.image_token;
      this.userDetailObject.email = user.email;
      this.userDetailObject.mobile = user.mobile;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department?.title?user.department?.title:null;
      this.userDetailObject.status_id = user.status_id?user.status_id:1;
      return this.userDetailObject;
    }
   
  }

  dropdownItemClicked(item){
    if(item.client_side_url == 'human-capital/users/'+UsersStore.user_id){
       this.unCollapseSide();
    }
    else{
       this.collapseSide();
    }
 }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    UsersStore.designation_id = null;
    UsersStore.unsetIndividualUser();
    UserDocumentStore.unsetUserDocumentDetails();
    UserJobStore.unsetUserJobDetails();
    UserRoleStore.unsetUserRoleDetails();
    UserKpiStore.unsetUserKpiDetails();
    AssessmentStore.unsetUserAssessments();
    UserReportStore.unsetReportDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }







}
