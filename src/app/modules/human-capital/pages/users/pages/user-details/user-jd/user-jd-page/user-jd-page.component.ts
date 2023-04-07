import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserJobStore } from 'src/app/stores/human-capital/users/user-job.store';
import { UserJobService } from 'src/app/core/services/human-capital/user/user-job/user-job.service';
import { IndividualJob } from 'src/app/core/models/human-capital/users/user-job';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { JobService } from 'src/app/core/services/masters/human-capital/job/job.service';
import { JobMasterStore } from 'src/app/stores/masters/human-capital/job-master.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-user-jd-page',
  templateUrl: './user-jd-page.component.html',
  styleUrls: ['./user-jd-page.component.scss']
})
export class UserJdPageComponent implements OnInit,OnDestroy {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('jobModal', { static: true }) jobModal: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserJobStore = UserJobStore;
  UsersStore = UsersStore;
  JobMasterStore = JobMasterStore;
  fileUploadProgress = 0;
  hover = false;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  activeIndex = null;
  currentIndex = null;
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
  deleteObject = {
    id: null,
    position: null,
    type: '',
    subtitle:''
  };
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
  userDetailSupervisorObject = {
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
  usedJds;

  supervisorClicked = false;
  deleteEventSubscription: any;
  AuthStore = AuthStore;
  jobEventSubscription: any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;

  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _usersService: UsersService,
    private _userJobService: UserJobService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _sanitizer: DomSanitizer,
    private _eventEmitterService: EventEmitterService,
    private _humanCapitalService: HumanCapitalService,
    private _jobService: JobService,
    private _router:Router) { }

  ngOnInit() {
    NoDataItemStore.setNoDataItems({title: "jd_nodata_title", subtitle: 'jd_nodata_subtitle',buttonText: 'add_new_jd'});

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_USER_JD', submenuItem: { type: 'new_modal' } },
        // { activityName: 'GENERATE_USER_JD_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_USER_JD', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: '/human-capital/users' } },
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_USER_JD')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }

      this._helperService.checkSubMenuItemPermissions(200, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.form.pristine;
              this.formErrors = null;
              this._utilityService.detectChanges(this._cdr);

              this.openFormModal();
            }, 1000);
            break;

          case "template":

            var fileDetails = {
              ext: 'xlsx',
              title: 'JobTemplate.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('job-template', null, null, fileDetails.title, null, fileDetails);
            break;
          case "export_to_excel":

            var fileDetails = {
              ext: 'xlsx',
              title: 'Jobs.xlsx',
              size: null
            };
            this._humanCapitalService.downloadFile('job-export', null, null, fileDetails.title, null, fileDetails);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addNewDocument();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    this.jobEventSubscription = this._eventEmitterService.userJdControl.subscribe(res => {
      this.closeJobModal();
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
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

    this.getUsedJds();
    
    this.form = this._formBuilder.group({
      id: [''],
      user_id: [''],
      jd_id: [null, [Validators.required, Validators.maxLength(255)]],
      reporting_user_ids: [[], [Validators.required]],
      supervisor_id: [null],
    });

    SubMenuItemStore.setNoUserTab(true);

    this.pageChange(1);

  }

  getUsedJds(){
    this._userJobService.getUsedJds().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  mouseHover(event, index?) {

    if (index != undefined) {
      this.supervisorClicked = false;
      this.activeIndex = index;
    }
    else {
      this.activeIndex = null;
      this.supervisorClicked = true;
    }
    this.hover = true;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'block');
    }

  }

  addNewDocument(){
    this.form.reset();
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      // this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.jobModal.nativeElement).hasClass('show')){
      // this._renderer2.setStyle(this.jobModal.nativeElement,'z-index',9999);
      this._renderer2.setStyle(this.jobModal.nativeElement,'overflow','auto');
    }
    else if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
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

    getSupervisorPopupDetails(user,row){
      // $('.modal-backdrop').remove();
      if(user&& row.is_accordion_active==true){
        this.userDetailSupervisorObject.first_name = user.first_name;
        this.userDetailSupervisorObject.last_name = user.last_name;
        this.userDetailSupervisorObject.designation = user.designation;
        this.userDetailSupervisorObject.image_token = user.image.token;
        this.userDetailSupervisorObject.email = user.email;
        this.userDetailSupervisorObject.mobile = user.mobile;
        this.userDetailSupervisorObject.id = user.id;
        this.userDetailSupervisorObject.department = user.department?user.department:null;
        this.userDetailSupervisorObject.status_id = user.status.id?user.status.id:1;
        return this.userDetailSupervisorObject;
      }
   
   
    }
  
  
  gotoUser(id) {
    this._router.navigateByUrl('/human-capital/users/' + id);
  }

  mouseOut(event) {
    this.activeIndex = null;
    this.supervisorClicked = false;
    this.hover = false;
    if (this.popup) {
      this._renderer2.setStyle(this.popup.nativeElement, 'display', 'none');
    }

  }

  pageChange(newPage: number = null) {

    if (newPage) UserJobStore.setCurrentPage(newPage);
    this._userJobService.getItems().subscribe(() => {
      if (UserJobStore.loaded && UserJobStore.userJobDetails.length > 0) {
        this.getUserJob(UserJobStore.userJobDetails[0].id, 0, true);
      }
      this._utilityService.detectChanges(this._cdr);
    });

  }

  openFormModal() {
    this.getJob();
    this.currentIndex = null;
    this.formErrors = null;

    AppStore.disableLoading();
    setTimeout(() => {
      
      $(this.formModal.nativeElement).modal('show');
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999');
    }, 200);


  }

  closeFormModal() {
    UserJobStore.clearDocumentDetails();
    this.fileUploadsArray = [];
    this.form.reset();
    this.form.markAsPristine();

    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
      // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9');
      $(this.formModal.nativeElement).modal('hide');


    }, 300);
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      documents: UserJobStore.jobDetails
    })
    if (this.form.value.supervisor_id) {
      let supervisor = this.form.value.supervisor_id;
      this.form.value.supervisor_id = supervisor.id;
    }
    if (this.form.value.reporting_user_ids) {
      let reporting_to = [];
      for (let i of this.form.value.reporting_user_ids) {
        reporting_to.push(i.id);
      }
      this.form.value.reporting_user_ids = reporting_to

    }
    let save;
    AppStore.enableLoading();
    if (this.form.value.id) {
      save = this._userJobService.updateItem(this.form.value.id, this.form.value);
    } else {
      let saveData = {
        jd_id: this.form.value.jd_id ? this.form.value.jd_id : '',
        reporting_user_ids: this.form.value.reporting_user_ids ? this.form.value.reporting_user_ids : '',
        supervisor_id: this.form.value.supervisor_id ? this.form.value.supervisor_id : '',
      }
      save = this._userJobService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (!this.form.value.id) {
        this.form.reset();
        // this.usedJds.push(res['id']);
      }
      this.getUsedJds();

      setTimeout(() => {

        if (close) {
          this.closeFormModal();
          this.form.reset();
        }
      }, 300);
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this.processFormErrors();
        AppStore.disableLoading();
      }
      else if (err.status == 403 || err.status == 500) {
        this.closeFormModal();
        AppStore.disableLoading();
      }
    });
  }

  getJob() {

    this._jobService.getItems(false,'used_jd_ids='+UserJobStore.usedJds).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchJob(e) {

    this._jobService.searchItem('q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  activate(id: number, position) {

    this.deleteObject.id = id;
    this.deleteObject.position = position;
    this.deleteObject.type = 'Activate';
    this.deleteObject.subtitle = 'are_you_sure_activate';

    $(this.deletePopup.nativeElement).modal('show');

  }





  getUserJob(id: number, index: number, initial: boolean = false) {

    UserJobStore.unsetIndiviudalJobDetails();
    for (let i = 0; i < UserJobStore.userJobDetails.length; i++) {
      if (UserJobStore.userJobDetails[i].is_accordion_active == false && i == index || initial) {
        initial = false;
        this._userJobService.getItem(id).subscribe(res => {
          // console.log(res);
          this._utilityService.detectChanges(this._cdr);
        })
      }
    }
    this.UserJobStore.setJobListAccordion(index);
    this._utilityService.detectChanges(this._cdr);

  }

  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  editJob(id, index) {

    this.form.reset();
    this.form.markAsPristine();
    this.UserJobStore.clearDocumentDetails();
    this._userJobService.getItem(id).subscribe(res => {

      setTimeout(() => {
        if (UserJobStore.loaded) {
          const userJob: IndividualJob = UserJobStore.userJobById;
          //set form value
          if (userJob.documents && userJob.documents.length > 0) {
            for (let i of userJob.documents) {
              let docurl = this._humanCapitalService.getThumbnailPreview('user-jobs', i.token);
              let docDetails = {
                created_at: i.created_at,
                created_by: i.created_by,
                updated_at: i.updated_at,
                updated_by: i.updated_by,
                name: i.title,
                ext: i.ext,
                size: i.size,
                url: i.url,
                thumbnail_url: i.url,
                token: i.token,
                preview: docurl,
                id: i.id,
                user_job_id: i.user_job_id

              };
              this._userJobService.setDocumentDetails(docDetails, docurl, 'job-document');
            }

          }
          this.form.patchValue({
            user_id: UsersStore.user_id,
            id: userJob.id,
            jd_id: userJob.jd.id,
            reporting_user_ids: this.reportingUser(userJob.reporting_users),
            supervisor_id: userJob.supervisor,

          });

          this.openFormModal();
          this.currentIndex = index;
          this.searchJob({term: userJob.jd.id});
        }
      }, 300);

      this._utilityService.detectChanges(this._cdr);
    });

  }

  reportingUser(reporting) {

    let reporting_to = [];
    for (let i of reporting) {
      reporting_to.push(i);
    }
    return reporting_to;

  }

  delete(status) {

    let deleteType;
    if (status && this.deleteObject.id && this.deleteObject.type) {
      switch (this.deleteObject.type) {
        case 'Delete':
          deleteType = this._userJobService.delete(this.deleteObject.id, this.deleteObject.position);
          break;
        case 'Deactivate':
          deleteType = this._userJobService.deactivate(this.deleteObject.id);
          break;

        case 'Activate':
          deleteType = this._userJobService.activate(this.deleteObject.id);
          break;
      }
      deleteType.subscribe(resp => {
        setTimeout(() => {

          this._utilityService.detectChanges(this._cdr);
          if (this.deleteObject.position == 0 && UserJobStore.userJobDetails.length > 0)
            UserJobStore.userJobDetails[0].is_accordion_active = true;

        }, 200);

        this.clearDeleteObject();
      },(error=>{
        if(error.status == 405 && this.deleteObject.type=='Delete'){
          this.deleteObject.type = 'Deactivate';
 
           this.deactivateJob(this.deleteObject.id,this.deleteObject.position);
         //  this.addSubmenu();
          this._utilityService.detectChanges(this._cdr);
        }
      }));
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }

  clearDeleteObject() {

    this.deleteObject.id = null;
    this.deleteObject.position = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';

  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  /**
  * delete user
  */
  deleteJob(id: number, position: number) {

    this.deleteObject.id = id;
    this.deleteObject.position = position;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'are_you_sure_delete';

    $(this.deletePopup.nativeElement).modal('show');

  }

  deactivateJob(id: number, position) {

    this.deleteObject.id = id;
    this.deleteObject.position = position;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.subtitle = 'are_you_sure_deactivate';

    $(this.deletePopup.nativeElement).modal('show');

  }


  getUsers() {

    this._usersService.getAllItems('?exclude='+UsersStore.user_id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUers(e) {

    this._usersService.searchUsers('?q=' + e.term+'&exclude='+UsersStore.user_id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  viewDocument(document) {

    this._humanCapitalService.getFilePreview('user-job', UsersStore.user_id, document.id, document.jd_id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'Permission Denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
      }
    });

  }

  downloadDocument(job_id, filename, doc_id, doc) {
    this._humanCapitalService.downloadFile('user-job-documents', UsersStore.user_id, job_id, filename, doc_id, doc);
  }


  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails) {

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-job-documents';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = UserJobStore?.individualJobDetails?.created_by;
    this.previewObject.uploaded_user['image_token'] =  UserJobStore?.individualJobDetails?.created_by?.image?.token;
    this.previewObject.created_at = UserJobStore?.individualJobDetails?.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  closePreviewModal(event) {

    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';

  }


  openJobModal() {
    this.formErrors = null;
    AppStore.disableLoading();
    // this._renderer2.setStyle(this.jobModal?.nativeElement, 'z-index', '999999999');
    $(this.jobModal?.nativeElement).modal('show');
    // this._renderer2.setStyle(this.jobModal?.nativeElement, 'z-index', '9999');

  }



  closeJobModal() {
    // this._renderer2.setStyle(this.jobModal?.nativeElement, 'z-index', '9');
    $(this.jobModal.nativeElement).modal('hide');
    AppStore.disableLoading();
    if (JobMasterStore.lastInsertedId) {
      this._jobService.searchItem('?q=' + JobMasterStore.lastInsertedId).subscribe(res => {
        this.form.patchValue({
          jd_id: JobMasterStore.lastInsertedId
        })
        this._utilityService.detectChanges(this._cdr);
      })

    }

  }

  customSearchFn(term:string, item:any){
    term = term.toLowerCase();
    let splitTerm = term.split('').filter(t=>t);
    let isWordThere = [];
    splitTerm.forEach(arr_term=>{
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term)!=-1);
    });
    const all_words = (this_word)=>this_word;
    return isWordThere.every(all_words);
  }


  /**
    * Returns whether file extension is of imgage, pdf, document or etc..
    * @param ext File extension
    * @param extType Type - image,pdf,doc etc..
    */
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(key.startsWith('reporting_user_ids.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['reporting_user_ids'] = this.formErrors['reporting_user_ids']? this.formErrors['reporting_user_ids'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
        }
        if(key.startsWith('supervisor_id.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['supervisor_id'] = this.formErrors['supervisor_id']? this.formErrors['supervisor_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
        }
        if(key.startsWith('jd_id.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['jd_id'] = this.formErrors['jd_id']? this.formErrors['jd_id'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
        }
       
       
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }
  
  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.jobEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();

  }


}
