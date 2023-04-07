import { Component, OnInit } from '@angular/core';
import { ProjectsStore } from 'src/app/stores/project-management/projects/projects.store';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {
  ProjectsStore = ProjectsStore;
  
  constructor() { }

  ngOnInit(): void {
  }

}
