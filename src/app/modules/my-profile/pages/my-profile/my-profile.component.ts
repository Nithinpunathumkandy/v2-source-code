import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { profile } from 'src/app/core/models/my-profile/profile/myprofile-profile.model';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { MyprofileProfileService } from 'src/app/core/services/my-profile/profile/profile/myprofile-profile.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MyProfileProfileStore } from 'src/app/stores/my-profile/profile/profile.store';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";
declare var $: any

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: false }) formModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationModulesStore = OrganizationModulesStore;
  MyProfileProfileStore = MyProfileProfileStore;
  profileSubscriptionEvent: any = null;
  profileObject = {
    component: 'Myprofile',
    values: null,
    type: null,
    category: null,
  };
  constructor(private _renderer2: Renderer2,
              private _utilityService: UtilityService,
              private _humanCapitalService: HumanCapitalService,
              private _cdr: ChangeDetectorRef,
              private _eventEmitterService:EventEmitterService,
              private _profileService: MyprofileProfileService) { }

  ngOnInit(): void {
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    setTimeout(() => {
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    this.profileSubscriptionEvent = this._eventEmitterService.profileModal.subscribe(res => {
      this.closeFormModal();
    })

    this.getprofile();
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  getprofile() {
    this._profileService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }


  editProfile() {
    const profile: profile = MyProfileProfileStore.profile;
    this.profileObject.values = {
      id: profile.id,
      first_name: profile.name,
      last_name: profile.last_name,
      email: profile.email,
      mobile: profile.mobile,
      contact: profile.address[0],
      emergency: profile.address[1],
      image_name:profile.name,
      image_ext : profile.image_ext,
      image_size: profile.image_size,
      image_url: profile.image_url,
      image_token:profile.image_token
    }
    this.profileObject.type = 'Edit';
    this.profileObject.category = 'Profile';
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    this.getprofile();
    // this._utilityService.detectChanges(this._cdr);
    $(this.formModal.nativeElement).modal('hide');
    this.profileObject.type = null;
    this.profileObject.values = null;
  }

  ngOnDestroy(){
    MyProfileProfileStore.unsetProfile();
  }

}
