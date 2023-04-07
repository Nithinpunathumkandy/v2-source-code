import { Component, OnInit,ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import {AclService} from 'src/app/core/services/acl/acl.service';
import {AclStore} from "src/app/stores/acl/acl.store";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse} from '@angular/common/http';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import {AclRole} from "src/app/core/models/acl/acl";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;
@Component({
  selector: 'app-acl',
  templateUrl: './acl.component.html',
  styleUrls: ['./acl.component.scss']
})
export class AclComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AclStore = AclStore;
  formErrors = null;
  form: FormGroup;
  AppStore = AppStore;
  deleteObject = {
    title: '',
    type:'',
    position:null,
    id: null,
    subtitle: '',
    status:''
  };
  deleteEventSubscription: any;
  networkFailureSubscription:any;
  idleTimeoutSubscription:any;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _aclService:AclService,
    private _formBuilder: FormBuilder,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2:Renderer2) { }


  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              AppStore.disableLoading();
              
               this._utilityService.detectChanges(this._cdr);
               this.openFormModal();
            }, 500);
            break;
            case "apply_to_users":
              this.applyActivity();
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(AuthStore.user.designation?.is_super_admin){
        var subMenuItems = [
          { activityName: 'CREATE_ROLE', submenuItem: { type: 'new_modal' } },
          {activityName:null, submenuItem:{type:'apply_to_users'}}
        ]
      }
      else{

      var subMenuItems = [
        { activityName: 'CREATE_ROLE', submenuItem: { type: 'new_modal' } },
     
      ]
    }

      this._helperService.checkSubMenuItemPermissions(1200, subMenuItems);

    })

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]
    });

   this.pageChange(1);

   this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    this.delete(item);
  })
  this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })
  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
    if(!status){
      this.changeZIndex();
    }
  })

  }

  changeZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
  }
  pageChange(newPage: number = null) {
    if (newPage) AclStore.setCurrentPage(newPage);
    this._aclService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
  }

  closeFormModal() {
    this.resetForm();
    $(this.formModal.nativeElement).modal('hide');
  
  }

  openFormModal(){
    AppStore.disableLoading();
    $(this.formModal.nativeElement).modal('show');
  }

  editRole(id){
    const role: AclRole = AclStore.getAclRoleById(id);
    
    //set form value
    this.resetForm();
    
    this.form.setValue({
      id: role.id,  
      title: role.title
    });

    this.openFormModal();
  }

  delete(status){
    if (status && this.deleteObject.id && this.deleteObject.type=='') {
    this._aclService.delete(this.deleteObject.id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      this.clearDeleteObject();
    })
  }
  else if(this.deleteObject.type=='Confirm'){
    SubMenuItemStore.applyToUsersClicked = true;
    this._aclService.UpdateAllUsers(null).subscribe(res=>{
      SubMenuItemStore.applyToUsersClicked = false;
      this._utilityService.detectChanges(this._cdr);
      this.clearDeleteObject();
    },(error)=>{
      SubMenuItemStore.applyToUsersClicked = false;
      this.clearDeleteObject();
      this._utilityService.detectChanges(this._cdr);
    })
  }
  else {
    this.clearDeleteObject();
  }
  setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
  }, 250);
  }

  deleteRole(id,position) {
    this.deleteObject.id = id;
    this.deleteObject.position = position;
    this.deleteObject.type = '';
    this.deleteObject.title = 'delete_role';
    this.deleteObject.subtitle = 'this_action_cannot_be_undone';

    $(this.deletePopup.nativeElement).modal('show');
  }

  applyActivity() {
    this.deleteObject.type = 'Confirm';
    this.deleteObject.title = 'reset_activities';
    this.deleteObject.subtitle = 'are_you_sure_you_want_to_reset_the_activities_for_all_users';

    $(this.deletePopup.nativeElement).modal('show');
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = '';
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';
  }


  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._aclService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._aclService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
        this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        }
      });
    }
  }

  gotoActivities(roleId){
    AclStore.setRoleId(roleId);
    this._router.navigateByUrl('/security/role-activities');
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.applyToUsersClicked = false;
    this.deleteEventSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
  }

}
