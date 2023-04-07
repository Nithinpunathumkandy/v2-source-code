import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recursive-meeting-agenda',
  templateUrl: './recursive-meeting-agenda.component.html',
  styleUrls: ['./recursive-meeting-agenda.component.scss']
})
export class RecursiveMeetingAgendaComponent implements OnInit {
  @Input() meetingAgendas;
 
  constructor() { }

  ngOnInit(): void {
  
  }

}
