import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { title } from 'process';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MsAuditCategoryService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-category/ms-audit-category.service';
import { MsAuditTeamService } from 'src/app/core/services/ms-audit-management/ms-audit-team/ms-audit-team.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MsAuditCategoryMasterStore } from 'src/app/stores/masters/ms-audit-management/ms-audit-category-store';
import { MsAuditTeamStore } from 'src/app/stores/ms-audit-management/ms-audit-team/ms-audit-team-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.scss']
})
export class AddTeamComponent implements OnInit {

  @Input('source') MsAuditTeamSource: any;
  @ViewChild('auditCategoryModal', { static: false }) auditCategoryModal: ElementRef;

  MsAuditTeamStore = MsAuditTeamStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MsAuditCategoryMasterStore=MsAuditCategoryMasterStore;
  AppStore = AppStore;
  UsersStore = UsersStore;
  form: FormGroup;
  formErrors: any;
  fileUploadsArray: any = [];
  fileUploadProgress = 0;
  msAuditCategorySubscriptionEvent:any;
  msAuditCategoryObject = {
    component: 'Master',
    values: null,
    type: null
  };

  constructor(
    private _msAuditTeamService: MsAuditTeamService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _userService: UsersService,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _router: Router,
    private _msAuditCategoryService: MsAuditCategoryService
  ) { }

  ngOnInit(): void {
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      //title: ['', [Validators.required, Validators.maxLength(255)]],
      user_ids: ['',[Validators.required]],
      team_lead_id: ['',[Validators.required]],
      ms_audit_category_id:['',[Validators.required]],
      is_audit_team: [''],
      image: ''


    });

    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    this.getUsers();
    if (this.MsAuditTeamSource.type == 'Edit') {
      this.setFormValues();
    }
    this.msAuditCategorySubscriptionEvent = this._eventEmitterService.msAuditCategory.subscribe(res=>{
      this.closeAuditCategoryModal();
    })

  }
  // ngDoCheck() {
  //   if (this.MsAuditTeamSource && this.MsAuditTeamSource.hasOwnProperty('values') && this.MsAuditTeamSource.values && !this.form.value.id)
  //     this.setFormValues();
  // }

  addNewAuditCategory()
{
  this.msAuditCategoryObject.type = 'Add';
  this.msAuditCategoryObject.values = null; // for clearing the value
  this._utilityService.detectChanges(this._cdr);
  this.openFormAuditCategoryModal();
}
openFormAuditCategoryModal()
{
  setTimeout(() => {
  $(this.auditCategoryModal.nativeElement).modal('show');
  this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'display', 'block');
  this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'z-index', 99999);
  this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'overflow', 'auto');
  this._utilityService.detectChanges(this._cdr);
  }, 50);
  
}

closeAuditCategoryModal(){
  // $(this.auditCategoryModal.nativeElement).modal('hide');
  // this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
  // this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
  // $('.modal-backdrop').remove();
  setTimeout(() => {
    $(this.auditCategoryModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.auditCategoryModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
  }, 50);
 
  this.msAuditCategoryObject.type = null;
  if(MsAuditCategoryMasterStore.lastInsertedId)
  {
    this.searchAuditCategory({term : MsAuditCategoryMasterStore.lastInsertedId},true)
  }
  

}

  setFormValues() {
    if (MsAuditTeamStore.msAuditTeamDetails) {
      this.searchAuditCategory({term :MsAuditTeamStore.msAuditTeamDetails.ms_audit_category?.id ? MsAuditTeamStore.msAuditTeamDetails.ms_audit_category?.id : ''})
      this.form.patchValue({
        id: MsAuditTeamStore.msAuditTeamDetails.id,
        ms_audit_category_id:MsAuditTeamStore.msAuditTeamDetails.ms_audit_category?MsAuditTeamStore.msAuditTeamDetails.ms_audit_category.id:null,
        team_lead_id: MsAuditTeamStore.msAuditTeamDetails.team_lead,
        // is_audit_team: is_audit_team,
        title:  MsAuditTeamStore.msAuditTeamDetails.title,
        image: '',
        user_ids: MsAuditTeamStore.msAuditTeamDetails.team_members ? this.getEditValue(MsAuditTeamStore.msAuditTeamDetails.team_members) : [],
      })
    }
  }

  searchAuditcategory(event?) {
    let params=''
    if(event)
    {
      params='&q=' + event.term
    }
    this._msAuditCategoryService.getItems(false,params,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchAuditCategory(e,patchValue:boolean = false) {
    this._msAuditCategoryService.getItems(false,'&q=' + e.term).subscribe(res => {
      if(patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.form.patchValue({ ms_audit_category_id: i.id });
            break;
          }
        }
      }
      let pos = MsAuditCategoryMasterStore.msAuditCategorys.findIndex(e=>e.title == 'General')
        this.form.patchValue({
          ms_audit_category_id : MsAuditCategoryMasterStore.msAuditCategorys[pos].id
        })
      
      this._utilityService.detectChanges(this._cdr);
    })
  }


  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {
      returnValues.push(i);
    }
    return returnValues;
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    // MsAuditTeamStore.clearFileDetails();
    AppStore.disableLoading();
  }

  // cancel modal
  cancel() {
    this.closeFormModal();
  }

  // serach users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // getting users
  getUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
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

  onFileChange(event, type: string) {
    //this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      // this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          MsAuditTeamStore.document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.fileUploadProgress = upProgress;
                  this.assignFileUploadProgress(upProgress, file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                $("#file").val('');
                //return event;
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                  MsAuditTeamStore.document_preview_available = false;
                  this.createImageFromBlob(prew, temp, type);
                }, (error) => {
                  $("#file").val('');
                  MsAuditTeamStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            $("#file").val('');
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            MsAuditTeamStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  assignFileUploadProgress(progress, file, success = false) {

    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._msAuditTeamService.setFileDetails(imageDetails, logo_url, type);
      else
        this._msAuditTeamService.setSelectedImageDetails(logo_url, type);
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  closeFormModal() {
    this.resetForm();
    MsAuditTeamStore.clearFileDetails();
    this._eventEmitterService.dismissmsAuditTeamModal();
  }

  processDataFordSave(){
    let saveData = { 
      id : this.form.value.id ? this.form.value.id : null, 
      //title: this.form.value.title ? this.form.value.title :  '',
      user_ids: this.form.value.user_ids ? this._helperService.getArrayProcessed(this.form.value.user_ids,'id') :  '',
      team_lead_id: this.form.value.team_lead_id ? this.form.value.team_lead_id.id :  '' ,
      is_audit_team: true,
      ms_audit_category_id : this.form.value.ms_audit_category_id ? this.form.value.ms_audit_category_id : '',
      image: MsAuditTeamStore.getImageDetails
    }
    return saveData
  }

  save(close: boolean = false) {
    this.formErrors = null;
    this.form.patchValue({
      image: MsAuditTeamStore.getImageDetails,
      is_audit_team: true,
    })
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._msAuditTeamService.updateItem(this.form.value.id,this.processDataFordSave());
      } else {
        delete this.form.value.id
        save = this._msAuditTeamService.saveItem(this.processDataFordSave());
      }

      save.subscribe((res: any) => {
        this.MsAuditTeamStore.lastInsertedId = res.id
        if (!this.form.value.id) {
          this.resetForm();
          MsAuditTeamStore.clearFileDetails();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeFormModal();
        this._router.navigateByUrl('ms-audit-management/ms-teams/'+ this.MsAuditTeamStore.lastInsertedId);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
