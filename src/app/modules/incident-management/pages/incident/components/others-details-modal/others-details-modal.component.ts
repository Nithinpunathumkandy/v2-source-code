import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
declare var $: any;

@Component({
  selector: 'app-others-details-modal',
  templateUrl: './others-details-modal.component.html',
  styleUrls: ['./others-details-modal.component.scss']
})
export class OthersDetailsModalComponent implements OnInit {
  @Input ('source') otherUsers: any;
  @ViewChild('confirmationPopUps') confirmationPopUps: ElementRef;

  AppStore = AppStore;
  popupControlEventSubscription: any;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };



  constructor(private _eventEmitterService: EventEmitterService,
              private _incidentService : IncidentService, private _investigationService : InvestigationService,
              private  _cdr: ChangeDetectorRef, 
              private _utilityService: UtilityService
    ) { }

  ngOnInit(): void {
    // this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
    //   this.modalControl(item);
    // })
  }

  cancel() {
    this._eventEmitterService.dismissOtherUsersModalControl();
  }
  // modalControl(status: boolean) {
  //   switch (this.popupObject.type) {
  //     case 'involvedOther': 
  //     this._investigationService.deleteInvestigationInvolvedOtherUser(this.popupObject.id)
  //       break;
  //   }

  // }

  // deleteIncident(status: boolean) {
  //   if (status && this.popupObject.id) {
      
  //     this._investigationService.deleteInvestigationInvolvedOtherUser(this.popupObject.id).subscribe(resp => {
  //       setTimeout(() => {
  //         this._utilityService.detectChanges(this._cdr);
  //       }, 500);
  //       this._utilityService.detectChanges(this._cdr)
  //       this.clearPopupObject();
  //     });
  //   }
  //   else {
  //     this.clearPopupObject();
  //   }
  //   setTimeout(() => {
  //     $(this.confirmationPopUps.nativeElement).modal('hide');
  //   }, 250);

  // }

  // clearPopupObject() {
  //   this.popupObject.id = null;
  //   this.popupObject.title = '';
  //   this.popupObject.subtitle = '';
  //   this.popupObject.type = '';
  // }

  // deletePerson(data){

  // }

  // delete(){

  // }

}
