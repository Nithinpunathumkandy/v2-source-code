import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';

@Component({
  selector: 'app-cyber-incident-details',
  templateUrl: './cyber-incident-details.component.html',
  styleUrls: ['./cyber-incident-details.component.scss']
})
export class CyberIncidentDetailsComponent implements OnInit {
  BreadCrumbMenuItemStore=BreadCrumbMenuItemStore;
  CyberIncidentStore=CyberIncidentStore;
  id: number;
  constructor(private route: ActivatedRoute, private _helperService: HelperServiceService,) {
    this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      CyberIncidentStore.setIncidentId(this.id);
    });
  }

  ngOnInit(): void {
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"incident",
        path:`/cyber-incident/cyber-incidents`
      });
    }
  }

}
