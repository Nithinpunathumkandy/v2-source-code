import { Component, OnInit } from '@angular/core';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  selector: 'app-system-logs',
  templateUrl: './system-logs.component.html',
  styleUrls: ['./system-logs.component.scss']
})
export class SystemLogsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
  }
}
