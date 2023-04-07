import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { StrategyManagementSettingsServiceService } from 'src/app/core/services/settings/organization_settings/strategy-management-settings/strategy-management-settings-service.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { OrganizationLevelSettingsStore } from 'src/app/stores/settings/organization-level-settings.store';
import { StrategyMappingStore } from 'src/app/stores/strategy-management/strategy-mapping.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;

@Component({
  selector: 'app-strategy-mapping-profile-info',
  templateUrl: './strategy-mapping-profile-info.component.html',
  styleUrls: ['./strategy-mapping-profile-info.component.scss']
})
export class StrategyMappingProfileInfoComponent implements OnInit {

  @Input('source') strategyAreaSource: any;
  @ViewChild('historyPopup') historyPopup: ElementRef;

  AppStore = AppStore
  AuthStore = AuthStore
  StrategyStore = StrategyStore
  StrategyMappingStore = StrategyMappingStore
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore

  swot_availability:Boolean = false;
  pestel_availabale:Boolean = false;

  historyObject = {
    type: null,
    value: null,
    id:null
  }

  confirmationEventSubscription: any;
  notesModalEventSubscription: any;
  historyModalEventSubscription : any;

  constructor(private _helperService: HelperServiceService,private _route: Router,private _imageService:ImageServiceService,
    private _strategyService : StrategyService,private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,private _humanCapitalService:HumanCapitalService,
    private _strategyManagementService:StrategyManagementSettingsServiceService) { }

  ngOnInit(): void {
    this.historyModalEventSubscription = this._eventEmitterService.profileHistoryModalControl.subscribe(item => {
      this.closeHistoryModal();
    })
    this.getProfileDetails();
    this.getNotes();
    this.getStrategySettingsDetails();
  }

  getProfileDetails(){
    this._strategyService.getItem(this.strategyAreaSource.id).subscribe(()=>{
      StrategyStore.start_date = this._helperService.processDate(StrategyStore.induvalStrategyProfile?.start_date, 'split');
      StrategyStore.end_date = this._helperService.processDate(StrategyStore.induvalStrategyProfile?.end_date, 'split')
      this._utilityService.detectChanges(this._cdr)
    })
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

  cancel(){
    this._eventEmitterService.dismissStrategyMappingprofilePopup();
  }

  selectedNote(mIndex,id){
    this.swot_availability = false
    this.pestel_availabale = false
    StrategyStore.setNotes = mIndex
    this.getNoteDetails(id);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
}

}
