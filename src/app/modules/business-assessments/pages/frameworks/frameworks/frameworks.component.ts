import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { FrameworksService } from 'src/app/core/services/business-assessments/frameworks/frameworks.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;

@Component({
  selector: 'app-frameworks',
  templateUrl: './frameworks.component.html',
  styleUrls: ['./frameworks.component.scss']
})
export class FrameworksComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  FrameworksStore = FrameworksStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  AppStore = AppStore;
  AuthStore = AuthStore;
  userDetailObject = {
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
 
  frameworkObject = {
    component: 'BusinessAssessment',
    values: null,
    type: null
  };
  frameworkSubscriptionEvent: any = null;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  constructor(private _frameworksService: FrameworksService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2:Renderer2,
    private _imageService:ImageServiceService,
    private _humanCpitalService:HumanCapitalService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'new_modal' } },
        { activityName: 'BUSINESS_ASSESSMENT_FRAMEWORK_LIST', submenuItem: { type: 'refresh' } },
        // { activityName: 'GENERATE_BUSINESS_ASSESSMENT_FRAMEWORK_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'BUSINESS_ASSESSMENT_FRAMEWORK_LIST', submenuItem: { type: 'search' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "framework_nodata_title", subtitle: 'framework_nodata_subtitle',buttonText: 'add_new_framework'});
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.addNewFramework();
            }, 1000);
            break;
          case "refresh":
              FrameworksStore.loaded = false;
              this.pageChange(1)
              break;
          // case "template":
          //   this._frameworksService.generateTemplate();
          //   break;
          case "export_to_excel":

            this._frameworksService.exportToExcel();
            break;
          case "search":
            FrameworksStore.searchText = SubMenuItemStore.searchText;
            this.searchFrameworkList();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewFramework();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      setTimeout(() => {
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        window.addEventListener('scroll',this.scrollEvent,true);
      }, 1000);
    })

     

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    this.frameworkSubscriptionEvent = this._eventEmitterService.frameworkControl.subscribe(res => {
      this.closeFormModal();
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

    this.pageChange(1);

    SubMenuItemStore.setNoUserTab(true);
    
  }

  pageChange(newPage: number = null) {

    if (newPage) FrameworksStore.setCurrentPage(newPage);
    this._frameworksService.getItems(false,'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }



  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
  }

  gotoDetails(id) {
    FrameworksStore.setFrameworkId(id);
    this._router.navigateByUrl('/business-assessments/frameworks/' + id)
  }

  
  getPopupDetails(user){
    this.userDetailObject.first_name = user.created_by_first_name;
    this.userDetailObject.last_name = user.created_by_last_name;
    this.userDetailObject.designation = user.created_by_designation;
    this.userDetailObject.image_token = user.created_by_image_token;
    this.userDetailObject.email = user.created_by_email;
    this.userDetailObject.mobile = user.created_by_mobile;
    this.userDetailObject.id = user.created_by;
    this.userDetailObject.department = user.created_by_department?user.created_by_department:null;
    this.userDetailObject.status_id = user.created_by_status_id?user.created_by_status_id:1;
    return this.userDetailObject;
  }

    /**
 * 
 * @param type -document -will get thumbnail preview of document or else user profile picture
 * 
 * @param token -image token
 */
createImageUrl(type, token) {

  return this._humanCpitalService.getThumbnailPreview(type, token);
}


getDefaultImage(type) {
  return this._imageService.getDefaultImageUrl(type);
}


  
  addNewFramework(){
    this.frameworkObject.type = 'Add';
    this.frameworkObject.values=null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  setFrameworkSort(type, callList: boolean = true) {
    this._frameworksService.sortFrameworkList(type, callList);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
 
  }

  searchFrameworkList() {
    FrameworksStore.setCurrentPage(1);
    this._frameworksService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  /**
* Delete the framework
* @param id -franework id
*/
  delete(status) {

    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._frameworksService.delete(this.deleteObject.id);
          break;
        case 'Deactivate': type = this._frameworksService.deactivate(this.deleteObject.id);
          break;
        case 'Activate': type = this._frameworksService.activate(this.deleteObject.id);
          break;
      }

      type.subscribe(resp => {
        this.clearDeleteObject();
        this.pageChange(FrameworksStore.currentPage);
        // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.clearDeleteObject();
        setTimeout(() => {
          if (error.status == 405) {
            // this.deactivate(this.deleteObject.id);
    
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.clearDeleteObject();
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);
    // let type;
    // if (status && this.deleteObject.id) {
    //   switch(this.deleteObject.type){
    //     case 'delete':type = this._frameworksService.delete(this.deleteObject.id);
    //     case 'Deactivate': type = this._frameworksService.deactivate(this.deleteObject.id);
    //     break;
    //   case 'Activate': type = this._frameworksService.activate(this.deleteObject.id);
    //     break;
    //     break;

    //   }
    //   type.subscribe(resp => {
    //     setTimeout(() => {
    //       this._utilityService.detectChanges(this._cdr);
    //       if (FrameworksStore.currentPage > 1 && this.deleteObject.type == '') {
    //         FrameworksStore.currentPage = Math.ceil(FrameworksStore.totalItems / 15);
    //         this.pageChange(FrameworksStore.currentPage);
    //       }
    //     }, 500);
    //     this.clearDeleteObject();
    //   },(error=>{
    //     setTimeout(() => {
    //       if(error.status == 405){
    //         this.deactivateFramework(this.deleteObject.id);
    //        this._utilityService.detectChanges(this._cdr);
    //      }
    //     }, 100);
        
    //   }));
    // }
    // else {
    //   this.clearDeleteObject();
    // }
    // setTimeout(() => {
    //   $(this.deletePopup.nativeElement).modal('hide');
    // }, 250);

  }

  closeFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.frameworkObject.type = null;
  }

  deleteFramework(id) {
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_framework_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  deactivateFramework(id: number) {

    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.subtitle = 'deactivate_framework_subtitle';

    $(this.deletePopup.nativeElement).modal('show');

  }

  activateFramework(id: number) {

    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.subtitle = 'activate_framework_subtitle';

    $(this.deletePopup.nativeElement).modal('show');

  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }

  editFramework(id) {

    this._frameworksService.getItem(id).subscribe(res => {
      this.frameworkObject.values = {
        id: res['id'],
        title: res['title'],
        description: res['description'],
        maturity_models: res['maturity_models'],
        is_control_assessment:res['is_control_assessment'],
        option: res['business_assessment_framework_options']
      }
      this.frameworkObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.frameworkSubscriptionEvent.unsubscribe();
    SubMenuItemStore.searchText = '';
    FrameworksStore.searchText = '';
    FrameworksStore.unsetFrameworkDetails();
  }


}
