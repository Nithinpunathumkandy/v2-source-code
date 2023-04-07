import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BcpService } from 'src/app/core/services/bcm/bcp/bcp.service';
import { OutcomeService } from 'src/app/core/services/bcm/exercise-outcome/outcome.service';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { BcmFileServiceService } from 'src/app/core/services/masters/bcm/bcm-file-service/bcm-file-service.service';
import { TestAndExerciseChecklistService } from 'src/app/core/services/masters/bcm/test-and-exercise-checklist/test-and-exercise-checklist.service';
import { TestAndExerciseCommunicationsService } from 'src/app/core/services/masters/bcm/test-and-exercise-communications/test-and-exercise-communications.service';
import { TestAndExerciseRecoveryLevelService } from 'src/app/core/services/masters/bcm/test-and-exercise-recovery-level/test-and-exercise-recovery-level.service';
import { TestAndExerciseTypesService } from 'src/app/core/services/masters/bcm/test-and-exercise-types/test-and-exercise-types.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { OutcomeStore } from 'src/app/stores/bcm/test-exercise/outcome.store';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { TestAndExerciseChecklistMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-checklist.store';
import { TestAndExerciseRecoveryLevelMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-recovery-level.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-test-exercise-outcome-add',
  templateUrl: './test-exercise-outcome-add.component.html',
  styleUrls: ['./test-exercise-outcome-add.component.scss']
})
export class TestExerciseOutcomeAddComponent implements OnInit {

  @Input('source') testSource: any;
  @ViewChild('newControl') newControl: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
	@ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
  
  TestAndExerciseRecoveryLevelMasterStore = TestAndExerciseRecoveryLevelMasterStore
  TestAndExerciseChecklistMasterStore = TestAndExerciseChecklistMasterStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore
  organisationChangesModalSubscription: any = null;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  openModelPopup: boolean = false;
  pipe = new DatePipe('en-US');
  currentTab = 0;
  nextButtonText = 'Next';
  previousButtonText = "Previous";
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
      'bulletedList',
      'numberedList',
      '|',
      'indent',
      'outdent',
      '|',
      'blockQuote',

    ],
    language: 'id',
    image: {
      toolbar:[]
    }
  };
  public Editor;
  public Config;
  fileUploadPreviewSubscription: any;
  fileUploadPopupSubscriptionEvent: any;
  loaded: boolean=false;
  checkListArray=[];
  constructor(private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _testAndExerciseRecoveryLevelService: TestAndExerciseRecoveryLevelService,
    private _testAndExerciseCommunicationsService: TestAndExerciseCommunicationsService,
    private _testAndExerciseChecklistService: TestAndExerciseChecklistService,
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
    private _outcomeService: OutcomeService,
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
      recovery_time:['',[Validators.required]],
      recovery_level:[null,[Validators.required]],
      actual_cost:[''],
      type_description:[''],
      what_went_well:['',[Validators.required]],
      improvements:[''],
      remarks:[''],
      documents: [[], ''],
    });
    setTimeout(() => {
			this.enableScrollbar();
			this._utilityService.detectChanges(this._cdr);
		}, 50);
    this.fileUploadPreviewSubscription = this._eventEmitterService.fileUploadPreviewFocus.subscribe(res => {
      
		})

		this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
      this._utilityService.detectChanges(this._cdr)
		})
    this._testAndExerciseChecklistService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    if(this.testSource.type=='Edit'){
      this.getRecoveryLevel()
      setTimeout(() => {
        this.showTab(this.currentTab);
        this.setEditableValues()
      }, 50);
    }
  }

  nextTab(i){
    if(TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist[i]['answer']==undefined){
      return true
    }else{
      return false
    }
  }

  clearRecoveryLevel(){
    this.form.patchValue({
      type_description:''
    })
    this.getRecoveryLevel();
  }

  recoveryLevelChange(){
    if(this.form.value.recovery_level){
      this._testAndExerciseRecoveryLevelService.getItem(this.form.value.recovery_level).subscribe((res) => {
        this.form.patchValue({
          type_description:res.description
        })
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
      });
    }
  }

  ngAfterViewChecked(){
    // <script>
   //step-form-small starts
   var current_fs, next_fs, previous_fs; //fieldsets
   var left, opacity, scale; //fieldset properties which we will animate
   var animating; //flag to prevent quick multi-click glitches

   $(".next").click(function (event) {
     current_fs = $(this).parent();
     next_fs = $(this).parent().next();
     current_fs.hide(100);
     next_fs.show(100);
     $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
   })

   $(".previous").click(function (event) {
     current_fs = $(this).parent();
     previous_fs = $(this).parent().prev();
     current_fs.hide(100);
     previous_fs.show(100);
     $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

   })
   $(".submit").click(function () {
    return false;
  })

  }

  nextPrev(n) {

    // This function will figure out which tab to display
    var x: any = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:

    if (document.getElementsByClassName("step")[this.currentTab]) {
      document.getElementsByClassName("step")[this.currentTab].className += " finish";
    }


    // Hide the current tab:
    // x[this.currentTab]?.style.display = "none";
    // Increase or decrease the current tab by 1:
    this.currentTab = this.currentTab + n;

    // if you have reached the end of the form...
    if (this.currentTab >= x.length) {
      // ... the form gets submitted:
      this.currentTab = this.currentTab > 0 ? this.currentTab - n : this.currentTab;
      // x[this.currentTab].style.display = "block";
      // this.submitForm();

      return false;
    }
    // Otherwise, display the correct tab:

    this.showTab(this.currentTab);

  }

  showTab(n) {
    // This function will display the specified tab of the form...
    var x: any = document.getElementsByClassName("tab");
    if (x[n]) x[n].style.display = "block";
    //... and fix the Previous/Next buttons:
    if (n == (x.length - 1)) {
      // this.getSelectedValues();
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Save";
    } else {
      if (document.getElementById("nextBtn"))
        this.nextButtonText = "Next";
    }
    //... and run a function that will display the correct step indicator:
    this.fixStepIndicator(n)
  }

  fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
      x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    if (x[n]) x[n].className += " active";
  }

  activateAnimation(){
    var current_fs, next_fs, previous_fs; //fieldsets
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    $(".next").click(function () {
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      next_fs = $(this).parent().next();

      //activate next step on progressbar using the index of next_fs
      $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

      //show the next fieldset
      next_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale current_fs down to 80%
          scale = 1 - (1 - now) * 0.2;
          //2. bring next_fs from the right(50%)
          left = (now * 50) + "%";
          //3. increase opacity of next_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'transform': 'scale(' + scale + ')'
          });
          next_fs.css({
            'left': left,
            'opacity': opacity
          });
        },
        duration: 500,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeOutQuint'
      });
    });

    $(".previous").click(function () {
      if (animating) return false;
      animating = true;

      current_fs = $(this).parent();
      previous_fs = $(this).parent().prev();

      //de-activate current step on progressbar
      $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

      //show the previous fieldset
      previous_fs.show();
      //hide the current fieldset with style
      current_fs.animate({
        opacity: 0
      }, {
        step: function (now, mx) {
          //as the opacity of current_fs reduces to 0 - stored in "now"
          //1. scale previous_fs from 80% to 100%
          scale = 0.8 + (1 - now) * 0.2;
          //2. take current_fs to the right(50%) - from 0%
          left = ((1 - now) * 50) + "%";
          //3. increase opacity of previous_fs to 1 as it moves in
          opacity = 1 - now;
          current_fs.css({
            'left': left
          });
          previous_fs.css({
            'transform': 'scale(' + scale + ')',
            'opacity': opacity
          });
        },
        duration: 500,
        complete: function () {
          current_fs.hide();
          animating = false;
        },
        //this comes from the custom easing plugin
        easing: 'easeOutQuint'
      });
    });

    $(".submit").click(function () {
      return false;
    })
  }

  typeCast(answer){
    let typecastAnswer = this._helperService.getTypeCastedValue(answer)
    return typecastAnswer
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
    if (OutcomeStore.getDocumentDetails.length >= 5 || (this.fileUploadsArray.length > 5 && OutcomeStore.getDocumentDetails.length < 5) || ((this._helperService.checkFileisUploadedCount(this.fileUploadsArray) + OutcomeStore.getDocumentDetails.length)) >= 5) {
    $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
    $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  } 

  checkListData(){
    let checkListData=[]
    for (let i = 0; i < TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist.length; i++) {
      const element = TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist[i];
      if(element['answer']==1){
        var obj = new Object
        obj['check_list_id'] = element.id
        obj['answer'] = element.answer
        obj['comments'] = element['remarks'+i]?element['remarks'+i]:''
        checkListData.push(obj)
      }
      if(element['answer']==0){
        var obj = new Object
        obj['check_list_id'] = element.id
        obj['answer'] = element.answer
        obj['comments'] = element['remarks'+i]?element['remarks'+i]:''
        checkListData.push(obj)
      }
    }
    return checkListData
  }

  processSaveData(){
    let saveData = this.form.value
    saveData['check_list_data'] = this.checkListData()
    saveData['test_and_exercise_id'] = TestAndExerciseStore.selectedId
    saveData['recovery_time'] = this.form.value.recovery_time?this.form.value.recovery_time:null
    saveData['recovery_level_id'] = this.form.value.recovery_level?this.form.value.recovery_level:''
    saveData['what_went_well'] = this.form.value.what_went_well?this.form.value.what_went_well:''
    saveData['improvements'] = this.form.value.improvements?this.form.value.improvements:''
    saveData['actual_cost'] = this.form.value.actual_cost?this.form.value.actual_cost:''
    saveData['remarks'] = this.form.value.remarks?this.form.value.remarks:''
    // saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
    if (this.form.value.id) {
			saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
		} else{
			saveData['documents'] = this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save');
		}
    return saveData;
  }

  setCheckListValues(checklists){
    checklists.forEach(res=>{
      setTimeout(() => {
        var pos = TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist.findIndex(e=>e.id==res.test_and_exercise_checklist_id)
        if(TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist.length!=0){
          TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist[pos]['answer'] = parseInt(res.answer)
        TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist[pos]['remarks'+pos] = res.comments
        }
        this._utilityService.detectChanges(this._cdr);
      }, 50);
    })
  }

  setEditableValues(){
    if(this.testSource.values){
      let values = this.testSource.values 
      this.form.patchValue({
        id: values.id,
        remarks: values.remarks?values.remarks:'',
        recovery_time:values.recovery_time?values.recovery_time:'',
        recovery_level:values.recovery_level?values.recovery_level.id:null,
        what_went_well:values.what_went_well?values.what_went_well:'',
        improvements:values.improvements?values.improvements:'',
        actual_cost:values.actual_cost?values.actual_cost:'',
      })
      if(values.checklists.length!=0){
        this.setCheckListValues(values.checklists)
      }
      this.recoveryLevelChange()
      if (values.documents.length > 0) {
			this.setDocuments(values.documents);
      setTimeout(() => {
        this.enableScrollbar();
			  this._utilityService.detectChanges(this._cdr);
      }, 50);
		}
    }
  }

  save(close:boolean=false){
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._outcomeService.updateItem(this.form.value.id, this.processSaveData());
      } else {
        delete this.form.value.id
        save = this._outcomeService.saveItem(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if(!this.form.value.id){
          this.resetForm();
          this.cancel();
        }
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        // if (close) 
        this.cancel();
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

  getRecoveryLevel(){
    this._testAndExerciseRecoveryLevelService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  searchRecoveryLevel(e){
    this._testAndExerciseRecoveryLevelService.getItems(false, 'q=' + e.term).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  selectChecklist(index,btn){
    // let object = {
    //   ind:'',
    //   btn:''
    // }
    // if(this.checkListArray.length==0){
    //   object.ind = index
    //   object.btn = btn
    //   this.checkListArray.push(object)
    // }else{
    //   var pos = this.checkListArray.findIndex(e=>e.ind==index)
    //   if(pos!=-1){
    //     this.checkListArray[pos].ind= index
    //     this.checkListArray[pos].btn= btn
    //   }else{
    //     object.ind = index
    //     object.btn = btn
    //     this.checkListArray.push(object)
    //   }
    // }
    TestAndExerciseChecklistMasterStore.TestAndExerciseChecklist[index]['answer']=btn
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
					var purl = this._bcmFileService.getThumbnailPreview('test-and-exercise-outcomes', element.token)
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
    this._utilityService.detectChanges(this._cdr);
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
          OutcomeStore.document_preview_available = true;
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

                  OutcomeStore.document_preview_available = false;


                  this.createImageFromBlob(prew, temp, type);

                }, (error) => {
                  OutcomeStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            OutcomeStore.document_preview_available = false;
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
  //   if (OutcomeStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
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
    OutcomeStore.unsetProductImageDetails('support-file', token);
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
      this._utilityService.detectChanges(this._cdr)
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
    this._eventEmitterService.dismissExerciseOutcome();
    this.fileUploadPopupSubscriptionEvent.unsubscribe()
    fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
		$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
  }

}
