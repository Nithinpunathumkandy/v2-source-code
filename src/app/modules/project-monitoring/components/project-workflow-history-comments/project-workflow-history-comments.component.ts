import { Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-project-workflow-history-comments',
  templateUrl: './project-workflow-history-comments.component.html',
  styleUrls: ['./project-workflow-history-comments.component.scss']
})
export class ProjectWorkflowHistoryCommentsComponent implements OnInit {
  @Input('source') commentSource: any;
  AppStore = AppStore

  constructor(private _eventEmitterService:EventEmitterService,) { }

  ngOnInit(): void {
  }

  cancel(){
   this._eventEmitterService.dismissProjectMonitorHistoryCommentModal()
  }

}
