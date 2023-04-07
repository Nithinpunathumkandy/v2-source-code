import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { UserReportService } from 'src/app/core/services/human-capital/user/user-report/user-report.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UserReportStore } from 'src/app/stores/human-capital/users/user-report.store';
import { ReportMasterStore } from 'src/app/stores/masters/human-capital/report-master.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UserActualReportService } from 'src/app/core/services/human-capital/user-report/user-actual-report.service';
import { UserActualReportStore } from 'src/app/stores/human-capital/user-report/user-actual-report.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Report } from 'src/app/core/models/human-capital/user-report/user-actual-report';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from "src/app/stores/settings/organization-general-settings.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;
@Component({
  selector: 'app-user-report',
  templateUrl: './user-report.component.html',
  styleUrls: ['./user-report.component.scss']
})
export class UserReportComponent implements OnInit,OnDestroy {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  // @ViewChild('descriptionModal') descriptionModal: ElementRef;
  @ViewChild('detailsModal') detailsModal: ElementRef;
  @ViewChild('uploadArea') uploadArea: ElementRef;
  @ViewChild('browseArea') browseArea: ElementRef;
  @ViewChild('filePreviewModal') filePreviewModal: ElementRef;
  UsersStore = UsersStore;
  ReportMasterStore = ReportMasterStore;
  AuthStore = AuthStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  emptyList = "no_records_found"
  emptyMessage = "no_records_found";
  frequencyArray = [];
  dayArray = [];
  dayActive = null;
  weekActive = null;
  weekArray = [1, 2, 3, 4, 5];
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
  monthArray = [{
    title: 'Jan',
    quarter: 1
  },
  {
    title: 'Feb',
    quarter: 1
  },
  {
    title: 'Mar',
    quarter: 1
  },
  {
    title: 'Apr',
    quarter: 2
  },
  {
    title: 'May',
    quarter: 2
  },
  {
    title: 'Jun',
    quarter: 2
  },
  {
    title: 'Jul',
    quarter: 3
  },
  {
    title: 'Aug',
    quarter: 3
  },
  {
    title: 'Sep',
    quarter: 3
  },
  {
    title: 'Oct',
    quarter: 4
  },
  {
    title: 'Nov',
    quarter: 4
  },
  {
    title: 'Dec',
    quarter: 4
  }
  ]

  QuarterArray = ['Q1', 'Q2', 'Q3', 'Q4 '];
  frequencyType = null;
  frequencyIndex = null;
  selectedFrequency = { year: null, quarter: null, month: null, week: null, day: null };
  selectedReport = null;
  selectedUser = null;
  days = null;
  reportFrequency = [];
  UserReportStore = UserReportStore;
  UserActualReportStore = UserActualReportStore;
  reactionDisposer: IReactionDisposer;
  formErrors: any;
  reportingIndex = 0;
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  AppStore = AppStore;
  deleteEventSubscription: any;
  deleteObject = {
    type: '',
    id: null,
    subtitle: ''
  };
  current_index = 0;
  reportLoader = true;

  form: FormGroup;
    idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  constructor(private _userReportService: UserReportService,
    private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _usersService: UsersService,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _userActualReportService: UserActualReportService,
    private _eventEmitterService: EventEmitterService,
    private _sanitizer: DomSanitizer,
    private _renderer2:Renderer2) { }

  ngOnInit(): void {
    if (UserActualReportStore.user_id) {
      this.selectedUser = UserActualReportStore.user_id;
      this.searchUers({term : this.selectedUser});
      this.setSelectedUser(UserActualReportStore.user_id);

    }
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.formErrors = null;
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal('');
            }, 1000);
            break;
          case "template":
            var fileDetails = {
              ext: 'xlsx',
              title: 'UserActualReport Template.xlsx',
              user_id: this.selectedUser,
              size: null
            };
            this._humanCapitalService.downloadFile('actual-report-template', null, null, fileDetails.title, null, fileDetails);
            break;
          case "export_to_excel":

            var fileDetails = {
              ext: 'xlsx',
              title: 'UserActualReport.xlsx',
              user_id: this.selectedUser,
              size: null
            };
            this._humanCapitalService.downloadFile('actual-report-export', null, null, fileDetails.title, null, fileDetails);
            break;
          // case "refresh":
          //   SubMenuItemStore.searchText = '';
          //   UserActualReportStore.loaded = false;
          //   this.pageChange(1);
          //   break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      NoDataItemStore.setNoDataItems({title: "empty_user_selection"});
    })


    SubMenuItemStore.setNoUserTab(true);
    this.checkForFileUploadsScrollbar();

    if (UserActualReportStore.user_id) {
      this._userReportService.getAllItem().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        // setTimeout(() => {
        if (UserActualReportStore.selectedReport) {
          this.setSelectedReport(UserActualReportStore.selectedReport);
          // this.checkForFileUploadsScrollbar();
        }
        else {
          this.setSelectedReport(UserReportStore?.individualReportDetails?.reports[0]);
          // this.checkForFileUploadsScrollbar();
        }
        // }, 300);
        this.reportLoader = false; 
      })

    }
    else{
      setTimeout(() => {
        this.reportLoader = false; 
        this._utilityService.detectChanges(this._cdr);
      }, 250);
    }

    this.getFrequency();

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteReport(item);
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
      user_user_report_id: ['', [Validators.required, Validators.max(255)]],
      year: ['', [Validators.max(255)]],
      quarter: ['', [Validators.max(255)]],
      month: ['', [Validators.max(255)]],
      week: ['', [Validators.max(255)]],
      day: ['', [Validators.max(255)]],

      documents: ['']
    });
    
    

    // this.checkForFileUploadsScrollbar();

  }

  openFormModal(values?, frequency?) {
    if (values) {
      if (frequency == 'week') {
        this.selectedFrequency.week = values;
      }
      else if (frequency == 'day') {
        this.selectedFrequency.day = values;
      }
      else if (frequency == 'month') {
        this.selectedFrequency.month = values;
      }
      else if (frequency == 'quarter') {
        this.selectedFrequency.quarter = values;
      }
      else if (frequency == 'year') {
        this.selectedFrequency.year = values;
      }
      // console.log(this.selectedFrequency);

      this.form.patchValue({
        user_user_report_id: this.selectedReport.id,
        year: this.selectedFrequency.year,
        quarter: Math.ceil(this.selectedFrequency.quarter),
        month: this.selectedFrequency.month,
        week: this.selectedFrequency.week,
        day: this.selectedFrequency.day
      })
    }
    else {

      this.form.patchValue({
        user_user_report_id: this.selectedReport.id,
        year: this._helperService.getTodaysDateObject().year,
        quarter: this._helperService.getTodaysDateObject().quarter,
        month: this._helperService.getTodaysDateObject().month,
        week: this._helperService.getTodaysDateObject().week,
        day: this._helperService.getTodaysDateObject().day
      })


    }



    $(this.formModal.nativeElement).modal('show');

  }

  closeFormModal() {

    UserActualReportStore.clearDocumentDetails();
    this.fileUploadsArray = [];
    this.form.reset();
    this.form.markAsPristine();
    $(this.formModal.nativeElement).modal('hide');
    SubMenuItemStore.setSubMenuItems([
      { type: 'new_modal' },
      // { type: 'template' },
      { type: 'export_to_excel' },
      { type: 'close', path: '/human-capital/users' },
    ]);
  }
  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.detailsModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.detailsModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.detailsModal.nativeElement,'overflow','auto');
    }
    else if($(this.filePreviewModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.filePreviewModal.nativeElement,'overflow','auto');
    }
  }

  getPopupDetails(user){
    // $('.modal-backdrop').remove();
  
      this.userDetailObject.first_name = user.first_name;
      this.userDetailObject.last_name = user.last_name;
      this.userDetailObject.designation = user.designation ? user.designation : user.designation_title;
      this.userDetailObject.image_token = user.image?.token ? user.image?.token : user.image_token;
      this.userDetailObject.email = user.email;
      this.userDetailObject.mobile = user.mobile;
      this.userDetailObject.id = user.id;
      this.userDetailObject.department = user.department ? user.department : null;
      this.userDetailObject.status_id = user.status?.id ? user.status?.id : 1;
      return this.userDetailObject;
    
  }

  getUsers() {

    this._usersService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }


  searchUers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        
      // }, 100);
      
    });
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


  getFrequency() {
    this.selectedFrequency.year = this._helperService.getTodaysDateObject().year;
    this.selectedFrequency.quarter = this._helperService.getTodaysDateObject().quarter;
    this.selectedFrequency.month = this._helperService.getTodaysDateObject().month;
    this.selectedFrequency.week = this._helperService.getTodaysDateObject().week;
    this.selectedFrequency.day = this._helperService.getTodaysDateObject().day;

    for (let i = this.selectedFrequency.year - 4; i <= this.selectedFrequency.year; i++) {
      this.frequencyArray.push(i);
    }

    for (let i = 1; i < 32; i++) {
      this.dayArray.push(i);
    }


  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }


  createImagePreview(type, token) {
    return this._humanCapitalService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  getReports() {

    this._userReportService.getAllItem(null, null, this.selectedUser).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchReport(e) {
    this._userReportService.searchReport('?q=' + e.term, this.selectedUser).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  addIndex(index) {
    this.reportingIndex += index;
  }

  setFrequency(i, frequency,status?) {
    let tempFrequency = null;
    let tempFrequencyIndex = null;
    UserActualReportStore.unsetReportDetails();
    // console.log(UserActualReportStore.loaded);
    if (!UserActualReportStore.loaded) {
      let reportSelected = null;
      if(this.frequencyType!='year'){
        tempFrequency = this.frequencyType;
        tempFrequencyIndex = this.frequencyIndex;
        
      }
      this.frequencyType = frequency;
      this.frequencyIndex = i;
      switch (frequency) {
        case 'year':
          this.selectedFrequency.year = i;
          this.reportLoader = true; 
          if(this.selectedReport.user_report.report_frequency_id==1)
          reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport.id + '&user_ids=' + this.selectedUser + '&years=' + i);
          else {
            this.setFrequency(tempFrequencyIndex,tempFrequency)
          }
          setTimeout(() => {
            this.reportLoader = false; 
          }, 200);
          break;
        case 'quarter':
          this.selectedFrequency.quarter = i;
          reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport.id + '&user_ids=' + this.selectedUser + '&years=' + this.selectedFrequency.year + '&quarters=' + i);
          break;
        case 'month':
          if (this.selectedFrequency.month != this._helperService.getTodaysDateObject().month && this.selectedFrequency.month != i) {
            this.selectedFrequency.week = 1;
            this.selectedFrequency.day = 1;
          }
          else if (this.selectedFrequency.month != i && this.selectedFrequency.month == this._helperService.getTodaysDateObject().month) {
            this.selectedFrequency.week = this._helperService.getTodaysDateObject().week;
            this.selectedFrequency.day = this._helperService.getTodaysDateObject().day;
          }
          this.selectedFrequency.month = i;
          this.selectedFrequency.quarter = (this.selectedFrequency.month) / 3;

          if (this.selectedReport.user_report.report_frequency_id == 4) {
            reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport?.id + '&user_ids=' + this.selectedUser + '&years=' + this.selectedFrequency.year + '&months=' + this.selectedFrequency.month + '&weeks=' + this.selectedFrequency.week);

          }
          else if (this.selectedReport.user_report.report_frequency_id == 5) {
            reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport?.id + '&user_ids=' + this.selectedUser + '&years=' + this.selectedFrequency.year + '&months=' + this.selectedFrequency.month + '&days=' + this.selectedFrequency.day);

          }
          else {
            reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport?.id + '&user_ids=' + this.selectedUser + '&years=' + this.selectedFrequency.year + '&months=' + i);
          }

          break;
        case 'week':
          if(this.selectedFrequency.week == i && status){
            this.selectedFrequency.week = null;
          }
          else{
            
            reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport?.id + '&user_ids=' + this.selectedUser + '&years=' + this.selectedFrequency.year + '&months=' + this.selectedFrequency.month + '&weeks=' + i);
          this.selectedFrequency.week = i;
          this.selectedFrequency.quarter = (this.selectedFrequency.month) / 3;
          }

          


          break;
        case 'day':
          if(this.selectedFrequency.day == i && status){
            this.selectedFrequency.day = null;
            // this.dayActive = 0;
          }
          else{
          reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport?.id + '&user_ids=' + this.selectedUser + '&years=' + this.selectedFrequency.year + '&months=' + this.selectedFrequency.month + '&days=' + i);
          this.selectedFrequency.day = i;
          this.selectedFrequency.quarter = (this.selectedFrequency.month) / 3;
          }
          
          break;

        case 'all':
          reportSelected = this._userActualReportService.getDocuments('?report_ids=' + this.selectedReport?.id + '&user_ids=' + this.selectedUser + '&years=' + this.selectedFrequency.year + '&quarters=' + this.selectedFrequency.quarter + '&months=' + this.selectedFrequency.month + '&weeks=' + this.selectedFrequency.week + '&days=' + i);

          break;

        default: break;
      }
      reportSelected?.subscribe(response => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);

      })
    }


  }

  setSelectedUser(item) {
    // this.selectedUser = item;
    NoDataItemStore.setNoDataItems({title: "Please select Report from the list!"});
    this.selectedReport = null;
    UserReportStore.unsetReportDetails;
    if (SubMenuItemStore?.subMenuItems?.length > 0) {
      SubMenuItemStore.removeSubMenu('new_modal');
      // SubMenuItemStore.removeSubMenu('template');
      SubMenuItemStore.removeSubMenu('export_to_excel');
      SubMenuItemStore.removeSubMenu('close');
    }

    setTimeout(() => {
      this._userReportService.getAllItem(null, null, this.selectedUser).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
        if (UserActualReportStore.selectedReport) {
          this.setSelectedReport(UserActualReportStore.selectedReport);
          // this.checkForFileUploadsScrollbar();
        }
        else {
          if(UserReportStore?.individualReportDetails?.reports?.length>0 && UserReportStore?.individualReportDetails?.reports[0]?.user.id == this.selectedUser)
            this.setSelectedReport(UserReportStore?.individualReportDetails?.reports[0]);
          else{
            if(res.length>0)
            // this.setSelectedReport(res[0]?.reports[0]);
            this._userReportService.getItem(res[0]?.reports[0]?.id, this.selectedUser).subscribe(response => {
              // console.log(res);
              this.setSelectedReport(response, true);
              setTimeout(() => {
                this._utilityService.detectChanges(this._cdr);
              }, 200);
      
            })
          }
          // this.checkForFileUploadsScrollbar();
        }
      });
    }, 100);
  }

  setSelectedReport(item, savedReport?) {
    // console.log(item);
    UserActualReportStore.unsetReportDetails;
    if (!savedReport) {
      this.selectedReport = item;
    }

    setTimeout(() => {
      this.checkForFileUploadsScrollbar();
    }, 300);

    if (this.selectedReport != null) {
      SubMenuItemStore.setSubMenuItems([
        { type: 'new_modal' },
        // { type: 'template' },
        // { type: 'export_to_excel' },
        { type: 'close', path: '../' },
      ]);
    }

    let frequency = item?.user_report.report_frequency_id;
    switch (frequency) {
      case 1: this.setFrequency(this.selectedFrequency.year, 'year');
        break;
      case 2: this.setFrequency(this.selectedFrequency.quarter, 'quarter');
        break;
      case 3: this.setFrequency(this.selectedFrequency.month, 'month');
        break;
      case 4: this.setFrequency(this.selectedFrequency.week, 'week');
        break;
      case 5: this.setFrequency(this.selectedFrequency.day, 'day');
        break;
      default: break;
    }

  }

  viewDocument(document) {
    // console.log(document);
    this._humanCapitalService.getFilePreview('user-report', UsersStore.user_id, document.id, document.user_report_id).subscribe(res => {
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

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }



  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, itemDetails) {
    // console.log(itemDetails);
    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'user-report-documents';
    this.previewObject.file_details = itemDetails;
    this.previewObject.file_name = itemDetails.title;
    this.previewObject.file_type = itemDetails.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = itemDetails.size;
    this.previewObject.created_at = itemDetails.created_at;
    
    this._usersService.getAllItems('?q='+itemDetails.created_by).subscribe(res=>{
      
      const index = res['data'].findIndex(e => e.id == itemDetails.created_by);
      // console.log(UsersStore.usersList[index])
      if (index != -1) {
        this.previewObject.uploaded_user = res['data'][index];
        this.previewObject.uploaded_user.designation = res['data'][index].designation_title;
        setTimeout(() => {
          if(this.previewObject.uploaded_user)
          $(this.filePreviewModal.nativeElement).modal('show');
        }, 300);
      }
     
      this._utilityService.detectChanges(this._cdr);
     
    })
   
    this._utilityService.detectChanges(this._cdr);

  }




  closeReportPreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal('hide');
    this.previewObject.file_name = null;
    this.previewObject.file_type = '';
    this.previewObject.preview_url = '';
  }

  changeReport(id) {
    // console.log(id);
    for (let i of UserReportStore?.reportDetails) {
      for (let j of i.reports) {
        if (j.id == id) {
          this.setSelectedReport(j);
          break;
        }
      }
    }
    // this._userReportService.getItem(id,this.selectedUser).subscribe(res=>{
    //   this._utilityService.detectChanges(this._cdr);
    //   this.setSelectedReport(res);
    //   console.log(res);
    // })
  }

  onFileChange(event, type: string) {


    var selectedFiles: any[] = event.target.files;


    if (selectedFiles.length > 0) {

      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
      this.checkForFileUploadScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {


        const file = elem;
        if (this._imageService.validateFile(file, type)) {

          const formData = new FormData();
          formData.append('file', file);
          ReportMasterStore.document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';

          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }

                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:

                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                  ReportMasterStore.document_preview_available = false;
                  this.createImageFromBlob(prew, temp, type);
                }, (error) => {
                  ReportMasterStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            ReportMasterStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else{
          this.assignFileUploadProgress(null,file,true);
        }
      });
    }


  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._userActualReportService.setDocumentDetails(imageDetails, logo_url);
      this.checkForFileUploadScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
 * 
 * @param progress File Upload Progress
 * @param file Selected File
 * @param success Boolean value whether file upload success 
 */
  assignFileUploadProgress(progress, file, success = false) {

    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  /**
   * removing document file from the selected list
   * @param token -image token
   */
  removeDocument(token) {
    UserActualReportStore.unsetDocumentDetails(token);
    this.checkForFileUploadScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  checkDocumentEmpty(){
    let count = 0
    for(let doc of UserActualReportStore.docDetails){
      if(doc.is_deleted){
        count++;
      }
    }
    if(UserActualReportStore.docDetails?.length==count){
      return true
    }
    else
    return false;
    // let pos = UserActualReportStore.docDetails.findIndex(e=>e.is_deleted==true);
  }


  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      documents: UserActualReportStore.docDetails
    })


    let save;

    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._userActualReportService.updateItem(this.selectedUser, this.form.value.id, this.form.value);
    } else {
      let saveData = {
        user_user_report_id: this.form.value.user_user_report_id ? this.form.value.user_user_report_id : '',
        year: this.form.value.year ? this.form.value.year : '',
        quarter: this.form.value.quarter ? this.form.value.quarter : '',
        month: this.form.value.month ? this.form.value.month : '',
        week: this.form.value.week ? this.form.value.week : '',
        day: this.form.value.day ? this.form.value.day : '',
        documents: this.form.value.documents ? this.form.value.documents : ''
      }
      save = this._userActualReportService.saveItem(this.selectedUser, saveData);
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      this.selectedFrequency.year = this.form.value.year;
      this.selectedFrequency.quarter = this.form.value.quarter;
      this.selectedFrequency.month = this.form.value.month;
      this.selectedFrequency.week = this.form.value.week;
      this.selectedFrequency.day = this.form.value.day;
      this._userReportService.getItem(this.form.value.user_user_report_id, this.selectedUser).subscribe(res => {
        // console.log(res);
        this.setSelectedReport(res, true);
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 200);

      })

      this.form.reset();
      UserActualReportStore.clearDocumentDetails();

      if (close) {
        this.closeFormModal();

      }
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        AppStore.disableLoading();
      }
      else if(err.status == 500 || err.status==403){
        this.closeFormModal();
        AppStore.disableLoading();
      }
    });

  }


  // Check any upload process is going on
  checkFileIsUploading() {
    return this._helperService.checkFileisUploaded(this.fileUploadsArray);
  }


  editReport(document, edit?) {
    this.form.reset();
    this.form.markAsPristine();
    this.UserActualReportStore.clearDocumentDetails();
    this._userActualReportService.getItem(document.id).subscribe(res => {

      setTimeout(() => {

        if (UserActualReportStore.individual_report_loaded) {

          const userReport: Report = UserActualReportStore.individualReportDetails;
          // console.log(UserActualReportStore.individualReportDetails);

          //set form value
          if (userReport.user_actual_report.documents && userReport.user_actual_report.documents.length > 0) {
            for (let i of userReport.user_actual_report.documents) {
              let docurl = this._humanCapitalService.getThumbnailPreview('actual-report-document', i.token);
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
                user_report_id: i.user_actual_report_id

              };
              this._userActualReportService.setDocumentDetails(docDetails, docurl);
            }
            this.checkForFileUploadScrollbar();

          }
          this.form.patchValue({

            id: userReport.user_actual_report.id,
            user_user_report_id: userReport.user_actual_report.user_user_report.id,
            year: userReport.user_actual_report.year,
            quarter: userReport.user_actual_report.quarter,
            month: userReport.user_actual_report.month,
            week: userReport.user_actual_report.week,
            day: userReport.user_actual_report.day,
            documents: ''

          });
          if (edit == 'edit') {
            this.openFormModal(edit);
          }


          else if (AuthStore.getActivityPermission(200, 'USER_ACTUAL_REPORT_DETAILS')) {
            //getting values for document preview
            UserActualReportStore.individualReportDetails.user_actual_report.documents.forEach(i => {
              i['preview_src'] = [];
              this._humanCapitalService.getFilePreview('user-actual-report', this.selectedUser, i.id, i.user_actual_report_id).subscribe(res => {
                let filePreview = this._utilityService.getDownLoadLink(res, userReport.title);
                i['preview_src'] = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
                this._utilityService.detectChanges(this._cdr);
              }), (error => {
                if (error.status == 403) {
                  this._utilityService.showErrorMessage('Error', 'Permission Denied');
                }
                else {
                  this._utilityService.showErrorMessage('Error', 'Unable to generate Preview');
                }
              });
            });

            setTimeout(() => {
              $(this.detailsModal.nativeElement).modal('show');
            }, 300);
          }
        }
      }, 300);

      this._utilityService.detectChanges(this._cdr);
    });
  }

  documentArray(){
    /*for(let i of UserDocumentStore.individualDocumentDetails.files){
      if(this.current_index<4){
        this.docArray.push(i);
      }
      if(this.current_index>3 && UserDocumentStore.individualDocumentDetails.files.length>this.current_index+2){
        

      }
    }*/
    var dArray=[];
    
    if(UserActualReportStore.individualReportDetails.user_actual_report.documents.length < 3){
      
      for(let i=0;i<UserActualReportStore.individualReportDetails.user_actual_report.documents.length;i++){
        dArray.push(i);

      }
      return dArray;
    }

    else if(UserActualReportStore.individualReportDetails.user_actual_report.documents.length == 3 || (this.current_index+1==1&&UserActualReportStore.individualReportDetails.user_actual_report.documents.length > 3)){
      return [0,1,2];
    }
    else{
      if(this.current_index==0 ){
        return [0,1,2]
      }
      if((this.current_index+1 < UserActualReportStore.individualReportDetails.user_actual_report.documents.length) &&!(this.current_index+1 > UserActualReportStore.individualReportDetails.user_actual_report.documents.length)){
        return [this.current_index-1, this.current_index, this.current_index+1]
      }
      else if(this.current_index+1 == UserActualReportStore.individualReportDetails.user_actual_report.documents.length){
        return [this.current_index-2, this.current_index-1, this.current_index]
      }
      
    }
  }

  
  setCurrentIndex(ind){
    this.current_index = ind;
  }

  closePreviewModal() {
    UserActualReportStore.clearDocumentDetails();
    this.fileUploadsArray = [];
    this.form.reset();
    this.form.markAsPristine();

    $(this.detailsModal.nativeElement).modal('hide');
  }


  /**
  * delete user
  */
  delete(id: number) {

    this.deleteObject.id = id;
    this.deleteObject.type = 'Delete';
    this.deleteObject.subtitle = 'are_you_sure_delete';

    $(this.deletePopup.nativeElement).modal('show');

  }

  deleteReport(status) {
    if (status && this.deleteObject.id) {

      this._userActualReportService.delete(this.selectedUser, this.deleteObject.id).subscribe(resp => {

        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this.setSelectedReport(this.selectedReport);

        }, 200);
        this.clearDeleteObject();
      });
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
    this.deleteObject.type = '';
    this.deleteObject.subtitle = '';

  }

  downloadAllDocument(document) {
    this._humanCapitalService.downloadFile('user-actual-report-document', this.selectedUser, document.user_actual_report_id);

  }

  downloadDocument(document) {
    this._humanCapitalService.downloadFile('user-actual-report-document', this.selectedUser, document.user_actual_report_id, document.title, document.id, document);

  }

  downloadReport(document) {
    this._humanCapitalService.downloadFile('user-report-documents', this.selectedUser, document.user_report_id, document.title, document.id, document);

  }

  viewMore(type) {
    if (type == 'more')
      UserActualReportStore.view_more = true;
    else
      UserActualReportStore.view_more = false;
    this._utilityService.detectChanges(this._cdr);
  }

  // closeViewMore() {
  //   $(this.descriptionModal.nativeElement).modal('hide');
  // }

  checkForFileUploadsScrollbar() {
    setTimeout(() => {
      if (this.selectedReport?.user_report.documents && this.selectedReport?.user_report.documents.length > 3) {
        // console.log(this.selectedReport);
        $(this.uploadArea?.nativeElement).mCustomScrollbar();

      }
      else {
        if(this.selectedReport?.user_report.documents && this.selectedReport?.user_report.documents.length > 0) $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 500);
  }

  checkForFileUploadScrollbar() {
    if (UserActualReportStore.docDetails && UserActualReportStore.docDetails.length > 3) {
      setTimeout(() => {
        $(this.browseArea.nativeElement).mCustomScrollbar();
      }, 300);

    }
    else {
      if (UserActualReportStore.docDetails && UserActualReportStore.docDetails.length > 0) $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }


  /**
    * finding image index
    * @param inc - to increment or decrement index
    */
  addImageIndex(inc) {
    this.current_index += inc;

  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  getNoDataSource(type){
    let noDataSource = {
      noData: this.emptyMessage, border: false, imageAlign: type
    }
    return noDataSource;
  }
  
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteEventSubscription.unsubscribe();
    this.selectedUser = null;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }
}
