import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationalSettingsStore } from 'src/app/stores/general/organizational-settings-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { IReactionDisposer } from 'mobx';
import { AmAuditInformationRequestService } from 'src/app/core/services/audit-management/am-audit/am-audit-information-request/am-audit-information-request.service';
import { AmAuditInformationRequestStore } from 'src/app/stores/audit-management/am-audit/am-audit-information-request.store';
import { AuditManagementService } from 'src/app/core/services/audit-management/audit-management-service/audit-management.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import * as myCkEditor from 'src/assets/build/ckeditor';
declare var $: any;
@Component({
	selector: 'app-information-request-add-modal',
	templateUrl: './information-request-add-modal.component.html',
	styleUrls: ['./information-request-add-modal.component.scss']
})
export class InformationRequestAddModalComponent implements OnInit {
	@Input('source') requestObject: any
	@ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
	@ViewChild('organisationChangeFormModal') organisationChangeFormModal: ElementRef;
	@ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
	@ViewChild('previewUploadArea', { static: false }) previewUploadArea: ElementRef;
	@ViewChild('cancelPopup') cancelPopup: ElementRef;
	form: FormGroup;
	reactionDisposer: IReactionDisposer;
	formErrors = null;
	AppStore = AppStore;
	AuthStore = AuthStore;
	AmInformationRequestStore = AmAuditInformationRequestStore;
	OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;
	OrganizationalSettingsStore = OrganizationalSettingsStore;
	OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
	UsersStore = UsersStore;
	fileUploadPopupStore = fileUploadPopupStore;
	fileUploadPopupSubscriptionEvent: any = null;
	organisationChangesModalSubscription: any;
	cancelEventSubscription: any;
	openModelPopup: boolean;

	OrganizationLevelObject = {
		component: 'Audit',
		values: null,
		type: null
	};

	fileUploadsArray: any = []; // Display Mutitle File Loaders

	config = {
		toolbar: [
			'undo',
			'redo',
			'|',
			'heading',

			'|',

			'bulletedList',
			'numberedList',

		],
		language: 'id',

	};

	public Editor;
	// public Config;

	constructor(private _eventEmitterService: EventEmitterService,
		private _helperService: HelperServiceService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2,
		private _imageService: ImageServiceService,
		private _http: HttpClient,
		private _fileUploadPopupService: FileUploadPopupService,
		private _documentFileService: DocumentFileService,
		private _informationRequestService: AmAuditInformationRequestService,
		private _auditManagementService: AuditManagementService,
		private _formBuilder: FormBuilder,
		private _usersService: UsersService,
		private _humanCapitalService: HumanCapitalService) {
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
			am_audit_information_request_id: [null],
			organization_id: [null],
			division_id: [null],
			department_id: [null],
			section_id: [null],
			sub_section_id: [null],
			description: ['', [Validators.required]],
			type: [''],
			to_user_id: [null, [Validators.required]],
			documents: [[]],
		})

		this.organisationChangesModalSubscription = this._eventEmitterService.organisationChanges.subscribe(
			(res) => {
				this.closeModal(res);
			});

		this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
			this.enableScrollbar();
			this.closeFileUploadModal();
		})

		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_subsidiary)
			this.form.controls['organization_id'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_department)
			this.form.controls['department_id'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_division)
			this.form.controls['division_id'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_section)
			this.form.controls['section_id'].setValidators(Validators.required);
		if (OrganizationLevelSettingsStore.organizationLevelSettings?.is_sub_section)
			this.form.controls['sub_section_id'].setValidators(Validators.required);


		if (this.requestObject?.type == 'Add' && this.requestObject?.requestType != 'response') {
			this.setInitialOrganizationLevels();
		}
		else {
			this.setFormValues();
		}
	}


	setFormValues() {
		if (this.requestObject?.hasOwnProperty('values') && this.requestObject?.values) {
			let { am_audit_information_request_id, organization_id, division_id, department_id,
				section_id, sub_section_id, description, type, to_user_id, documents } = this.requestObject.values
			this.form.patchValue({
				am_audit_information_request_id: am_audit_information_request_id,
				organization_id: organization_id ? organization_id : AuthStore.user?.organization,
				division_id: division_id ? division_id : AuthStore.user?.division,
				department_id: department_id ? department_id : AuthStore.user?.department,
				section_id: section_id ? section_id : AuthStore.user?.section,
				sub_section_id: sub_section_id ? sub_section_id : AuthStore.user?.sub_section,
				description: description,
				type: type,
				to_user_id: to_user_id,
				documents: documents,
			})
		}
	}


	setInitialOrganizationLevels() {
		let user = AuthStore.user
		user.first_name = user.name
		this.form.patchValue({
			division_id: AuthStore?.user?.division ? AuthStore?.user?.division : null,
			department_id: AuthStore?.user?.department ? AuthStore?.user?.department : null,
			section_id: AuthStore?.user?.section ? AuthStore?.user?.section : null,
			sub_section_id: AuthStore?.user?.sub_section ? AuthStore?.user?.sub_section : null,
			organization_id: AuthStore.user?.organization ? AuthStore.user?.organization : null,
		});

		this._utilityService.detectChanges(this._cdr);
	}

	closeFormModal() {
		this.clearItems();
		this._eventEmitterService.dismissAmInformationRequestModal();
	}

	clearItems() {
		this.form.reset();
		this.formErrors = null;
		this.clearCommonFilePopupDocuments();
		this.setInitialOrganizationLevels();
	}

	getSaveData() {
		// if () {
		let saveData = {
			am_audit_information_request_id: this.form.value.am_audit_information_request_id,
			organization_id: this.form.value.organization_id?.id,
			division_id: this.form.value.division_id?.id,
			department_id: this.form.value.department_id?.id,
			section_id: this.form.value.section_id?.id,
			sub_section_id: this.form.value.sub_section_id?.id,
			description: this.form.value.description,
			to_user_id: this.form.value.to_user_id?.id ? this.form.value.to_user_id?.id : this.form.value.to_user_id,
			documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile),
			type: this.requestObject?.requestType
		}
		return saveData;

	}

	saveRequest(close: boolean = false) {
		this.formErrors = null;
		let save;
		AppStore.enableLoading();

		if (this.requestObject?.type == 'Add')
			save = this._informationRequestService.saveItem(this.getSaveData());
		else
			save = this._informationRequestService.updateItem(this.form.value.am_audit_information_request_id, this.getSaveData());

		save.subscribe((res: any) => {
			AppStore.disableLoading();
			if (this.requestObject?.type == 'Add') {
				this.clearItems();
			}
			else {
				this.clearEditFiles();
			}

			this._utilityService.detectChanges(this._cdr)
			if (close) this.closeFormModal();
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

	clearEditFiles() {
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	//getting button name by language
	getButtonText(text) {
		return this._helperService.translateToUserLanguage(text);
	}

	closeModal(data?) {
		if (data) {
			this.form.patchValue({
				division_id: data.division_ids ? data.division_ids : null,
				department_id: data.department_ids ? data.department_ids : null,
				section_id: data.section_ids ? data.section_ids : null,
				sub_section_id: data.sub_section_ids ? data.sub_section_ids : null,
				organization_id: data.organization_ids ? data.organization_ids : null,
			})
		}
		$(this.organisationChangeFormModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '9999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'none');
		this.openModelPopup = false;
		this.OrganizationLevelObject.values = null;
		this._utilityService.detectChanges(this._cdr);
	}


	organisationChanges() {

		OrganizationalSettingsStore.isMultiple = false;
		if (this.form.value.am_audit_information_request_id) {
			this.OrganizationLevelObject.values = {
				id: this.form.value.am_audit_information_request_id,
				organization_ids: this.form.value.organization_id ? this.form.value.organization_id : null,
				division_ids: this.form.value.division_id ? this.form.value.division_id : null,
				department_ids: this.form.value.department_id ? this.form.value.department_id : null,
				section_ids: this.form.value.section_id ? this.form.value.section_id : null,
				sub_section_ids: this.form.value.sub_section_id ? this.form.value.sub_section_id : null
			}
		}
		this.openModelPopup = true;
		$(this.organisationChangeFormModal.nativeElement).modal('show');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'z-index', '99999');
		this._renderer2.setStyle(this.organisationChangeFormModal.nativeElement, 'display', 'block');
		this._utilityService.detectChanges(this._cdr);
	}


	onFileChange(event, type: string) {
		var selectedFiles: any[] = event.target.files;
		if (selectedFiles.length > 0) {
			var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); // Assign Files to Multiple File Uploads Array
			this.checkForFileUploadsScrollbar();
			Array.prototype.forEach.call(temporaryFiles, elem => {
				const file = elem;
				if (this._imageService.validateFile(file, type)) {
					const formData = new FormData();
					formData.append('file', file);
					var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
					this._imageService.uploadImageWithProgress(formData, typeParams) // Upload file to temporary storage
						.subscribe((res: HttpEvent<any>) => {
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
									this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => { //Generate preview url using thumbnail url returns blob
										this.createImageFromBlob(prew, temp, type); // Convert blob to base64 string
									}, (error) => {
										this.assignFileUploadProgress(null, file, true);
										this._utilityService.detectChanges(this._cdr);
									})
							}
						}, (error) => {
							this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
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

	createImageFromBlob(image: Blob, imageDetails, type) {
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			var logo_url = reader.result;

			imageDetails['preview'] = logo_url;
			if (imageDetails != null)
				this._informationRequestService.setDocumentDetails(imageDetails, logo_url);
			this.checkForFileUploadsScrollbar();
			this._utilityService.detectChanges(this._cdr);
		}, false);

		if (image) {
			reader.readAsDataURL(image);
		}
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

	checkExtension(ext, extType) {
		return this._imageService.checkFileExtensions(ext, extType);
	}


	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	MyCustomUploadAdapterPlugin(editor) {
		editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
			// Configure the URL to the upload script in your back-end here!
			return new MyUploadAdapter(loader, this._http);
		};
	}

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	removeBrochure(type, token) {
		fileUploadPopupStore.unsetFileDetails(type, token);
		this._utilityService.detectChanges(this._cdr);
	}

	removeDocument(doc) {
		if (doc.hasOwnProperty('is_kh_document')) {
			if (!doc['is_kh_document']) {
				fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
			}
			else {
				fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
			}
		}
		else {
			fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
		}
		// this.checkForFileUploadsScrollbar();
		this._utilityService.detectChanges(this._cdr);
	}

	setDocuments(documents) {

		let khDocuments = [];
		documents.forEach(element => {
			if (element.document_id) {
				element?.kh_document?.versions?.forEach(innerElement => {

					if (innerElement.is_latest) {
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
					var purl = this._auditManagementService.getThumbnailPreview('information-request', element.token)
					var lDetails = {
						created_at: element.created_at,
						created_by: element.created_by,
						updated_at: element.updated_at,
						updated_by: element.updated_by,
						name: element.title,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						asset_id: element.asset_id,
						'is_kh_document': false,
					}
				}
				this._fileUploadPopupService.setSystemFile(lDetails, purl);

			}

		});
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);

	}

	// scrollbar function
	checkForFileUploadsScrollbar() {

		if (AmAuditInformationRequestStore.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

	createImageUrl(type, token) {
		if (type == 'document-version')
			return this._documentFileService.getThumbnailPreview(type, token);
		else
			return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
	}

	getStringsFormatted(stringArray, characterLength, seperator) {
		return this._helperService.getFormattedName(stringArray, characterLength, seperator);
	}

	openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
			this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
			setTimeout(() => {
				$(this.fileUploadModal.nativeElement).modal('show');
				this._utilityService.detectChanges(this._cdr)
			}, 100);
		}, 250);
	}
	closeFileUploadModal() {
		fileUploadPopupStore.openPopup = false;
		document.body.classList.remove('modal-open')
		$(this.fileUploadModal.nativeElement).modal('hide');
		this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
		this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
		$('.modal-backdrop').remove();
		this._utilityService.detectChanges(this._cdr)
	}

	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

	getUsers() {
		var params = '?page=1';

		this._usersService.getAllItems(params).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});

	}

	searchUsers(e) {
		let params = '?page=1';
		if (params) params = params + '&q=' + e.term;
		else params = '?q=' + e.term;
		this._usersService.searchUsers(params ? params : '').subscribe(res => {
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
			item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
			let search = item['searchLabel'].toLowerCase();
			isWordThere.push(search.indexOf(arr_term) != -1);
		});

		const all_words = (this_word) => this_word;
		// Every method will return true if all values are true in isWordThere.
		return isWordThere.every(all_words);
	}

	descriptionValueChange(event) {
		this._utilityService.detectChanges(this._cdr);
	}


	ngOnDestroy() {
		$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
		// this.cancelEventSubscription.unsubscribe();
	}
}
