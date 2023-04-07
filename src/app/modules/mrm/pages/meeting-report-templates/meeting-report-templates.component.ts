import { Component, OnDestroy, OnInit } from '@angular/core';
import { MeetingReportTemeplates } from 'src/app/stores/mrm/meeting-report-templates/meeting-report-templates';

@Component({
  selector: 'app-meeting-report-templates',
  templateUrl: './meeting-report-templates.component.html',
  styleUrls: ['./meeting-report-templates.component.scss']
})
export class MeetingReportTemplatesComponent implements OnInit,OnDestroy {

  MeetingReportTemeplates=MeetingReportTemeplates;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    MeetingReportTemeplates.unsetMeetingReportTemplatesList();
  }

}
