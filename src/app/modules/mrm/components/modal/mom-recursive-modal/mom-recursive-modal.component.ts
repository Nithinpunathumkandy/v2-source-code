import { Component, Input, OnInit } from '@angular/core';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';

@Component({
  selector: 'app-mom-recursive-modal',
  templateUrl: './mom-recursive-modal.component.html',
  styleUrls: ['./mom-recursive-modal.component.scss']
})
export class MomRecursiveModalComponent implements OnInit {

  @Input('details') items: any;
  MeetingsStore = MeetingsStore;

  constructor() { }

  ngOnInit(): void {
  }

}
