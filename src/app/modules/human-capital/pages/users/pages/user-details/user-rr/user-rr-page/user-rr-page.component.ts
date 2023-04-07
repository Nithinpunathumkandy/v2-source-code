import { Component, OnInit,ChangeDetectorRef,Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserRoleStore } from 'src/app/stores/human-capital/users/user-role.store';
import { UserRoleService } from 'src/app/core/services/human-capital/user/user-role/user-role.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
declare var $: any;

@Component({
  selector: 'app-user-rr-page',
  templateUrl: './user-rr-page.component.html',
  styleUrls: ['./user-rr-page.component.scss']
})
export class UserRrPageComponent implements OnInit,OnDestroy {
  @ViewChild('popup') popup: ElementRef;

  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserRoleStore = UserRoleStore;
  UsersStore = UsersStore;
  fileUploadProgress = 0;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  previewObject = {
    file_details: null,
    component: '',
    preview_url: null,
    file_name: '',
    file_type: '',
    size: '',
    uploaded_user: null,
    created_at: null
  }
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
  AuthStore = AuthStore;
  hover = false;
  activeType = null;
  activeIndex=null;
  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userRoleService: UserRoleService,
    private _imageService: ImageServiceService,
    private _humanCapitalService: HumanCapitalService,
    private _helperService:HelperServiceService,
    private _renderer2:Renderer2
    ) { }

  ngOnInit() {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
       
        {activityName: 'GENERATE_USER_ROLES_AND_RESPONSIBILITY_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_USER_ROLES_AND_RESPONSIBILITY', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close',path:'/human-capital/users'}},
      ]
    
      this._helperService.checkSubMenuItemPermissions(200,subMenuItems);
      NoDataItemStore.setNoDataItems({title: "rr_nodata_title"});
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
      case "template":

              var fileDetails = {
                ext: 'xlsx',
                title: 'Roles & Responsibility Template.xlsx',
                size: null
              };
              this._humanCapitalService.downloadFile('rr-template', null, null, fileDetails.title,null, fileDetails);
              break;
            case "export_to_excel":
  
              var fileDetails = {
                ext: 'xlsx',
                title: 'Roles & Responsibilities.xlsx',
                size: null
              };
              this._humanCapitalService.downloadFile('rr-export', null, null, fileDetails.title,null, fileDetails);
              break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }

    })


    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      reporting_to: ['', [Validators.required]],
      accountable: ['', [Validators.required]],
      consulted: ['', [Validators.required]],
      informed: ['', [Validators.required]],
      documents: ['']
    });

    SubMenuItemStore.setNoUserTab(true);

    // SubMenuItemStore.setSubMenuItems([
    
    //   { type: 'template' },
    //   { type: 'export_to_excel' },
    //   { type: 'close', path: '../' },
    // ]);
   
  this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) UserRoleStore.setCurrentPage(newPage);
    this._userRoleService.getItems().subscribe(() => {

      if (UserRoleStore.loaded && UserRoleStore.userRoleDetails.length > 0) {
        this.getUserRole(UserRoleStore.userRoleDetails[0].id, 0, true);

      }
      this._utilityService.detectChanges(this._cdr);

    });

  }

  getPopupDetails(user,row){
    // $('.modal-backdrop').remove();
    if(user&& row.is_accordion_active==true){
      this.userDetailObject.first_name = user.first_name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation;
      this.userDetailObject.image_token = user.image.token;
      this.userDetailObject.email = user.email;
      this.userDetailObject.mobile = user.mobile;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department?user.department:null;
      this.userDetailObject.status_id = user.status.id?user.status.id:1;
      return this.userDetailObject;
    }
   
   
  }

  mouseHover(event, index,type) {

   
      this.activeType = type;
      this.activeIndex = index;
   
      this.hover = true;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
    }

  }

  mouseOut(event) {
    this.activeIndex = null;
    this.activeType = null;
    this.hover = false;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
    }

  }


  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }


  getUserRole(id: number, index: number, initial: boolean = false) {

    UserRoleStore.unsetIndiviudalRoleDetails();
    for (let i = 0; i < UserRoleStore.userRoleDetails.length; i++) {
      if (UserRoleStore.userRoleDetails[i].is_accordion_active == false && i == index || initial) {
        initial = false;
        this._userRoleService.getItem(id).subscribe(res => {
          this._utilityService.detectChanges(this._cdr);
          
        })
        // break;
      }
    }
    this.UserRoleStore.setRoleListAccordion(index);

  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(type, token) {

    return this._imageService.getThumbnailPreview(type, token);
  }


  


}
