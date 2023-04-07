import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-qlik-dashboards',
  templateUrl: './qlik-dashboards.component.html',
  styleUrls: ['./qlik-dashboards.component.scss']
})
export class QlikDashboardsComponent implements OnInit {

  OrganizationModulesStore = OrganizationModulesStore;

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  redirectToListPage(status){
      switch (status) {
        case 'human-capital':
          this._router.navigateByUrl('/human-capital/qlik-dashboard');
          break;
          case 'bpm':
          this._router.navigateByUrl('/bpm/qlik-dashboard');
          break;
        default:
          break;
      }
  }

}
