import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { SubSectionMasterStore } from 'src/app/stores/masters/organization/sub-section-store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { BcpService } from 'src/app/core/services/bcm/bcp/bcp.service';
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { TestAndExerciseTypesService } from 'src/app/core/services/masters/bcm/test-and-exercise-types/test-and-exercise-types.service';
import { TestAndExerciseTypesMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-types.master.store';
import { TestAndExerciseCommunicationsService } from 'src/app/core/services/masters/bcm/test-and-exercise-communications/test-and-exercise-communications.service';
import { TestAndExerciseCommunicationsMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-communications.store';
import { DatePipe } from '@angular/common';
import { BcmFileServiceService } from 'src/app/core/services/masters/bcm/bcm-file-service/bcm-file-service.service';
import { TestAndExerciseCommunicationsPaginationResponse } from 'src/app/core/models/masters/bcm/test-and-exercise-communications';

declare var $: any;
@Component({
  selector: 'app-test-and-exercise-add',
  templateUrl: './test-and-exercise-add.component.html',
  styleUrls: ['./test-and-exercise-add.component.scss']
})
export class TestAndExerciseAddComponent implements OnInit {

  @Input('source') testSource: any;
  @ViewChild('newControl') newControl: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
	@ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  
  AppStore = AppStore;
  BcpStore = BcpStore;
  AuthStore = AuthStore;
  UsersStore = UsersStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
  TestAndExerciseTypesMasterStore = TestAndExerciseTypesMasterStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  TestAndExerciseCommunicationsMasterStore = TestAndExerciseCommunicationsMasterStore;
  fileUploadPopupStore = fileUploadPopupStore;
  SubSectionMasterStore = SubSectionMasterStore;
  TestAndExerciseStore = TestAndExerciseStore;
  organisationChangesModalSubscription: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  openModelPopup: boolean = false;
  pipe = new DatePipe('en-US');
  fileUploadProgress = 0;
  fileUploadsArray: any = [];
  percentage = [];
  form: FormGroup;
  formErrors: any;
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
  testAndExerciseCommunicationsObject = {
    component: 'Master',
    values: null,
    type: null
  };
  public Editor;
  public Config;
  fileUploadPreviewSubscription: any;
  fileUploadPopupSubscriptionEvent: any;
  loaded: boolean=false;
  testAndExerciseCommunicationsEventSubsceiption: any;

  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _testAndExerciseCommunicationsService: TestAndExerciseCommunicationsService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _http: HttpClient,
    private _renderer2: Renderer2, private _router: Router,
    private _testAndExerciseService:TestAndExerciseService,
    private _userService:UsersService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
		private _fileUploadPopupService: FileUploadPopupService,
    private _testAndExerciseTypes: TestAndExerciseTypesService,
    private _bcmFileService: BcmFileServiceService,
    private _bcpService: BcpService,) {
      this.Editor = myCkEditor;
     }

      public onReady(editor: any) {
      editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
      );
    }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title:['',[Validators.required]],
      type_id: [null,[Validators.required]],
      bcp_ids: [[],[Validators.required]],
      bcp_strategy_solution_ids: [[]],
      risk_ids: [[]],
      scope: [''],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      lead_user_ids: [[],[Validators.required]],
      bcp_call_tree_ids: [[]],
      solution_ids:[[]],
      scenario_ids:[[]],
      plan_communication_ids:[null],
      communications:[''],
      remarks:[''],
      documents: [[], ''],
    });
    this.form.patchValue({
      start_date: new Date()
    })
    setTimeout(() => {
			this.enableScrollbar();
			this._utilityService.detectChanges(this._cdr);
		}, 50);
    this.fileUploadPreviewSubscription = this._eventEmitterService.fileUploadPreviewFocus.subscribe(res => {

			// this._renderer2.setStyle(this.newControl.nativeElement, 'z-index', 999999);
			// this._renderer2.setStyle(this.newControl.nativeElement, 'overflow', 'auto');

		})

    this.testAndExerciseCommunicationsEventSubsceiption = this._eventEmitterService.testAndExerciseTypes.subscribe(res => {
      this.closeFormModal();
    })

		this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})
    if(this.testSource.type=='Edit'){
      this.getType()
      this.getBcp()
      this.getUsers()
      this.getExcersisePlanCommunication()
      this.setEditableValues()
    }
  }

  addNewItem() {
    this.testAndExerciseCommunicationsObject.type = 'Add';
    this.testAndExerciseCommunicationsObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    if (TestAndExerciseCommunicationsMasterStore.lastInsertedId) {
			this.searchCommunication({ term: TestAndExerciseCommunicationsMasterStore.lastInsertedId }, true);
		}
    $(this.formModal.nativeElement).modal('hide');
    this.testAndExerciseCommunicationsObject.type = null;
  }

  searchCommunication(e, patchValue: boolean = false) {
    var array=[]
		this._testAndExerciseCommunicationsService.getItems(false, '&limit=1000').subscribe((res: TestAndExerciseCommunicationsPaginationResponse) => {
			if (res.data.length > 0 && patchValue) {
				for (let i of res.data) {
					if (i.id == e.term) {
            if(this.form.value.plan_communication_ids&&this.form.value.plan_communication_ids.length!=0){
              setTimeout(() => {
                array = this.form.value.plan_communication_ids
                array.push(i.id)
                this.form.patchValue({
                  plan_communication_ids:array
                })
                this._utilityService.detectChanges(this._cdr);
              }, 100);
            }else{
              array.push(i.id)
              this.form.patchValue({
                plan_communication_ids:array
              })
            }
						// this.form.patchValue({ plan_communication_ids: this.returnArray(i.id) });
						break;
					}
				}
			}
			this._utilityService.detectChanges(this._cdr);
		});
	}

  returnArray(id){
    let array = this.form.value.plan_communication_ids
    array.push(id)
    return array
  }

  stringFormatted(values){
    var string = ''
    values.forEach(element => {
      if(string){
        string = string+','+element
      }else{
        string = element
      }
    });
    console.log("string",string)
    return string
  }

  getScenarios(){
    if(this.form.value.bcp_ids.length!=0&&this.form.value.bcp_strategy_solution_ids.length!=0){
      let params = '?bcp_ids='+this.stringFormatted(this.form.value.bcp_ids)+'&test_and_exercise_scenario=true'
      this._testAndExerciseService.getScenarios(params).subscribe(res=>{
        if(res.data.length==0){
          this.form.patchValue({
            risk_ids:[]
          })
        }
      })
    }else{
      this.form.patchValue({
        risk_ids:[]
      })
      TestAndExerciseStore.unsetBcpCallTree()
    }
  }

  removeBrochure(doc) {
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
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }    

  checkForFileUploadsScrollbar() {
    if (TestAndExerciseStore.getDocumentDetails.length >= 5 || (this.fileUploadsArray.length > 5 && TestAndExerciseStore.getDocumentDetails.length < 5) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + TestAndExerciseStore.getDocumentDetails.length)) >= 5) {
    $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }    

  getSolutions(){
    if(this.form.value.bcp_ids.length!=0){
      let params = '?bcp_ids='+this.stringFormatted(this.form.value.bcp_ids)+'&bcs_solution_status_ids=3'
      this._testAndExerciseService.getSolutions(params).subscribe(res=>{
        if(res.data.length==0){
          this.form.patchValue({
            bcp_strategy_solution_ids:[],
            risk_ids:[]
          })
        }
      })
    }else{
      this.form.patchValue({
        bcp_strategy_solution_ids:[]
      })
      TestAndExerciseStore.unSetBcpSolutions()
      TestAndExerciseStore.unsetBcpCallTree()
    }
  }

  searchBcpCallTree(e) {
    if(this.form.value.bcp_ids.length!=0){
      let params = '&bcp_ids='+this.stringFormatted(this.form.value.bcp_ids)
      this._testAndExerciseService.getBcpCallTree('?q=' + e.term+params).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  getBcpCallTree(){
    if(this.form.value.bcp_ids.length!=0){
      let params = '?bcp_ids='+this.stringFormatted(this.form.value.bcp_ids)
      this._testAndExerciseService.getBcpCallTree(params).subscribe(res=>{
        if(res.length==0){
          this.form.patchValue({
            bcp_call_tree_ids:[],
          })
        }
      })
    }else{
      this.form.patchValue({
        bcp_call_tree_ids:[],
      })
      TestAndExerciseStore.unsetBcpCallTree()
    }
  }

  setEditableValues(){
    if(this.testSource.values){
      if(TestAndExerciseStore.detailsLoaded) {
        this.clearCommonFilePopupDocuments();
        if (this.testSource.values.documents.length > 0) {
          this.setDocuments(this.testSource.values.documents);
        }
      }
      let values = this.testSource.values 
      this.form.patchValue({
        id: values.id,
        title: values.title,
        type_id: values.test_and_exercise_type?values.test_and_exercise_type.id:null,
        bcp_ids: values.business_continuity_plans?this.getFilterById(values.business_continuity_plans):null,
        bcp_strategy_solution_ids: values.business_continuity_plan_strategy_solutions?this.getFilterById(values.business_continuity_plan_strategy_solutions):null,
        risk_ids: values?.risks?this.getFilterById(values.risks?values.risks:null):null,
        scope: values.scope?values.scope:'',
        start_date: values.start_date? new Date(values.start_date):'',
        end_date: values.end_date? new Date(values.end_date):'',
        communications: values.communications? values.communications:'',
        remarks:values.remarks? values.remarks:'',
        lead_user_ids:values.exercise_leads?this.getFilterById(values.exercise_leads):[],
        bcp_call_tree_ids:values.bcp_call_trees?this.getFilterById(values.bcp_call_trees):[],
        plan_communication_ids:values.plan_communications?this.getFilterById(values.plan_communications):[]
      })
      this.getBcpCallTree()
      this.getSolutions()
      this.getScenarios()
    }
  }

  getFilterById(fields) {
		var returnValues = [];
		for (let i of fields) {
			returnValues.push(i.id);
		}
		return returnValues;
	}

  formatDate(date) {
    if (date) {
      let tempRiskDate = this._helperService.processDate(date, 'join')
      return tempRiskDate;
    }
  }

  passSaveFormatDate(date)
  {
   const fromdate = this.pipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
   return fromdate;
  }

  MaxDate(){
    let curDate = new Date(this.form.value.start_date);
    return curDate;
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }


  processSaveData(){
    let saveData = this.form.value
    saveData['title'] = this.form.value.title?this.form.value.title:''
    saveData['type_id'] = this.form.value.type_id?this.form.value.type_id:null
    saveData['bcp_ids'] = this.form.value.bcp_ids?this.form.value.bcp_ids:null
    saveData['bcp_strategy_solution_ids'] = this.form.value.bcp_strategy_solution_ids?this.form.value.bcp_strategy_solution_ids:null
    saveData['risk_ids'] = this.form.value.risk_ids?this.form.value.risk_ids:null
    saveData['scope'] = this.form.value.scope?this.form.value.scope:''
    saveData['start_date'] = this.form.value.start_date?this.passSaveFormatDate(this.form.value.start_date):null
    saveData['end_date'] = this.form.value.end_date?this.passSaveFormatDate(this.form.value.end_date):null
    saveData['lead_user_ids'] = this.form.value.lead_user_ids?this.form.value.lead_user_ids:null
    saveData['bcp_call_tree_ids'] = this.form.value.bcp_call_tree_ids?this.form.value.bcp_call_tree_ids:null
    saveData['plan_communication_ids'] = this.form.value.plan_communication_ids?this.form.value.plan_communication_ids:null
    saveData['communications'] = this.form.value.communications?this.form.value.communications:''
    saveData['remarks'] = this.form.value.remarks?this.form.value.remarks:''
    // saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    if (this.form.value.id) {
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
		} else{
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}
    return saveData;
  }

  save(close:boolean=false){
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._testAndExerciseService.updateItem(this.form.value.id, this.processSaveData());
      } else {
        delete this.form.value.id
        save = this._testAndExerciseService.saveItem(this.processSaveData());
      }
      save.subscribe((res: any) => {
          this._router.navigateByUrl('bcm/test-and-exercises/'+res.id);
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.cancel();
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

  getBcp(newPage: number = null){
    this._bcpService.getItems(false,'bcp_status_ids=5',true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchBcp(e) {
    this._bcpService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getType(){
    this._testAndExerciseTypes.getItems(false, null, true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchType(e){
    this._testAndExerciseTypes.getItems(false, 'q=' + e.term).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getExcersisePlanCommunication(){
    this._testAndExerciseCommunicationsService.getItems(false).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchExcersisePlanCommunication(e){
    this._testAndExerciseCommunicationsService.getItems(false, 'q=' + e.term).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // getting  user
  getUsers() {
    this._userService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // search users
  searchUsers(e) {
    this._userService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }
  // Returns default image url
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  
  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  getDescriptionLength(type:any=null) {
    if(type=='communication'){
      var regex = /(<([^>]+)>)/ig;
      var result = this.form.value.communication_during_exercise.replace(regex, "");
      return result.length;
    }else{
      var regex = /(<([^>]+)>)/ig;
      var result = this.form.value.remarks.replace(regex, "");
      return result.length;
    }
  }

  clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}
	setDocuments(documents) {
		let khDocuments = [];
		documents.forEach(element => {

			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {

					if (innerElement.is_latest) {
						console.log('in kh push audit');
						khDocuments.push({
							...innerElement,
              title:element?.kh_document.title,
							'is_kh_document': true
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
							...innerElement

						})
					}

				});
			}
			else {
				if (element && element.token) {
					var purl = this._bcmFileService.getThumbnailPreview('test-and-exercise', element.token)
					var lDetails = {
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,
					}
				}
				this._fileUploadPopupService.setSystemFile(lDetails, purl)

			}

		});
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
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
          TestAndExerciseStore.document_preview_available = true;
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
                //return event;
                let temp: any = uploadEvent['body'];

                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {

                  TestAndExerciseStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  TestAndExerciseStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            TestAndExerciseStore.document_preview_available = false;
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

  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  // checkForFileUploadsScrollbar() {
  //   if (TestAndExerciseStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar();
  //   }
  //   else {
  //     $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  //   }
  // }

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
        this._testAndExerciseService.setImageDetails(imageDetails, logo_url, type);
      else
        this._testAndExerciseService.setSelectedImageDetails(logo_url, type);
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

  removeDocument(token) {
    TestAndExerciseStore.unsetProductImageDetails('support-file', token);
    this._utilityService.detectChanges(this._cdr);
  }

  clear(type) {
    if (type == 'bcp') {
      this.form.patchValue({
        bcp: null
      })
    }
    if (type == 'start_date') {
      this.form.patchValue({
        start_date: null
      })
    }
  }

  openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
			this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
			setTimeout(() => {
				this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
				this._utilityService.detectChanges(this._cdr)
			}, 100);
		}, 250);
	}
	closeFileUploadModal() {
		setTimeout(() => {
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

	createImageUrl(type, token) {
		if (type == 'document-version')
			return this._documentFileService.getThumbnailPreview(type, token);
	}
	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm(){
    this.form.reset();
    this.formErrors = null;
  }

  cancel(){
    this.resetForm();
    this._eventEmitterService.dismissExerciseAdd();
    // this.idleTimeoutSubscription.unsubscribe();
    // this.networkFailureSubscription.unsubscribe();
    this.fileUploadPopupSubscriptionEvent.unsubscribe()
    fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
    this.testAndExerciseCommunicationsEventSubsceiption.unsubscribe()
		$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }

}
