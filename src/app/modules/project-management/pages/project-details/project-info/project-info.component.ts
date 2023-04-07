import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { ProjectManagementInfoService } from 'src/app/core/services/project-management/project-details/info/project-management-info.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { projectDetailStore } from 'src/app/stores/project-management/project-details/project-details.store';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;
@Component({
  selector: 'app-project-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {

  @ViewChild('ProjectActivityModal') ProjectActivityModal : ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;

  ProjectsStore = ProjectsStore;
  ProjectDetailStore = projectDetailStore;
  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;

  projectActivityObject = {
    id : null,
    type : null,
    values : null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  projectActivityEventSubscription: any;
  popupControlEventSubscription: any;
  
  constructor(
    private _pmInfoService: ProjectManagementInfoService,
    private _imageService: ImageServiceService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new'});
    this.reactionDisposer = autorun(() => {
        var subMenuItems = [
          { activityName: null, submenuItem: { type: 'close', path: '../' } },
        ]

      this._helperService.checkSubMenuItemPermissions(600,subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addProjectActivity()
        NoDataItemStore.unSetClickedNoDataItem();
      }
    });
    this.getProjectDetails();

    this.projectActivityEventSubscription = this._eventEmitterService.projectActivityModal.subscribe(res => {
      this.closeProjectModal();
    });

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteItem(status);
        break;
    }
  }

  
  getProjectDetails() {
    this._pmInfoService.getSubProjectDetails(this.ProjectsStore.selectedProjectID).subscribe();
  }

  diffDays(date){
    date = new Date(date);
    let otherDate:any = new Date();
    return Math.ceil((date - otherDate) / (1000 * 60 * 60 * 24));
  } 

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  toNumber(str){
    return Number(str)
  }

  assignUserValues(user){
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

    userInfoObject.first_name = user?.first_name;
    userInfoObject.last_name = user?.last_name;
    userInfoObject.designation = user?.designation;
    userInfoObject.image_token = user?.image.token;
    userInfoObject.email = user?.email;
    userInfoObject.mobile = user?.mobile;
    userInfoObject.id = user?.id;
    userInfoObject.status_id = user?.status.id
    userInfoObject.department = null;
     return userInfoObject;
  }

  }
//project model popup
openProjectModal() {
    setTimeout(() => {
      $(this.ProjectActivityModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.ProjectActivityModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.ProjectActivityModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.ProjectActivityModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    },100);
}

closeProjectModal() {
    $(this.ProjectActivityModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.ProjectActivityModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.ProjectActivityModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.ProjectActivityModal.nativeElement, 'overflow', 'none');
		$('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.projectActivityObject=null;
    this.getProjectDetails();
}

addProjectActivity(){
  ProjectsStore.unsetsetProjectActivityDetails();
  this.projectActivityObject ={
    id:null,
    type:'Add',
    values:null
  } ;
  // ProjectsStore.editFlag=true;  
  this._utilityService.detectChanges(this._cdr);
  this.openProjectModal();
}

edit(row) {
    this.projectActivityObject ={
      id:null,
      type:'Edit',
      values:row
    } ;
      ProjectsStore.editFlag=true;
      this._utilityService.detectChanges(this._cdr);
      this.openProjectModal();
}

delete(id: number) {
  this.popupObject.type = '';
  this.popupObject.id = id;
  this.popupObject.title = 'Delete';
  this.popupObject.subtitle = 'project_activity_delete';
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  },100);
  
}

deleteItem(status: boolean) {
  if (status && this.popupObject.id) {

    this._pmInfoService.deleteProjectInfo(this.popupObject.id).subscribe(resp => {
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.clearPopupObject();
    });
  }
  else {
    this.clearPopupObject();
  }
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
}
clearPopupObject() {
  this.popupObject.id = null;
  this.getProjectDetails();
}

}
