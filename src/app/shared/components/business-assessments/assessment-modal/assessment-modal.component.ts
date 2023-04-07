import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AssessmentsService } from 'src/app/core/services/business-assessments/assessments.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { DivisionService } from 'src/app/core/services/masters/organization/division/division.service';
import { SectionService } from 'src/app/core/services/masters/organization/section/section.service';
import { SubSectionService } from 'src/app/core/services/masters/organization/sub-section/sub-section.service';
import { SubsidiaryService } from 'src/app/core/services/organization/business_profile/subsidiary/subsidiary.service';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { DivisionMasterStore } from 'src/app/stores/masters/organization/division-store';
import { SectionMasterStore } from 'src/app/stores/masters/organization/section-store';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { SubsidiaryStore } from 'src/app/stores/organization/business_profile/subsidiary/subsidiary.store';
import { MsTypeStore } from 'src/app/stores/organization/business_profile/ms-type/ms-type.store';
import { MstypesService } from 'src/app/core/services/organization/business_profile/ms-type/mstype.service';
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { FrameworksService } from 'src/app/core/services/business-assessments/frameworks/frameworks.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { AuthStore } from 'src/app/stores/auth.store';
declare var $: any;

@Component({
  selector: 'app-assessment-modal',
  templateUrl: './assessment-modal.component.html',
  styleUrls: ['./assessment-modal.component.scss']
})
export class AssessmentModalComponent implements OnInit {
  @ViewChild('formModal') formModal: ElementRef;
  @Input('source') assessmentSource: any;
  @ViewChild('khDoc') khDoc: ElementRef;
  form: FormGroup;
  AssessmentsStore = AssessmentsStore;
  SubsidiaryStore = SubsidiaryStore;
  DivisionStore = DivisionMasterStore;
  DepartmentStore = DepartmentMasterStore;
  SectionStore = SectionMasterStore;
  SubSectionStore = SubSectionMasterStore;
  MsTypeOrganizationStore = MsTypeStore;
  FrameworksStore = FrameworksStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  formErrors = null;
  selectFile = false;
  khDocumentSubscription:any;
  frameworkSubscriptionEvent:any;
  idleTimeoutSubscription:any;
  networkFailureSubscription:any;
  

  frameworkObject = {
    component: 'BusinessAssessment',
    values: null,
    type: null
  };
  config = {
 toolbar: [
      'undo',
      'redo',
      '|',
      'heading',
      
      '|',
      'bold',
      'italic',
     
      '|',
      'link',
      'imageUpload',
      '|',
     
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'insertTable',
      'blockQuote',
      
    ],
    language: 'id',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:full',
        'imageStyle:side'
      ]
    }
  };
  public Editor;
  public Config;
  constructor(private _formBuilder:FormBuilder,
    private _utilityService:UtilityService,
    private _eventEmitterService:EventEmitterService,
    private _assessmentsService:AssessmentsService,
    private _cdr:ChangeDetectorRef,
    private _imageService: ImageServiceService,
    private _router:Router,
    private _subsidiaryService: SubsidiaryService,
    private _divisionService: DivisionService,
    private _departmentService: DepartmentService,
    private _sectionService: SectionService,
    private _subSectionService: SubSectionService,
    private _msTypeOrganizationService: MstypesService,
    private _frameworksService: FrameworksService,
    private _documentFileService: DocumentFileService,
    private _helperService:HelperServiceService,
    private _renderer2:Renderer2,
    private _http: HttpClient) { 
      this.Editor = myCkEditor;
     }
    
     public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {

    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],
    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    this.form = this._formBuilder.group({
      id:[null],
      business_assessment_framework_id: [null, [Validators.required]],
      document_version_id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: [''],
      organization_ids: [[], [Validators.required]],
      division_ids: [],
      department_ids: [[], [Validators.required]],
      section_ids: [],
      sub_section_ids: [],
      ms_type_organization_ids: [[], [Validators.required]]

    });
  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
    this.form.controls['division_ids'].setValidators(Validators.required);
  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
    this.form.controls['section_ids'].setValidators(Validators.required);
  if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
    this.form.controls['sub_section_ids'].setValidators(Validators.required);
    if (this.assessmentSource) {
      this.setFormValues();
    }
    

    this.khDocumentSubscription = this._eventEmitterService.khDocumentModal.subscribe(item => {
      this.closeDocumentModal();
    })

    
    this.frameworkSubscriptionEvent = this._eventEmitterService.frameworkControl.subscribe(res => {
      this.closeFrameworkModal();
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
    this.setInitialOrganizationLevels();
  }

  MyCustomUploadAdapterPlugin( editor ) {
    editor.plugins.get( 'FileRepository' )
    .createUploadAdapter = ( loader ) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter( loader, this._http );
    };
}

  ngDoCheck(){
    if (this.assessmentSource && this.assessmentSource.hasOwnProperty('values') && this.assessmentSource.values && !this.form.value.id)
      this.setFormValues();
  }

  changeZIndex(){
    if($(this.formModal.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
    }
    else if($(this.khDoc.nativeElement).hasClass('show')){
      this._renderer2.setStyle(this.khDoc.nativeElement,'z-index',999999);
      this._renderer2.setStyle(this.khDoc.nativeElement,'overflow','auto');
    }
  }

  setFormValues(){
    if (this.assessmentSource.hasOwnProperty('values') && this.assessmentSource.values) {
      let { id, title,description,business_assessment_framework,organizations,divisions,departments,sections,sub_sections,ms_type_organizations,document_version} = this.assessmentSource.values
      this.form.patchValue({
        id:id,
        title:title,
        description: description,
        business_assessment_framework_id: business_assessment_framework,
        department_ids: this.form.value.department_ids ? [this.form.value.department_ids.id] : [],
			organization_ids: this.form.value.organization_ids ? [this.form.value.organization_ids.id] : [],
			division_ids: this.form.value.division_ids ? [this.form.value.division_ids.id] : [],
			section_ids: this.form.value.section_ids ? [this.form.value.section_ids.id] : [],
			sub_section_ids: this.form.value.sub_section_ids ? [this.form.value.sub_section_ids.id] : [],
        ms_type_organization_ids:ms_type_organizations,
        document_version_id: document_version,
        
      })

      // AssessmentsStore.activeFile=res.document_version;
      // AssessmentsStore.activeFile['document_version_id'] = res.document_version.id
      // this.getData();
     
    }
  }
  

  closeFormModal() {
    this.form.reset();
    this.formErrors = null;
    this._router.navigateByUrl('/business-assessments/assessments');
    this._eventEmitterService.dismissAssessmentModal();
 
   }

   editFramework(id) {

    this._frameworksService.getItem(id).subscribe(res => {
 
      this.frameworkObject.values = {
        id: res['id'],
        title: res['title'],
        description: res['description'],
        option: res['business_assessment_framework_options']
      }
      this.frameworkObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);

    })
  }

   save(close: boolean = false) {
    this.formErrors = null;
    let saveData = {
      title:this.form.value.title?this.form.value.title:'',
      description:this.form.value.description?this.form.value.description:'',
      business_assessment_framework_id: this.form.value.business_assessment_framework_id?.id?this.form.value.business_assessment_framework_id.id:null,
      ms_type_organization_ids: this.form.value.ms_type_organization_ids?this.processSaveData(this.form.value.ms_type_organization_ids,'ms-type'):[],
      organization_ids: this.form.value.organization_ids?this.processSaveData(this.form.value.organization_ids):[],
      division_ids: this.form.value.division_ids?this.processSaveData(this.form.value.division_ids):[],
      department_ids: this.form.value.department_ids?this.processSaveData(this.form.value.department_ids):[],
      section_ids: this.form.value.section_ids?this.processSaveData(this.form.value.section_ids):[],
      sub_section_ids: this.form.value.sub_section_ids?this.processSaveData(this.form.value.sub_section_ids):[],
      document_version_id: AssessmentsStore.activeFile!=null?AssessmentsStore.activeFile.document_version_id:null,
     
    }

    let save;
    AppStore.enableLoading();
    if (this.form.value.id) {
      save = this._assessmentsService.updateItem(this.form.value.id, saveData);
    } else {

      save = this._assessmentsService.saveItem(saveData);
    }
    save.subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      // if (!this.form.value.id) {
        this.form.reset();
        AssessmentsStore.activeFile=null;
        setTimeout(() => {

          // if (close) {
            this.closeFormModal();
            this.form.reset();
            this.gotoDetails(res['id']);
          // }
        }, 300);
      // }

      
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        
      }
       else if(err.status == 403 || err.status == 500){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
    });
  }

  selectFiles() {
    this.selectFile = true;
    $(this.khDoc?.nativeElement).modal('show');
  }

  processSaveData(data,type?) {
    let tempData = []
    if(type=='ms-type'){
      for (let i of data) {
        tempData.push(i);
      }
    }
    else{
      for (let i of data) {
        tempData.push(i.id);
      }
    }
    
    return tempData;
  }

  descriptionValueChange(event){
    this._utilityService.detectChanges(this._cdr);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  
  getDescriptionLength(){
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex,"");
    return result.length;
  }

  checkAcceptFileTypes(type){
    return this._imageService.getAcceptFileTypes(type); 
  }

  gotoDetails(id){
    AssessmentsStore.assessmentId = id;
    this._router.navigateByUrl('business-assessments/assessment/'+id)
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }


  /**
 * removing document file from the selected list
 * @param token -image token
 */
  removeDocument() {
    AssessmentsStore.unsetProductImageDetails();
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


  getMsType() {
    this._msTypeOrganizationService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchMsType(e) {
    this._msTypeOrganizationService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getFramework() {
    this._frameworksService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchFramework(e) {
    this._frameworksService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  searchSubsidiary(e) {
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this._subsidiaryService.searchSubsidiary('?is_full_list=true&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
		}
	}

	getSubsidiary() {
		this._subsidiaryService.getAllItems(false, '?access_all=true&is_full_list=true').subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

  searchDivision(e) {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
      let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			this._divisionService.getItems(false, '&organization_ids=' + parameters + '&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
  }

  // Get Division
  getDivision() {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let parameters = this._helperService.createParameterFromArray(this.form.get('organization_ids').value);
			this._divisionService.getItems(false, '&organization_ids=' + parameters).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
		else {
			this.DivisionStore.setAllDivision([]);
		}
  }

  /**
  * Search Department
  * @param e e.term - character to search
  */
  searchDepartment(e) {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			this._departmentService.getItems(false, params + '&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
  }

  // Get Department
  getDepartment() {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value);
			this._departmentService.getItems(false, params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
		else {
			this.DepartmentStore.setAllDepartment([]);
		}
  }

  // Get Section
  getSection() {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
			this._sectionService.getItems(false, params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
		else {
			this.SectionStore.setAllSection([]);
		}
  }

  /**
  * Search Section
  * @param e e.term - character to search
  */
  searchSection(e) {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value);
			this._sectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
  }

  // Get Sub Section
  getSubSection() {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value);
			this._subSectionService.getItems(false, params).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
		else {
			this.SubSectionStore.setAllSubSection([]);
		}
  }

  setNull(type) {
		switch (type) {
			case 'organization':
				this.form.patchValue({
					branch_ids: [],
					division_ids: [],
					department_ids: [],
					section_ids: [],
					sub_section_ids: [],
				
				})
				break;
			case 'division':
				this.form.patchValue({
					department_ids: null,
					section_ids: null,
					sub_section_ids: null,
				
				})
				break;
			case 'department':
				this.form.patchValue({

					section_ids: null,
					sub_section_ids: null,
			
				})
				break;
			case 'section':
				this.form.patchValue({
					sub_section_ids: null,
				
				})
				break;
      case 'sub_section':
				this.form.patchValue({
					sub_section_ids: null,
				})
				break;

		}
	}

  setInitialOrganizationLevels(){
    this.form.patchValue({
      division_ids: AuthStore.user.division ? [AuthStore.user.division] : [],
      department_ids:AuthStore.user.department ? [AuthStore.user.department] : [],
      section_ids:AuthStore.user.section ? [AuthStore.user.section] : [],
      sub_section_ids: AuthStore.user.sub_section ? [AuthStore.user.sub_section] : [],
      organization_ids: AuthStore.user.organization ? [AuthStore.user.organization] : []
      // branch_ids: AuthStore.user.branch ? [AuthStore.user.branch] : []
    });
    // if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary){
    //   this.form.patchValue({ organization_ids: [AuthStore.user.organization]});
    // }
    if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			this.searchSubsidiary({ term: this.form.value.organization_ids });
		}
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division) this.searchDivision({ term: this.form.value.division_ids });
		this.searchDepartment({ term: this.form.value.department_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section) this.searchSection({ term: this.form.value.section_ids });
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section) this.searchSubSection({ term: this.form.value.sub_section_ids });
		// if(OrganizationLevelSettingsStore.organizationLevelSettings?.is_branch) this.searchBranches({ term: this.form.value.branch_ids })
		this._utilityService.detectChanges(this._cdr);
  } 

  closeDocumentModal() {
    this.selectFile = false;
    setTimeout(() => {
      $(this.khDoc.nativeElement).modal('hide');
    }, 100);


  }

  getVersion(versionData){
    for(let i of versionData.document.versions){
      if(i.version==versionData.version){
        return i;
      }
    }
  }

    /**
 * 
 * @param type -document -will get thumbnail preview of document or else user profile picture
 * 
 * @param token -image token
 */
createImageUrl(type,token) {
  return this._documentFileService.getThumbnailPreview(type, token);
}
  

  /**
  * Search Sub Section
  * @param e e.term - character to search
  */
  searchSubSection(e) {
    if ((this.form.get('organization_ids').value && (this.form.get('organization_ids').value.length > 0 || this.form.get('organization_ids').value.id)) || !OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary) {
			let params = '&organization_ids=' + this._helperService.createParameterFromArray(this.form.get('organization_ids').value)
        + '&division_ids=' + this._helperService.createParameterFromArray(this.form.get('division_ids').value)
        + '&department_ids=' + this._helperService.createParameterFromArray(this.form.get('department_ids').value)
        + '&section_ids=' + this._helperService.createParameterFromArray(this.form.get('section_ids').value)
			this._subSectionService.getItems(false, params + '&q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			});
		}
  }

  addNewFramework(){
    // this.form.reset();
    this.frameworkObject.type = 'Add';
    this.frameworkObject.values=null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
 
  }

  closeFrameworkModal() {
    this.frameworkObject.type = null;
    $(this.formModal.nativeElement).modal('hide');
      if(FrameworksStore.lastInsertedId){
       
        this._frameworksService.getItems(false,'q=' + FrameworksStore.lastInsertedId).subscribe(res => {
          for(let i of res['data']){
            if(i.id == FrameworksStore.lastInsertedId){
              this.form.patchValue({
                business_assessment_framework_id:i
              })
            }
          }
          this._utilityService.detectChanges(this._cdr);
        })
      
      }
    
  }

  
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  ngOnDestroy(){
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.frameworkSubscriptionEvent.unsubscribe();
    this.khDocumentSubscription.unsubscribe();
  }


}
