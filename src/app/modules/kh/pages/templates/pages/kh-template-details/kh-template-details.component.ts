import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { TemplateStore } from 'src/app/stores/knowledge-hub/templates/templates.store'

@Component({
  selector: 'app-kh-template-details',
  templateUrl: './kh-template-details.component.html',
  styleUrls: ['./kh-template-details.component.scss']
})
export class KhTemplateDetailsComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  TemplateStore = TemplateStore

  constructor(
    private route: ActivatedRoute,
    private _router:Router,
    private _renderer2: Renderer2,
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true)
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; // (+) converts string 'id' to a number
      TemplateStore.setTemplateId(id);      
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

  gotoList(){
    this._router.navigateByUrl("/knowledge-hub/template");
  }

  ngOnDestroy(): void {
    TemplateStore.unsetTemplateDetails()
  }

}
