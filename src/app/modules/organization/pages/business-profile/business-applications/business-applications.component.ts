import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessApplicationsService } from 'src/app/core/services/masters/bcm/business-applications/business-applications.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BusinessApplicationsMasterStore } from 'src/app/stores/masters/bcm/business-applications.master.store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import * as introJs from 'intro.js/intro.js'; // importing introjs library
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;

@Component({
  selector: 'app-business-applications',
  templateUrl: './business-applications.component.html',
  styleUrls: ['./business-applications.component.scss']
})
export class BusinessApplicationsComponent implements OnInit,OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  reactionDisposer: IReactionDisposer;
  controlBusinessApplicationsSubscriptionEvent: any;
  popupControlBusinessApplicationsEventSubscription:any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;

  BusinessApplicationsMasterStore = BusinessApplicationsMasterStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  AuthStore = AuthStore;
	AppStore = AppStore;
	mailConfirmationData = 'share_business_application_message';
  
  businessApplicationsObject = {
    component: 'Master',
    values: null,
    type: null
  };
 
	popupObject = {
		type: '',
		title: '',
		id: null,
		subtitle: ''
	};
  searchElement: HTMLElement = null;
  searchElementSmall: HTMLElement = null;

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#search_bar',
      intro: 'Business Application Search',
      position: 'bottom'
    },
    {
      element: '#new_modal',
      intro: 'Add New Business Application',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Business Application List',
      position: 'bottom'
    },
    {
      element: '#share',
      intro: 'Share Business Application',
      position: 'bottom'
    },
    {
      element: '#import',
      intro: 'Import Business Application List',
      position: 'bottom'
    },
  ]
  initialLoad: boolean = false;
  constructor(
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _businessApplicationsService: BusinessApplicationsService,
    private _renderer2: Renderer2, private _imageService: ImageServiceService

  ) { }

  ngOnInit(): void {
    RightSidebarLayoutStore.showFilter = false;
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_business_application' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'BUSINESS_APPLICATION_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_BUSINESS_APPLICATION', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_BUSINESS_APPLICATION_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_BUSINESS_APPLICATION', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'SHARE_BUSINESS_APPLICATION', submenuItem: { type: 'share' } },
        { activityName: 'IMPORT_BUSINESS_APPLICATION', submenuItem: { type: 'import' } },
      ]
      if (!AuthStore.getActivityPermission(100, 'CREATE_BUSINESS_APPLICATION')) {
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }

      if(AuthStore.userPermissionsLoaded){
        this.introSteps = this._helperService.checkIntroItemPermissions(subMenuItems,this.introSteps);
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
            this._businessApplicationsService.generateTemplate();
            break;
          case "export_to_excel":
            this._businessApplicationsService.exportToExcel();
            break;
          case "search":
            BusinessApplicationsMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.searchBusinessApplication(SubMenuItemStore.searchText);
            break;
          case "share":
            ShareItemStore.setTitle('share_business_applications');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_business_applications');
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
        this._businessApplicationsService.shareData(ShareItemStore.shareData).subscribe(res => {
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
          // console.log(error);
        });
      }
      if (ImportItemStore.importClicked) {
        ImportItemStore.importClicked = false;
        this._businessApplicationsService.importData(ImportItemStore.getFileDetails).subscribe(res => {
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

    // for deleting/activating/deactivating using delete modal
		this.popupControlBusinessApplicationsEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
			this.modalControl(item);
		})

    // for closing the modal
    this.controlBusinessApplicationsSubscriptionEvent = this._eventEmitterService.businessApplications.subscribe(res => {
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

    this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })

    this.pageChange();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.searchElementSmall = document.getElementById('search_bar_small');
      if(this.searchElementSmall) this.searchElementSmall.classList.add('new-search-v2-small');
      this.searchElement = document.getElementById('search_bar');
      if(this.searchElement) this.searchElement.classList.add('new-search-v2-small');
     }, 500);
  }

  showIntro(){
    var intro:any = introJs();
    intro.setOptions({
      steps: this.introSteps,
      showBullets: true,
      showButtons: true,
      exitOnOverlayClick: true,
      keyboardNavigation: true,
      nextLabel: 'Next',
      prevLabel: 'Back',
      doneLabel: 'Done',
      nextToDone: true,
      hidePrev: true,
    });
    intro.start();
  }

  addNewItem() {
    this.businessApplicationsObject.type = 'Add';
    this.businessApplicationsObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) BusinessApplicationsMasterStore.setCurrentPage(newPage);
    this._businessApplicationsService.getItems(false, null, true).subscribe(() => {this.initialLoad = true; setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)}) 
  }
  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.businessApplicationsObject.type = null;
  }

  applicationAccordianClick(index) {
    this.initialLoad = false;
    BusinessApplicationsMasterStore.businessApplications.map((e:any,pos) => {
      if(pos == index) e['is_accordion_active'] = !e["is_accordion_active"];
      else e['is_accordion_active'] = false
    });
    // let application = BusinessApplicationsMasterStore.businessApplications
    // for (let i = 0; i < application.length; i++) {
    //   const element = application[i];
    //   if (i == index) {
    //     element["is_accordion_active"] = !element["is_accordion_active"]
    //   } else {
    //     element["is_accordion_active"] = false
    //   }
    // }
  }

  createImageUrl(token?, h?, w?) {

    return this._businessApplicationsService.getThumbnailPreview(token, h, w);
  }

  getBusinessApplications(id: number) {
		// const businessApplications: BusinessApplications = BusinessApplicationsMasterStore.getBusinessApplicationsById(id);
		this._businessApplicationsService.getItem(id).subscribe((res: any) => {
			this.businessApplicationsObject.values = {
				id: res.id,
				title: res.title,
				description: res.description,
				business_application_type_id: res.businessApplicationType.id,
				business_application_type_title: res.business_application_type_title,
				supplier_id: res.supplier.id,
				supplier_title: res.supplier.title,
				quantity: res.quantity,
				is_amc: res.is_amc,
				amc_start: res.amc_start,
				amc_end: res.amc_end

			}
			this.businessApplicationsObject.type = 'Edit';
			this._utilityService.detectChanges(this._cdr)
			this.openFormModal();
			// console.log(res)
		});
		//set form value
	}

  // modal control event
	modalControl(status: boolean) {
		switch (this.popupObject.type) {
			case '': this.deleteBusinessApplication(status)
				break;

			case 'Activate': this.activateBusinessApplication(status)
				break;

			case 'Deactivate': this.deactivateBusinessApplication(status)
				break;

		}

	}

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }
  
	// delete function call
	deleteBusinessApplication(status: boolean) {
		if (status && this.popupObject.id) {
			this._businessApplicationsService.delete(this.popupObject.id).subscribe(resp => {
				setTimeout(() => {
					this._utilityService.detectChanges(this._cdr);
				}, 500);
				this.closeConfirmationPopUp();
				this.clearPopupObject();
			}, (error => {
				if (error.status == 405 && BusinessApplicationsMasterStore.getBusinessApplicationsById(this.popupObject.id).status_id == AppStore.activeStatusId) {
					let id = this.popupObject.id;
					this.closeConfirmationPopUp();
					this.clearPopupObject();
					setTimeout(() => {
						this.deactivate(id);
						this._utilityService.detectChanges(this._cdr);
					}, 500);
				}
				else {
					this.closeConfirmationPopUp();
					this.clearPopupObject();
				}
			})
			);
		}
		else {
			this.closeConfirmationPopUp();
			this.clearPopupObject();
		}
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
	activateBusinessApplication(status: boolean) {
		if (status && this.popupObject.id) {

			this._businessApplicationsService.activate(this.popupObject.id).subscribe(resp => {
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
	deactivateBusinessApplication(status: boolean) {
		if (status && this.popupObject.id) {

			this._businessApplicationsService.deactivate(this.popupObject.id).subscribe(resp => {
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
		this.popupObject.title = 'Activate business application?';
		this.popupObject.subtitle = 'common_activate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for deactivate
	deactivate(id: number) {
		// event.stopPropagation();
		this.popupObject.type = 'Deactivate';
		this.popupObject.id = id;
		this.popupObject.title = 'Deactivate business application?';
		this.popupObject.subtitle = 'common_deactivate_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');
	}
	// for delete
	delete(id: number) {
		// event.stopPropagation();
		this.popupObject.type = '';
		this.popupObject.id = id;
		this.popupObject.title = 'Delete business application?';
		this.popupObject.subtitle = 'common_delete_subtitle';

		$(this.confirmationPopUp.nativeElement).modal('show');

	}

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.controlBusinessApplicationsSubscriptionEvent.unsubscribe();
    if(this.searchElement) this.searchElement.classList.remove('new-search-v2-small');
    if(this.searchElementSmall) this.searchElementSmall.classList.remove('new-search-v2-small');
    BusinessApplicationsMasterStore.searchText = '';
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.introButtonSubscriptionEvent.unsubscribe();
  }


}
