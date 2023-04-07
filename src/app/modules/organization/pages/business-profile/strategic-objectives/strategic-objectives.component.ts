import { Component, OnInit , ChangeDetectorRef , Renderer2 , ViewChild , ElementRef, OnDestroy  } from '@angular/core';
import { StrategicObjectivesMasterStore } from 'src/app/stores/masters/risk-management/strategic-objectives-store';
import { Strategic } from 'src/app/core/models/masters/risk-management/strategic-objectives';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategicObjectivesService } from 'src/app/core/services/masters/risk-management/strategic-objectives/strategic-objectives.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { ImportItemStore } from "src/app/stores/general/import-item.store";
import * as introJs from 'intro.js/intro.js'; // importing introjs library
@Component({
  selector: 'app-strategic-objectives',
  templateUrl: './strategic-objectives.component.html',
  styleUrls: ['./strategic-objectives.component.scss']
})
export class StrategicObjectivesComponent implements OnInit,OnDestroy {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  strategicObjectiveObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    position: null
  };

  reactionDisposer: IReactionDisposer;
  StrategicObjectivesMasterStore = StrategicObjectivesMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_strategic_objectives_message';

  strategicSubscriptionEvent: any = null;
  popupControlStrategicEventSubscription: any;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  selectedId = 0;
  searchElement: HTMLElement = null;
  searchElementSmall: HTMLElement = null;

  introButtonSubscriptionEvent: any = null;
  introSteps = [
    {
      element: '#search_bar',
      intro: 'Strategic Objectives Search',
      position: 'bottom'
    },
    {
      element: '#new_modal',
      intro: 'Add New Strategic Objectives',
      position: 'bottom'
    },
    {
      element: '#template',
      intro: 'Download Template',
      position: 'bottom'
    },
    {
      element: '#export_to_excel',
      intro: 'Export Strategic Objectives List',
      position: 'bottom'
    },
    {
      element: '#share',
      intro: 'Share Strategic Objectives',
      position: 'bottom'
    },
    {
      element: '#import',
      intro: 'Import Business Application List',
      position: 'bottom'
    },
  ]

  constructor(
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _strategicObjectivesService:StrategicObjectivesService
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_strategic_objectives'});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'STRATEGIC_OBJECTIVE_LIST', submenuItem: { type: 'search' }},
        {activityName: 'CREATE_STRATEGIC_OBJECTIVE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_STRATEGIC_OBJECTIVE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_STRATEGIC_OBJECTIVE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_STRATEGIC_OBJECTIVE', submenuItem: {type: 'share'}},
        {activityName: 'IMPORT_STRATEGIC_OBJECTIVE', submenuItem: {type: 'import'}},
        // {activityName: null, submenuItem: {type: 'close', path: 'risk-management'}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_RISK_AREA')){
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
                this._strategicObjectivesService.generateTemplate();
                break;
              case "export_to_excel":
                this._strategicObjectivesService.exportToExcel();
                break;
              case "search":
                StrategicObjectivesMasterStore.searchText = SubMenuItemStore.searchText;
                this.pageChange(1);
                break;
              case "share":
                ShareItemStore.setTitle('share_strategic_objectives_title');
                ShareItemStore.formErrors = {};
                break;
              case "import":
                ImportItemStore.setTitle('import_strategic_objectives');
                ImportItemStore.setImportFlag(true);
                break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            this.addNewItem();
            NoDataItemStore.unSetClickedNoDataItem();
          }
           if(ShareItemStore.shareData){
             this._strategicObjectivesService.shareData(ShareItemStore.shareData).subscribe(res=>{
                 ShareItemStore.unsetShareData();
                 ShareItemStore.setTitle('');
                 ShareItemStore.unsetData();
                 $('.modal-backdrop').remove();
                 document.body.classList.remove('modal-open');
                 setTimeout(() => {
                   ($(this.mailConfirmationPopup.nativeElement)as any).modal('show');              
                 }, 200);
             },(error)=>{
               if(error.status == 422){
                 ShareItemStore.processFormErrors(error.error.errors);
               }
               ShareItemStore.unsetShareData();
               this._utilityService.detectChanges(this._cdr);
               $('.modal-backdrop').remove();
              //  console.log(error);
             });
           }
          
           if(ImportItemStore.importClicked){
             ImportItemStore.importClicked = false;
             this._strategicObjectivesService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
               ImportItemStore.unsetFileDetails();
               ImportItemStore.setImportFlag(false);
               $('.modal-backdrop').remove();
               this._utilityService.detectChanges(this._cdr);
             },(error)=>{
               if(error.status == 422){
                 ImportItemStore.processFormErrors(error.error.errors);
               }
               else if(error.status == 500 || error.status == 403){
                 ImportItemStore.unsetFileDetails();
                 ImportItemStore.setImportFlag(false);
                 $('.modal-backdrop').remove();
               }
               this._utilityService.detectChanges(this._cdr);
             })
           }
        })

        // this.subscription = this._policyService.itemChange.subscribe(item=>{
        //   this.setSelected(item);
        // });

         // for deleting/activating/deactivating using delete modal
       this.popupControlStrategicEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
         this.modalControl(item);
       })
       this.strategicSubscriptionEvent = this._eventEmitterService.strategicObjectives.subscribe(res => {
         this.closeFormModal();
       })

      //  setTimeout(() => {
      //   this.searchElement = document.getElementById('search');
      //   if(this.searchElement) this.searchElement.classList.add('new-search-v2-small');
      //  }, 500);


     this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
       if(!status && $(this.formModal.nativeElement).hasClass('show')){
         this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
         this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
       }
     })

     this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
       if(!status && $(this.formModal.nativeElement).hasClass('show')){
         this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
         this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
       }
     })

     this.introButtonSubscriptionEvent = this._eventEmitterService.introButtonClickedEvent.subscribe(res=>{
      this.showIntro();
    })


    this.pageChange(1);
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

  ngAfterViewInit(){
    setTimeout(() => {
      this.searchElementSmall = document.getElementById('search_bar_small');
      if(this.searchElementSmall) this.searchElementSmall.classList.add('new-search-v2-small');
      this.searchElement = document.getElementById('search_bar');
      if(this.searchElement) this.searchElement.classList.add('new-search-v2-small');
     }, 500);
  }

  setSelected(id){
    this.selectedId = id;
  }

  pageChange(newPage: number = null) {
    if (newPage) StrategicObjectivesMasterStore.setCurrentPage(newPage);
    this._strategicObjectivesService.getItems(false,null,true).subscribe((res) => {
      if(res.data.length > 0) this.selectedId = res.data[0].id;
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100)
    });
  }

  addNewItem(){
    this.strategicObjectiveObject.type = 'Add';
    this.strategicObjectiveObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  getRiskSource(id){
    this._strategicObjectivesService.getItem(id).subscribe(res=>{
      this.loadPopup();
      this._utilityService.detectChanges(this._cdr);
  })
  }

  loadPopup(){
    const strategicSingle: Strategic = StrategicObjectivesMasterStore.individualKeyRiskId;        
    this.strategicObjectiveObject.values = {
      id: strategicSingle.id,
      title: strategicSingle.title,
      description: strategicSingle.description,
      organization_ids:strategicSingle.organizations ? this._helperService.getArrayProcessed(strategicSingle.organizations,null) : [],
      division_ids:strategicSingle.divisions ? this._helperService.getArrayProcessed(strategicSingle.divisions,null) : [],
      branch_ids:strategicSingle.branches ? this._helperService.getArrayProcessed(strategicSingle.branches,null) : [],
      department_ids:strategicSingle.departments? this._helperService.getArrayProcessed(strategicSingle.departments,null) : [],
      section_ids:strategicSingle.sections ? this._helperService.getArrayProcessed(strategicSingle.sections,null) : [],
      sub_section_ids:strategicSingle.sub_sections ? this._helperService.getArrayProcessed(strategicSingle.sub_sections,null) : [],
    }
    this.strategicObjectiveObject.type = 'Edit';
    this.openFormModal();       
  }

  getEdit(data){
    var returnData = []
      
      data.forEach(element => {
        returnData.push(element.id)
      });
      return returnData;
  }

  openFormModal() {
    setTimeout(() => {
      ($(this.formModal.nativeElement)as any).modal('show');
    }, 50);
  }

  closeFormModal() {
    ($(this.formModal.nativeElement)as any).modal('hide');
    this.strategicObjectiveObject.type = null;
  }

  delete(id: number,position: number) {
    // event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Strategic Objectives?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this.popupObject.position = position;
    ($(this.confirmationPopUp.nativeElement)as any).modal('show');
  
  }

  // delete function call
  deleteStrategicObjectives(status: boolean) {
    if (status && this.popupObject.id) {
      this._strategicObjectivesService.delete(this.popupObject.id,this.popupObject.position).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      },(error=>{
        if(error.status == 405 && StrategicObjectivesMasterStore.getStrategicById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
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

  closeConfirmationPopUp(){
    ($(this.confirmationPopUp.nativeElement)as any).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }
  
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
  }

  // calling activcate function
  
  activateStrategicObjectives(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._strategicObjectivesService.activate(this.popupObject.id).subscribe(resp => {
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
      ($(this.confirmationPopUp.nativeElement)as any).modal('hide');
    }, 250);
  
  }
  
  // calling deactivate function
  
  deactivateStrategicObjectives(status: boolean) {
    if (status && this.popupObject.id) {
  
      this._strategicObjectivesService.deactivate(this.popupObject.id).subscribe(resp => {
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
      ($(this.confirmationPopUp.nativeElement)as any).modal('hide');
    }, 250);
  
  }

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteStrategicObjectives(status)
      break;
      
      case 'Activate': this.activateStrategicObjectives(status)
        break;
  
      case 'Deactivate': this.deactivateStrategicObjectives(status)
        break;
  
    }
  
  }

  activate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate Risk Source?';
    this.popupObject.subtitle = 'common_activate_subtitle';
  
    ($(this.confirmationPopUp.nativeElement)as any).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    // event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate Risk Source?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
  
    ($(this.confirmationPopUp.nativeElement)as any).modal('show');
  }

  sortTitle(type: string) {
    StrategicObjectivesMasterStore.setCurrentPage(1);
    this._strategicObjectivesService.sortStrategicObjectives(type, null);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.strategicSubscriptionEvent.unsubscribe();
    this.popupControlStrategicEventSubscription.unsubscribe();
    StrategicObjectivesMasterStore.searchText = '';
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    if(this.searchElement) this.searchElement.classList.remove('new-search-v2-small');
    if(this.searchElementSmall) this.searchElementSmall.classList.remove('new-search-v2-small');
    this.introButtonSubscriptionEvent.unsubscribe();
  }

}
