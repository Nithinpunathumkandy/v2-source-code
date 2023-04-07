import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef,Renderer2, OnDestroy } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserReportService } from 'src/app/core/services/human-capital/user/user-report/user-report.service';
import { UserReportStore } from 'src/app/stores/human-capital/users/user-report.store';
import { HumanCapitalService } from "src/app/core/services/human-capital/human-capital-service/human-capital.service";
import { ReportService } from 'src/app/core/services/masters/human-capital/report/report.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ReportMasterStore } from 'src/app/stores/masters/human-capital/report-master.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { DomSanitizer } from '@angular/platform-browser';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UserActualReportStore } from 'src/app/stores/human-capital/user-report/user-actual-report.store';
import { Router } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
import { ReportFrequencyService } from 'src/app/core/services/masters/human-capital/report-frequency/report-frequency.service';
import { ReportFrequencyMasterStore } from 'src/app/stores/masters/human-capital/report-frequency-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
declare var $: any;

@Component({
  selector: 'app-user-reports-page',
  templateUrl: './user-reports-page.component.html',
  styleUrls: ['./user-reports-page.component.scss']
})
export class UserReportsPageComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('reportModal') reportModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  reactionDisposer: IReactionDisposer;
  form: FormGroup;
  reportForm: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  UserReportStore = UserReportStore;
  UsersStore = UsersStore;
  ReportMasterStore = ReportMasterStore;
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
  deleteObject = {
    type:'',
    position:null,
    id: null,
    status:'',
    subtitle:''
  };

  userDocumentObject = {
    component: 'Master',
   values: null,
   type: null
  }
  deleteEventSubscription: any;
  userDocumentSubscriptionEvent: any = null;
  // popupUserDocumentEventSubscription: any;

  editFlag=false;
  AuthStore = AuthStore;
  ReportFrequencyMasterStore = ReportFrequencyMasterStore;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
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


  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _userReportService: UserReportService,
    private _humanCapitalService: HumanCapitalService,
    private _reportService: ReportService,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
    private _eventEmitterService: EventEmitterService,
    private _sanitizer: DomSanitizer,
    private _helperService: HelperServiceService,
    private _renderer2:Renderer2,
    private _router: Router,
    private _reportFrequencyService:ReportFrequencyService) { }

  ngOnInit() {
    NoDataItemStore.setNoDataItems({title: "report_nodata_title", subtitle: 'report_nodata_subtitle',buttonText: 'add_new_report'});
    AppStore.disableLoading();
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'CREATE_USER_USER_REPORT', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_USER_USER_REPORT_TEMPLATE', submenuItem: {type: 'template'}},
        // {activityName: 'EXPORT_USER_USER_REPORT', submenuItem: {type: 'export_to_excel'}},
        {activityName: null, submenuItem: {type: 'close',path:'/human-capital/users'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_USER_USER_REPORT')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
    
      this._helperService.checkSubMenuItemPermissions(200,subMenuItems);
     
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewReport();
            }, 1000);
            break;
            case "template":

              var fileDetails = {
                ext: 'xlsx',
                title: 'Report Template.xlsx',
                size: null
              };
              this._humanCapitalService.downloadFile('report-template', null, null, fileDetails.title,null, fileDetails);
              break;
            case "export_to_excel":
  
              var fileDetails = {
                ext: 'xlsx',
                title: 'Reports.xlsx',
                size: null
              };
              this._humanCapitalService.downloadFile('report-export', null, null, fileDetails.title,null, fileDetails);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewReport();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })

    this._userReportService.getAllItem('?status=all&&order_by=report_frequency_id').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
      if(res.length>0){
        this.getReport(res[0]?.report_frequency_id,true);
      }
      
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

    // for closing the modal
    this.userDocumentSubscriptionEvent = this._eventEmitterService.userDocumentControl.subscribe(res => {
      this.closeReportModal();
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

    this.form = this._formBuilder.group({
      id: [''],
      user_report_id: [null,[Validators.required]],
      submitted_to_user_ids: [[],[Validators.required]]
    });

    this.reportForm = this._formBuilder.group({
      report_frequency_id:['', [Validators.required]],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      documents:['']
    });


    SubMenuItemStore.setNoUserTab(true);
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
   
    else if($(this.reportModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.reportModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.reportModal.nativeElement,'overflow','auto');
    }
    else if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
  }

  addNewReport(){
    // this.form.reset();
    // this._utilityService.detectChanges(this._cdr);
    // this.openFormModal();
    this.form.pristine;
    this.formErrors = null;
    this.userDocumentObject.type = 'Add';
    this.userDocumentObject.values = null; // for clearing the value
    this.openFormModal();
    this._utilityService.detectChanges(this._cdr);
  } 

  getPopupDetails(user,row){
    // $('.modal-backdrop').remove();
    if(user&& UserReportStore.currentIndex==row){
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
  

  getReport(id?:number,initial?:boolean) {
    if(initial){
      UserReportStore.currentIndex=0;
    }
    UserReportStore.frequency_id=id;
  }

  openFormModal() {
    $(this.formModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
  }

  closeFormModal() {
    this.editFlag=false;
    this.form.reset();
    AppStore.disableLoading();
    $(this.formModal.nativeElement).modal('hide');
    // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '999999');
  }

  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
    this.form.reset();
    this.form.markAsPristine();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value.submitted_to_user_ids) {
      let submitted_to = [];
      for (let i of this.form.value.submitted_to_user_ids) {
        submitted_to.push(i.id);
      }
      
      this.form.value.submitted_to_user_ids = submitted_to

    }
    let save;

    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._userReportService.updateItem(this.form.value.id, this.form.value);
    } else {
      let saveData = {
        user_report_id: this.form.value.user_report_id ? this.form.value.user_report_id : '',
        submitted_to_user_ids: this.form.value.submitted_to_user_ids ? this.form.value.submitted_to_user_ids : '',

      }
      save = this._userReportService.saveItem(saveData);
      
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      
      setTimeout(() => {
        
        this._utilityService.detectChanges(this._cdr);
        this.form.reset();
        if (close) {
          this.closeFormModal();
          
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



  saveReporting(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value.submitted_to_user_ids) {
      let submitted_to = [];
      for (let i of this.form.value.submitted_to_user_ids) {
        submitted_to.push(i.id);
      }
      
      this.form.value.submitted_to_user_ids = submitted_to

    }
    AppStore.enableLoading();
    let data={
      submitted_to_user_ids:this.form.value.submitted_to_user_ids
    }
    
      this._userReportService.addSubmitted(this.form.value.user_report_id, data).
      subscribe((res: any) => {
      AppStore.disableLoading();
 
        this._utilityService.detectChanges(this._cdr);

        this.form.reset();
        if (close) {
          this.closeFormModal();
          // this.form.reset();
        }


    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
      else if (err.status == 403 || err.status == 500) {
        this.closeFormModal();
        AppStore.disableLoading();
      }
    });

  }

  saveReport(close: boolean = false) {
    this.formErrors = null;
    this.reportForm.patchValue({
      documents: ReportMasterStore.docDetails
    })

    // this.form.value.user_id = UsersStore.user_id;
    AppStore.enableLoading();
 
      let saveData = {
        title:this.reportForm.value.title ? this.reportForm.value.title : '',
        report_frequency_id: this.reportForm.value.report_frequency_id ? this.reportForm.value.report_frequency_id : '',
        description: this.reportForm.value.description ? this.reportForm.value.description : '',
        documents: this.reportForm.value.documents ? this.reportForm.value.documents : ''
      }
    this._reportService.saveItem(saveData)
    .subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      this.form.patchValue({
        user_report_id:res.id
      })
      this.reportForm.reset();
      this.ReportMasterStore.clearDocumentDetails();
      
      if (close) {
        this.closeReportModal();
        
      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
      else if (err.status == 403 || err.status == 500) {
        this.closeReportModal();
        AppStore.disableLoading();
      }
    });

  }

  processFormErrors(){
    var errors = this.formErrors;
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
        if(key.startsWith('submitted_to_user_ids.')){
          let keyValueSplit = key.split('.');
          let errorPosition = parseInt(keyValueSplit[1]);
          this.formErrors['submitted_to_user_ids'] = this.formErrors['submitted_to_user_ids']? this.formErrors['submitted_to_user_ids'] + errors[key] + '('+(errorPosition + 1)+')': errors[key]+ (errorPosition + 1);
        }     
      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  openReportModal(){
    this.formErrors=null;
    AppStore.disableLoading();
    
    $(this.reportModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.reportModal.nativeElement, 'z-index', '9999999');
  }

  closeReportModal() {
   
    $(this.reportModal.nativeElement).modal('hide');
    // this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999999');
    // this.userDocumentObject.type = null;
    if(ReportMasterStore.lastInsertedId){
      this._reportService.searchReport('?q=' + ReportMasterStore.lastInsertedId).subscribe(res => {
         this.form.patchValue({
          user_report_id: ReportMasterStore.lastInsertedId
         })
         this._utilityService.detectChanges(this._cdr);
       })

 }
    
  }
  

  delete(status) {
    let deleteType;
    if (status && this.deleteObject.id && this.deleteObject.type) {
      if (this.deleteObject.type=='Delete') {
       
          deleteType = this._userReportService.delete(this.deleteObject.id);
      }
         
     else{
      deleteType = this._userReportService.updateStatus(this.deleteObject.status,UsersStore.user_id,this.deleteObject.id);
         
     }
          
     deleteType.subscribe(resp => {      
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);
        this.clearDeleteObject();
        if(this.deleteObject.position==0&&this.UserReportStore.individualReportDetails.reports.length>0){
          UserReportStore.currentIndex=0;
         }
        else{
          UserReportStore.currentIndex=UserReportStore.currentIndex-1;
          // this.getReport(UserReportStore.reportDetails[UserReportStore.currentIndex].report_frequency_id);
        }
        this.getReport(UserReportStore.reportDetails[0].report_frequency_id);
        this.activateFrequency( UserReportStore.currentIndex)
      
      },(error=>{
         if(error.status == 405){
           this.deleteObject.type = 'Deactivate';
  
            this.updateStatus(this.deleteObject.type,this.deleteObject.id);
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

  updateStatus(status,id) {
    if (status == 'deactivate') {
      this.deleteObject.id = id;
      this.deleteObject.type = 'Deactivate';
      this.deleteObject.subtitle='are_you_sure_deactivate';
      this.deleteObject.status = status;
      $(this.deletePopup.nativeElement).modal('show');

    }
    else {
      this.deleteObject.id = id;
      this.deleteObject.type = 'Activate';
      this.deleteObject.subtitle='are_you_sure_activate';
      this.deleteObject.status = status;
      $(this.deletePopup.nativeElement).modal('show');
      // this._userReportService.updateStatus(status,UsersStore.user_id,this.deleteObject.id)
      //   .subscribe((res: any) => {
      //       this._utilityService.detectChanges(this._cdr);
          
      //   }, (err: HttpErrorResponse) => {
      //     if (err.status == 422) {
      //       this.formErrors = err.error.errors;
      //     }
      //   });
    }
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.type = '';
    this.deleteObject.subtitle='';
  }

  activateIndex(index,report){
    
    if(UserReportStore.currentIndex!=index){
      UserReportStore.currentIndex=index;
    }
    else{
      UserReportStore.currentIndex=null;
    }
    UserActualReportStore.selectedReport = report;
    
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


  addSubmittedTo(reportIndex){
    this.editFlag=true;
    
   
    this._reportService.searchReport('?q=' + UserReportStore?.individualReportDetails?.reports[reportIndex].id).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
      this.form.patchValue({
        user_report_id:UserReportStore?.individualReportDetails?.reports[reportIndex].id,
        // submitted_to_user_ids:this.reportingUser(UserReportStore?.individualReportDetails[detailIndex]?.reports[reportIndex].submitted_to_users)
  
      })
    })
    this.openFormModal();
  }

  reportingUser(reporting) {
    let reporting_to = [];
    for (let i of reporting) {
      reporting_to.push(i);
    }
    return reporting_to;
  }

  deleteSubmittedTo(report_id,submitted_id){
    this._userReportService.deleteSubmitted(report_id,submitted_id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    }, (error) => {
      // if (err.status == 422) {
       this._utilityService.showErrorMessage('',error.error.message);
        AppStore.disableLoading();
      // }
    });
  }

  activateFrequency(index){
    if(UserReportStore.frequencyIndex!=index){
      UserReportStore.frequencyIndex=index;
    }
    else{
      UserReportStore.frequencyIndex=null;
    }
    
  }




 /**
   * Returns whether file extension is of imgage, pdf, document or etc..
   * @param ext File extension
   * @param extType Type - image,pdf,doc etc..
   */
  checkExtension(ext,extType){
    var res = this._imageService.checkFileExtensions(ext,extType);
    return res;
  }


  deleteReport(id,position) {
    this.deleteObject.id = id;
    this.deleteObject.position = position;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle='are_you_sure_delete';

    $(this.deletePopup.nativeElement).modal('show');
  }

  
  viewDocument(document,reportIndex) {
    this._humanCapitalService.getFilePreview('user-report', UsersStore.user_id, document.id, document.user_report_id).subscribe(res => {
      var resp: any = this._utilityService.getDownLoadLink(res, document.title);
      this.openPreviewModal(resp, document,reportIndex);
    }), (error => {
      if (error.status == 403) {
        this._utilityService.showErrorMessage('Error', 'Permission Denied');
      }
      else {
        this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
      }
    });
  }

  downloadDocument(user_report_id, filename, doc_id,doc) {
    this._humanCapitalService.downloadFile('user-report-documents', UsersStore.user_id, user_report_id, filename, doc_id,doc);
  }


 

  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails,reportIndex) {
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-report-documents';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.uploaded_user = UserReportStore?.individualReportDetails.reports[reportIndex].created_by;
    this.previewObject.uploaded_user['image_token'] = UserReportStore?.individualReportDetails.reports[reportIndex].created_by?.image.token
    this.previewObject.created_at = itemDetails.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }


  createImageUrl(type, token) {

    return this._humanCapitalService.getThumbnailPreview(type, token);
  }

  getReports() {
    this._reportService.getReports().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchReport(e) {
    this._reportService.searchReport('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  navigateToReport(){
    UserActualReportStore.user_id = UsersStore.user_id;
    this._router.navigateByUrl('/human-capital/user-reports');
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }
  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.userDocumentSubscriptionEvent.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();


  }


}
