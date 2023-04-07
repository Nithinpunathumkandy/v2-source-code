
import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;

@Component({
  selector: 'app-strategy-info',
  templateUrl: './strategy-info.component.html',
  styleUrls: ['./strategy-info.component.scss']
})
export class StrategyInfoComponent implements OnInit {
  @ViewChild('noteModal') noteModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('historyPopup') historyPopup: ElementRef;

  AppStore = AppStore
  AuthStore = AuthStore
  StrategyStore = StrategyStore
  StrategyMappingStore = StrategyMappingStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  reactionDisposer: IReactionDisposer;
  
  swot_availability:Boolean = false;
  pestel_availabale:Boolean = false;

  noteObject = {
    type: null,
    value: null,
    id:null
  }
  deleteObjects = {
    id: null,
    title: '',
    type: '',
    subtitle:''
  };
  historyObject = {
    type: null,
    value: null,
    id:null
  }

  // subscriptions
  confirmationEventSubscription: any;
  notesModalEventSubscription: any;
  historyModalEventSubscription : any;

  constructor(private _helperService: HelperServiceService,private _router: ActivatedRoute,private _route: Router,
    private _strategyService : StrategyService,private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,private _eventEmitterService: EventEmitterService,
    private _strategyManagementService:StrategyManagementSettingsServiceService) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {      
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
            this.editStrategyProfile();
            break;
          case "history":
            this.openHistoryModal();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      } 
    });
    SubMenuItemStore.setSubMenuItems([
      { type: "edit_modal" },
      { type: "history" },
      {type: "close", path: StrategyMappingStore.componentFrom ? '../../strategy-mappings/'+StrategyStore._strategyProfileId : "../"}
    ]);
    this.confirmationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })
    this.notesModalEventSubscription = this._eventEmitterService.notesModal.subscribe(item => {
      this.closeNoteModal();
      this.getNotes();
    })
    this.historyModalEventSubscription = this._eventEmitterService.profileHistoryModalControl.subscribe(item => {
      this.closeHistoryModal();
    })
    this.getNotes();
    this.getStrategySettingsDetails();
  }


  getNotes(){
    this._strategyService.strategyProfileNotsList().subscribe(res=>{
      if(res.data && res.data.length!=0){
        this.getNoteDetails(res.data[0].id)
        StrategyStore.setNotes = 0
      }
    })
  }

  getNoteDetails(id){
    this._strategyService.getInduvalNote(id).subscribe(res=>{
      if(res&&res.category.length!=0){
        StrategyStore.noteDetails.category.forEach(element => {
          if(element.is_swot&&element.is_swot==1){
            this.swot_availability = true;
          }
          if(element.is_pestel&&element.is_pestel==1){
            this.pestel_availabale = true
          }
        });
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getStrategySettingsDetails(){
    this._strategyManagementService.getItems().subscribe(()=>this._utilityService.detectChanges(this._cdr))
  }

  // History Modal
  openHistoryModal() {
    // this.historyPageChange(1);
    this.historyObject.type = "Profile";
    this.historyObject.id = StrategyStore.induvalStrategyProfile?.id;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('show');
    }, 200);
    this._utilityService.detectChanges(this._cdr);
  }

  closeHistoryModal() {
    this.historyObject.type = null;
    this.historyObject.id = null;
    setTimeout(() => {
      $(this.historyPopup.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 200);
    StrategyStore.unsetHistory();
  }

  getFormattedDate(date){
    return this._helperService.processDate(date,'join');
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.department?.title ? user.department?.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }

  editStrategyProfile(){
    event.stopPropagation();
    StrategyStore.lastPage= 'details';
    this._strategyService.getItem(StrategyStore._strategyProfileId).subscribe(res=>{
      this._route.navigateByUrl('strategy-management/strategy-profiles/edit');
      this._utilityService.detectChanges(this._cdr)
    });

  }

  selectedNote(mIndex,id){
    this.swot_availability = false
    this.pestel_availabale = false
    StrategyStore.setNotes = mIndex
    this.getNoteDetails(id);
  }

  editNotes(id){
    let notes 
    let noteArray = []
    this.noteObject.id = id
    this._strategyService.getInduvalNote(id).subscribe(res=>{
      notes = res;
      for (let i = 0; i < notes.category.length; i++) {
          for (let k = 0; k < notes.category[i].issue.length; k++) {
            if(notes.category[i].is_pestel == 1 || notes.category[i].is_swot == 1){
              noteArray.push(notes.category[i].issue[k])
            }
          }
        
      }
      this.noteObject.value = {
        title : notes.title,
        organization_issue_ids : noteArray
        
      }
      this.noteObject.type = 'edit'
      this.openNoteModalPopup();
      this._utilityService.detectChanges(this._cdr);

    }) 
   }

   openNoteModal(){
    this.noteObject.type = 'Add';
    this.openNoteModalPopup()

  }

  openNoteModalPopup(){
    // $(this.noteModal.nativeElement).modal('show');
    this._renderer2.addClass(this.noteModal.nativeElement,'show');
    this._renderer2.setStyle(this.noteModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.noteModal.nativeElement,'z-index',99999);
    this._renderer2.setStyle(this.noteModal.nativeElement,'overflow','auto');
  }

  closeNoteModal(){
    this.noteObject.type = null;
    // this.selectedNoteTab = 0;
    // $(this.noteModal.nativeElement).modal('hide');
    this._renderer2.removeClass(this.noteModal.nativeElement,'show');
    this._renderer2.setStyle(this.noteModal.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }

  deleteProfileNotes(id){//delete
    this.deleteObjects.id = id;
    this.deleteObjects.title = 'notes';
    this.deleteObjects.type = '';
    this.deleteObjects.subtitle = "Are you sure want to Delete"
   setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('show');

   }, 250);
  }
  
  delete(status) {//delete
    let deleteId = [];
    let deleteData;

    if (status && this.deleteObjects.id) {  
      switch(this.deleteObjects.title){
        case 'notes':
              deleteData = this._strategyService.deleteNotes(this.deleteObjects.id);
          break;
      }

      deleteData.subscribe(resp => {
        if(this.deleteObjects.title == 'notes'){
          this.getNotes();
        }
          this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      });
    }
    else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  
  }

  clearDeleteObject() {//delete
    this.deleteObjects.id = null;
  }

  assignUserValues(user) {
    if (user) {
      var userInfoObject = {
        first_name: '',
        last_name: '',
        designation: '',
        image_token: '',
        mobile: null,
        email: '',
        id: null,
        department: '',
        status_id: null
      }

      userInfoObject.first_name = user?.first_name;
      userInfoObject.last_name = user?.last_name;
      userInfoObject.designation = user?.designation?.title;
      userInfoObject.image_token = user?.image_token;
      userInfoObject.email = user?.email;
      userInfoObject.mobile = user?.mobile;
      userInfoObject.id = user?.id;
      userInfoObject.status_id = user?.status_id
      userInfoObject.department = user?.department?.title;
      return userInfoObject;
    }
  }

  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.swot_availability = false;
    this.pestel_availabale = false
    this.confirmationEventSubscription.unsubscribe();
    this.notesModalEventSubscription.unsubscribe();
    this.historyModalEventSubscription.unsubscribe();
  }

}
