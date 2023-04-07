import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from "src/app/shared/services/utility.service";

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
  @Input ('source') deleteObject: any;
  AppStore = AppStore;
  constructor(private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService) { }

  ngOnInit(): void {
    AppStore.confirmationLoading = false;
  }


  disabledButtons = [];
  disableButton(button: any) {
    this.disabledButtons.push(button);
    setTimeout(() => {
      this.disabledButtons.splice(this.disabledButtons.indexOf(button));
    }, 2000);
  }

  dismissModal(status){
    if(status) AppStore.confirmationLoading = true;
    this._utilityService.detectChanges(this._cdr);
    this._eventEmitterService.dismissDeletePopup(status);
  }

  getLowerCase(text){
    if(text == '')
      return 'delete';
    else if(text) return text.toLowerCase();
  }

  getButtonText(type){
    switch(type){
      case 'Confirm' : return 'yes_confirm_it';
      case 'Cancel': return 'yes_cancel_it';
      case 'Delete': return 'yes_delete_it';
      case '': return 'yes_delete_it';
      case 'Activate': return 'yes_activate_it';
      case 'Deactivate': return 'yes_deactivate_it';
      case 'Publish': return 'yes_publish';
      case 'is_attending': return 'yes_is_attending';
      case 'is_may_be': return 'yes_is_may_be';
      case 'is_not_attending': return 'yes_submit';
      case 'is_pending': return 'yes_is_pending';
      case 'are_you_sure_delete': return 'yes_delete_it';
      case 'are_you_sure': return 'yes_delete_it';
      case 'are_you_sure_confirm': return 'yes_confirm_it';
      case 'partcipant_cancel': return 'yes_cancel_it';
      case 'reject' : return 'yes_reject';
      case 'submit' : return 'yes_submit';
      case 'approve' : return 'yes_confirm_it';
      case 'accept' : return 'yes_confirm_it';
      case 'Passivate' : return 'yes_passivate_it';
      case 'Close' : return 'yes_close_it';
      case 'complete' : return 'yes_complete_it';
    }
  }

  getCancelButtonText(type){
    if(type == 'Cancel'){
      return 'keep_it';
    }
    else{
      return 'no_cancel'
    }
  }

}
