import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import{MeetingPlanStore} from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { exit } from 'process';

@Component({
  selector: 'app-agenda-recursive-modal',
  templateUrl: './agenda-recursive-modal.component.html',
  styleUrls: ['./agenda-recursive-modal.component.scss']
})
export class AgendaRecursiveModalComponent implements OnInit {

  @Input('details') items: any;

  MeetingPlanStore = MeetingPlanStore;
  
  constructor() { }

  ngOnInit(): void {
  }


}
