import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';

@Component({
  selector: 'app-change-request-details',
  templateUrl: './change-request-details.component.html',
  styleUrls: ['./change-request-details.component.scss']
})
export class ChangeRequestDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  changeRequestStore = changeRequestStore;

  constructor(
    private route: ActivatedRoute,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true)
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      changeRequestStore.setChangeRequestId(id);
      changeRequestStore.documentId=id
    });
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '0px');
        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }

  }

  ngOnDestroy(): void {
    changeRequestStore.unsetChangeRequestDetails()
  }

}