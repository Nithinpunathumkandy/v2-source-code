import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { ProjectIssueCaService } from 'src/app/core/services/project-monitoring/project-ca/project-issue-ca.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectIssueService } from 'src/app/core/services/project-monitoring/project-issue/project-issue.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { CaStore } from 'src/app/stores/project-monitoring/project-issue-ca-store';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-add-issue-ca',
  templateUrl: './add-issue-ca.component.html',
  styleUrls: ['./add-issue-ca.component.scss']
})
export class AddIssueCaComponent implements OnInit {
  @Input('source') CaSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  form: FormGroup;
  formErrors :any;
  AppStore = AppStore;
  CaStore = CaStore;
  reactionDisposer: IReactionDisposer;
  UsersStore = UsersStore;
  ProjectIssueStore = ProjectIssueStore;
  fileUploadPopupSubscriptionEvent: any = null;
  fileUploadPopupStore = fileUploadPopupStore;
  ProjectMonitoringStore = ProjectMonitoringStore
  selectedId: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  showProjectDetails: boolean = false;


  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _userService: UsersService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _projectIssueCaService: ProjectIssueCaService,
    private _eventEmitterService: EventEmitterService,
    private _projectIssueService: ProjectIssueService,
    private _documentFileService: DocumentFileService,
    public _msTypeService: MstypesService,
    private _renderer2: Renderer2,
    private _projectService : ProjectMonitoringService,
    private _router:Router
    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [""],
      title: ['',[Validators.required]],
      responsible_user_id: [null,[Validators.required]],
      description: [''],
      start_date: ['',[Validators.required]],
      target_date: ['',[Validators.required]],
      project_issue_id: [null,[Validators.required]],
      project_id : null,
      documents:[]
      
    })

    if (this.CaSource.type=='Edit') {
      this.editData();
    }

    if (this._router.url.indexOf('projects-issue-corrective-actions') == -1) {
      CaStore.hideSubMenu=true;
        this.form.patchValue({
          project_id: ProjectMonitoringStore.selectedProjectId ? ProjectMonitoringStore.selectedProjectId : ''
        })
        this.changeProject(ProjectMonitoringStore.selectedProjectId)
        this._utilityService.detectChanges(this._cdr);

    }
    this.getResponsibleUsers()
    this.getProjectIssue()
    this.getProjectList()


    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    if (this.CaSource.page == true) {
      CaStore.hideSubMenu=true;
        this.form.patchValue({
          project_issue_id: ProjectIssueStore.IssueId? ProjectIssueStore.IssueId : ''
        })
        this._utilityService.detectChanges(this._cdr);

    }

  }

  getProjectList(){
    this._projectService.getItems(false,'&is_monitor=1').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchProject(e){
    this._projectService.getItems(false,'&q=' + e.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getArrayFormatedString(type, items, languageSupport?) {
    let item = [];
    if (languageSupport) {
      for (let i of items) {
        for (let j of i.language) {
          item.push(j.pivot);
        }
      }
      items = item;
    }
    return this._helperService.getArraySeperatedString(',', type, items);
  }
  
  editData(){
    this.changeProject(this.CaSource.value.project_issue?.project_id)
    this.searchProject({term:this.CaSource.value.project_issue?.project_id})
    this.form.patchValue({
      id: this.CaSource.value.id ? this.CaSource.value.id : null,
      title: this.CaSource.value.title ? this.CaSource.value.title : null,
      description: this.CaSource.value.description ? this.CaSource.value.description : null,
      responsible_user_id: this.CaSource.value.responsible_user ? this.CaSource.value.responsible_user : null,
      start_date: this.CaSource.value.start_date ? this._helperService.processDate(this.CaSource.value.start_date, 'split') : null,
      target_date: this.CaSource.value.target_date ? this._helperService.processDate(this.CaSource.value.target_date, 'split') : null,
      project_issue_id : this.CaSource.value.project_issue ? this.CaSource.value.project_issue?.id : null,
      project_id : this.CaSource.value.project_issue ? this.CaSource.value.project_issue?.project_id : null
    })
  }

  processSaveData() {
    let saveData = this.form.value;
    saveData['start_date'] = this._helperService.processDate(this.form.value.start_date ? this.form.value.start_date : null, 'join'),
    saveData['target_date'] = this._helperService.processDate(this.form.value.target_date ? this.form.value.target_date : null, 'join'),
    saveData['responsible_user_id']= this.form.value.responsible_user_id ?this.form.value.responsible_user_id?.id : null
    if(this.form.value.id){
      saveData['documents']= {...this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)}
    }else
     saveData['documents']= {...this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')}
    return saveData;
  }


  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  setDepartment(){
    UsersStore.unsetUserList();
  }

  getProjectIssue(){
    this._projectIssueService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchProjectIssue(e){
    this._projectIssueService.getItems(false,'&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  clearProject(){
    this.showProjectDetails = false;
    this.resetForm();
    this.selectedId = null
  }

  changeProject(event){
    this.selectedId = event
    if(event){
      ProjectMonitoringStore.setSelectedProjectId(this.selectedId)
      this._projectService.getItem(event).subscribe(res=>{
         this.showProjectDetails = true;
        this._utilityService.detectChanges(this._cdr);
      })
    }
  
  }

  // getting Responsible user
  getResponsibleUsers() {
      this._userService.getAllItems().subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      });
  }

  // getProjectIssue(){
  //   this._projectIssueService.getItems().subscribe(res=>{
  //   this._utilityService.detectChanges(this._cdr);
  //   })
  // }

  // serach users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term ).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  formatStartDate() {
    // converting start date
    if (this.form.value.start_date) {
      let tempstartdate = this.form.value.start_date;

      this.form.value.start_date = this._helperService.processDate(tempstartdate, 'join');
      return this.form.value.start_date;
    }
  }

  formatTargetDate() {
    if (this.form.value.target_date) {
      let tempTargetdate = this.form.value.target_date;

      this.form.value.target_date = this._helperService.processDate(tempTargetdate, 'join')
      return this.form.value.target_date;
    }
  }

 

  // extension check function
  // checkExtension(ext, extType) {

  //   return this._imageService.checkFileExtensions(ext, extType)

  // }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    CaStore.hideSubMenu=false;
    this.clearFIleUploadPopupData();
    AppStore.disableLoading();
  }

  // save function
  // save(close: boolean = false) {
  //   this.formErrors = null;
  //   // this.form.patchValue({
  //   //   start_date:  this.formatStartDate(),
  //   //   target_date: this.formatTargetDate(),
  //   // })
  //   if (this.form.valid) {
  //   let save;
  //   AppStore.enableLoading();
  //     if(this.CaSource.type == "Edit"){
  //       save = this._projectIssueCaService.updateCa(this.processSaveData(), this.CaSource.value.id);
  //     } else {
  //     save = this._projectIssueCaService.saveCa(this.processSaveData());
  //     }
  //   save.subscribe((res: any) => {
  //     if (!this.form.value.id) {
  //     this.resetForm();
  //     }
  //     AppStore.disableLoading();
  //     setTimeout(() => {
  //       this._utilityService.detectChanges(this._cdr);
  //     }, 500);
  //     if (close) this.cancel();{
  //     }
  //     this._utilityService.detectChanges(this._cdr);
  //   }, (err: HttpErrorResponse) => {
  //     if (err.status == 422) {
  //       this.formErrors = err.error.errors;
  //     }
  //     else if (err.status == 500 || err.status == 403) {
  //       this.cancel();
  //     }
  //       AppStore.disableLoading();
  //       this._utilityService.detectChanges(this._cdr);
  //   });
  // }

  // }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  openFileUploadModal() {
    setTimeout(() => {
      // fileUploadPopupStore.singleFileUpload = true;
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }, 250);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      // fileUploadPopupStore.singleFileUpload = false;
      fileUploadPopupStore.openPopup = false;
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImageUrl(type, token) {
    if(type=='document-version')
    return this._documentFileService.getThumbnailPreview(type, token);
    else
    return this._msTypeService.getThumbnailPreview(type,token);
    
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }


  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearSystemFiles();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._projectIssueCaService.updateCa(this.processSaveData(), this.CaSource.value.id);
      } else {
        save = this._projectIssueCaService.saveCa(this.processSaveData());
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) {
          this.cancel();
          if(CaStore.hideSubMenu=true){
            this._router.navigateByUrl('/project-monitoring/projects-issue-corrective-actions/'+res.id);

          }
        }
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
          this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }

  cancel(){
    this.resetForm();
    this._eventEmitterService.dismissProjectIssueCaModal();
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

  

  removeDocument(doc) {
    if(doc.hasOwnProperty('is_kh_document')){
      if(!doc['is_kh_document']){
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else{
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else{
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    // PolicyStore.unsetFileDetails('brochure', token);
    this.enableScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    CaStore.hideSubMenu=false;
  }
  
}
