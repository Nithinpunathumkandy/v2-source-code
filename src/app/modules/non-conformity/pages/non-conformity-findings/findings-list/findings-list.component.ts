import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { Subscription } from 'rxjs';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NonConformityDashboardStore } from 'src/app/stores/non-conformity/dashboard/non-conformity-dashboard-store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';
declare var $: any;


@Component({
	selector: 'app-findings-list',
	templateUrl: './findings-list.component.html',
	styleUrls: ['./findings-list.component.scss']
})
export class FindingsListComponent implements OnInit,OnDestroy {
	@ViewChild('formModal') formModal: ElementRef;
	@ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
	@ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

	reactionDisposer: IReactionDisposer;
	FindingsStore = FindingsStore;
	SubMenuItemStore = SubMenuItemStore;
	fileUploadPopupStore = fileUploadPopupStore;
	AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_findings_message';

	findingsObject = {
		values: null,
		type: null
	};


	popupObject = {
		type: '',
		title: '',
		id: null,
		subtitle: ''
	};

	fileUploadPopupSubscriptionEvent: any ;
	controlFindingsSubscriptionEvent: any = null;
	popupControlFindingsEventSubscription: any;
	idleTimeoutSubscription: any;
	networkFailureSubscription: any;
	filterSubscription: Subscription = null;
	
	constructor(
		private _findingsService: FindingsService,
		private _utilityService: UtilityService,
		private _eventEmitterService: EventEmitterService,
		private _helperService: HelperServiceService,
		private _cdr: ChangeDetectorRef,
		private _renderer2: Renderer2,
		private _router: Router,
		private _fileUploadPopupService: FileUploadPopupService,
		private _rightSidebarFilterService: RightSidebarFilterService,
	) { }

	ngOnInit(): void {
		RightSidebarLayoutStore.showFilter = true;

		this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
		  this.FindingsStore.loaded = false;
		  this._utilityService.detectChanges(this._cdr);
		  this.pageChange(1);
		})
		AppStore.showDiscussion = false;
		NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_findings' });
		this.reactionDisposer = autorun(() => {

			var subMenuItems = [
				{ activityName: 'FINDINGS_LIST', submenuItem: { type: 'search' } },
				{ activityName: 'CREATE_FINDINGS', submenuItem: { type: 'new_modal' } },
				{ activityName: 'GENERATE_FINDINGS_TEMPLATE', submenuItem: { type: 'template' } },
				{ activityName: 'IMPORT_FINDINGS', submenuItem: { type: 'import' } },
				{ activityName: 'SHARE_FINDINGS', submenuItem: { type: 'share' } },
				{ activityName: 'EXPORT_FINDINGS', submenuItem: { type: 'export_to_excel' } },
				// { activityName: null, submenuItem: { type: 'close', path: 'bpm' } },
			]
			if (!AuthStore.getActivityPermission(100, 'CREATE_FINDINGS')) {
				NoDataItemStore.deleteObject('subtitle');
				NoDataItemStore.deleteObject('buttonText');
			}
			this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

			if (SubMenuItemStore.clikedSubMenuItem) {

				switch (SubMenuItemStore.clikedSubMenuItem.type) {
					case "new_modal":
						setTimeout(() => {
							this.addNewItem();
						}, 1000);
						break;
					case "template":
						this._findingsService.generateTemplate();
						break;
					case "export_to_excel":
						this._findingsService.exportToExcel();
						break;
					case "search":
						FindingsStore.searchText = SubMenuItemStore.searchText;
						this.pageChange(1);
						// this.searchFindings(SubMenuItemStore.searchText);
						break;
					case "share":
						ShareItemStore.setTitle('share_non_conformity_findings');
						ShareItemStore.formErrors = {};
						break;
					case "import":
						ImportItemStore.setTitle('import_non_conformity_findings');
						ImportItemStore.setImportFlag(true);
						break;
					default:
						break;
				}
				// Don't forget to unset clicked item immediately after using it
				SubMenuItemStore.unSetClickedSubMenuItem();
			}
			if (NoDataItemStore.clikedNoDataItem) {
				this.addNewItem();
				NoDataItemStore.unSetClickedNoDataItem();
			}
			if (ShareItemStore.shareData) {
				this._findingsService.shareData(ShareItemStore.shareData).subscribe(res => {
					ShareItemStore.unsetShareData();
					ShareItemStore.setTitle('');
					ShareItemStore.unsetData();
					$('.modal-backdrop').remove();
					document.body.classList.remove('modal-open');
					setTimeout(() => {
						$(this.mailConfirmationPopup.nativeElement).modal('show');
					}, 200);
				}, (error) => {
					if (error.status == 422) {
						ShareItemStore.processFormErrors(error.error.errors);
					}
					ShareItemStore.unsetShareData();
					this._utilityService.detectChanges(this._cdr);
					$('.modal-backdrop').remove();
					
				});
			}
			if (ImportItemStore.importClicked) {
				ImportItemStore.importClicked = false;
				this._findingsService.importData(ImportItemStore.getFileDetails).subscribe(res => {
					ImportItemStore.unsetFileDetails();
					ImportItemStore.setTitle('');
					ImportItemStore.setImportFlag(false);
					$('.modal-backdrop').remove();
					this._utilityService.detectChanges(this._cdr);
				}, (error) => {
					if (error.status == 422) {
						ImportItemStore.processFormErrors(error.error.errors);
					}
					else if (error.status == 500 || error.status == 403) {
						ImportItemStore.unsetFileDetails();
						ImportItemStore.setImportFlag(false);
						$('.modal-backdrop').remove();
					}
					this._utilityService.detectChanges(this._cdr);
				})
			}

		})

		this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
            this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
            this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
        })

		// for deleting/activating/deactivating using delete modal
		this.popupControlFindingsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

		// for closing the modal
		this.controlFindingsSubscriptionEvent = this._eventEmitterService.FindingsList.subscribe(res => {
			this.closeFormModal();
		})

		this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
			if (!status && $(this.formModal.nativeElement).hasClass('show')) {
				this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
				this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
			}
		})

		this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
			if (!status && $(this.formModal.nativeElement).hasClass('show')) {
				this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
				this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
			}
		})

		RightSidebarLayoutStore.filterPageTag = 'noc_findings';
		this._rightSidebarFilterService.setFiltersForCurrentPage([
		  'organization_ids',
		  'division_ids',
		  'department_ids',
		  'section_ids',
		  'sub_section_ids',
		  'finding_category_ids',
		  'risk_rating_ids',
		  'finding_status_ids'
		]);
		this.pageChange(1);
	}

	addNewItem() {
		this.findingsObject.type = 'Add';
		this.findingsObject.values = null; // for clearing the value
		this._utilityService.detectChanges(this._cdr);
		this.openFormModal();
	}

	pageChange(newPage: number = null) {
		if (newPage) FindingsStore.setCurrentPage(newPage);
		var additionalParams=''
        if (NonConformityDashboardStore.dashboardParam) {
        additionalParams = NonConformityDashboardStore.dashboardParam
        }
        this._findingsService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => 
        setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
	}

	gotToFindingsDetails(id: number) {
		this._router.navigateByUrl('/non-conformity/findings/' + id);
	}

	// openFormModal() {
	// 	// setTimeout(() => {
	// 	// 	$(this.formModal.nativeElement).modal('show');
	// 	// }, 50);
	// 	this._renderer2.addClass(this.formModal.nativeElement, 'show');
	// 	this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
	// 	this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
	// 	this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
	// }

	openFormModal() {
		setTimeout(() => {
		  $('.modal-backdrop').add();
		  document.body.classList.add('modal-open')
		  this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
		  this._renderer2.removeAttribute(this.formModal.nativeElement, 'aria-hidden');
		  setTimeout(() => {
			this._renderer2.addClass(this.formModal.nativeElement, 'show')
			this._utilityService.detectChanges(this._cdr)
		  }, 100);
		}, 250);
	  }
	

	closeFormModal() {
		// $(this.formModal.nativeElement).modal('hide');
		this.findingsObject.type = null;
		this._renderer2.addClass(this.formModal.nativeElement, 'show');
		this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '9999');
		this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
		this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
	}

	/**
	 * Get particular competency group item
	 * @param id  id of compliance type
	 */

	getFindings(id: number) {
		event.stopPropagation();
		// const businessApplications: Findings = FindingsStore.getFindingsById(id);
		this._findingsService.getItem(id).subscribe(res => {
			setTimeout(() => {
				if (res.documents.length > 0) {
					this.setDocuments(res.documents)
				}
			}, 200);
			this.findingsObject.values = {
				id: res.id,
				finding_category: res.finding_category,
				risk_rating: res.risk_rating,
				title: res.title,
				description: res.description,
				evidence: res.evidence,
				recommendation: res.recommendation,
				departments: res.departments,
				divisions: res.divisions,
				sections: res.sections,
				organizations: res.organizations,
				sub_sections: res.sub_sections,
				supplier: res.supplier,
				// branch_ids: res.branch_ids
				// documents:res.documents


			}
			this.findingsObject.type = 'Edit';
			this._utilityService.detectChanges(this._cdr)
			this.openFormModal();
		});
		//set form value
	}

	setDocuments(documents) {
		this.clearCommonFilePopupDocuments();
		let khDocuments = [];
		documents.forEach(element => {

			if (element.document_id) {
				// let doc = element;
				// doc['is_kh_document'] = true;
				// khDocuments.push(doc);
				// let doc2=element;
				// doc2['updateId'] = element.id;
				// fileUploadPopupStore.setUpdateFileArray(doc2)
				element.kh_document.versions.forEach(innerElement => {
				  if (innerElement.is_latest) {
					khDocuments.push({
					  ...innerElement,
					  title:element?.kh_document.title,
					  'is_kh_document': true
					})
					fileUploadPopupStore.setUpdateFileArray({
					  'updateId': element.id,
					  ...innerElement,
					})
				  }

				});
			}
			else {
				if (element && element.token) {
					var purl = this._findingsService.getThumbnailPreview('non-conformity-findings-document', element.token);
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
		// this.enableScrollbar();
	}

	clearCommonFilePopupDocuments() {
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
	}

	// modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteFindings(status)
				break;

			case 'Activate': this.activateFindings(status)
				break;

			case 'Deactivate': this.deactivateFindings(status)
				break;

		}
	}




	deleteFindings(status: boolean) {
		if (status && this.popupObject.id) {
			this._findingsService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.clearPopupObject();
				this.pageChange(1);
			});
		}
		else {
			this.clearPopupObject();
		}
		setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
		}, 250);
		// this.pageChange();
	}

	closeConfirmationPopUp() {
		$(this.confirmationPopUp.nativeElement).modal('hide');
		this._utilityService.detectChanges(this._cdr);
	}

	// for popup object clearing
	clearPopupObject() {
		this.popupObject.id = null;
		// this.popupObject.title = '';
		// this.popupObject.subtitle = '';
		// this.popupObject.type = '';
	}

	// calling activcate function
	activateFindings(status: boolean) {
		if (status && this.popupObject.id) {

			this._findingsService.activate(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.clearPopupObject();
			});
		}
		else {
			this.clearPopupObject();
		}
		setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
		}, 250);

	}

	// calling deactivate function
	deactivateFindings(status: boolean) {
		if (status && this.popupObject.id) {

			this._findingsService.deactivate(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.clearPopupObject();
			});
		}
		else {
			this.clearPopupObject();
		}
		setTimeout(() => {
			$(this.confirmationPopUp.nativeElement).modal('hide');
		}, 250);

	}

	// for activate 
	activate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Activate';
		this.popupObject.id = id;
		this.popupObject.title = 'Activate Findings?';
		this.popupObject.subtitle = 'common_activate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate Findings?';
		this.popupObject.subtitle = 'common_deactivate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete Findings?';
		this.popupObject.subtitle = 'it_will_remove_finding_from_the_list';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}
	// for sorting
	sortTitle(type: string) {
		// FindingsStore.setCurrentPage(1);
		this._findingsService.sortFindingsList(type, null);
		this.pageChange();
	}

	// Sub-Menu Search 
	searchFindings(term: string) {
		this._findingsService.getItems(false, `&q=${term}`).subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	ngOnDestroy() {
		// Don't forget to dispose the reaction in ngOnDestroy. This is very important!
		if (this.reactionDisposer) this.reactionDisposer();
		SubMenuItemStore.makeEmpty();
		FindingsStore.searchText = '';
		FindingsStore.unsetFindings();
		this.controlFindingsSubscriptionEvent.unsubscribe();
		this.popupControlFindingsEventSubscription.unsubscribe();
		this.idleTimeoutSubscription.unsubscribe();
		this.networkFailureSubscription.unsubscribe();
		this._rightSidebarFilterService.resetFilter();
		this.filterSubscription.unsubscribe();
		this.fileUploadPopupSubscriptionEvent.unsubscribe();
		RightSidebarLayoutStore.showFilter = false;
	}

}
