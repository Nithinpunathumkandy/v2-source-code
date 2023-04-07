import { Component, OnInit,ChangeDetectorRef, ViewChild, ElementRef, EventEmitter, HostListener } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {Router} from '@angular/router';
import {UserKpiStore} from 'src/app/stores/human-capital/users/user-kpi.store';
import {UsersStore} from 'src/app/stores/human-capital/users/users.store';

@Component({
  selector: 'app-performance-evaluation',
  templateUrl: './performance-evaluation.component.html',
  styleUrls: ['./performance-evaluation.component.scss']
})
export class PerformanceEvaluationComponent implements OnInit {
  @ViewChild('input') input: ElementRef;

  private el: ElementRef;
  scrollNext = new EventEmitter<any>();
  UserKpiStore=UserKpiStore;
  UsersStore=UsersStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private elem: ElementRef,
    private _router:Router) { }

  ngOnInit(): void {
    SubMenuItemStore.setSubMenuItems([
     
      { type: 'close', path: '../' },
    ]);

  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    

    let elements = this.elem.nativeElement.querySelectorAll('.input-block');
    // var top = window.pageYOffset;
    // if(top==0){
    //   element.classList.add('active');
    // }
    //we'll do some stuff here when the window is scrolled
    elements.forEach((elem) => {
      var etop = elem.getBoundingClientRect().top;
      var diff = etop - window.pageYOffset;

      if (this.elementInViewport(elem)) {
        this.reinitState(elem, elements);
      }
    });
  }


  reinitState(elem, elements) {
    //let element = this.elem.nativeElement.querySelector(".upform-main");
    elements.forEach(elem => {
      elem.classList.remove('active');
    })
    elem.classList.add('active');

    
   

  }

  elementInViewport(el) {
  // console.log(window.);

    var top = el.offsetTop;
    var diff = top - window.scrollY;
    return (diff > 0 && diff < 250);
  }


  //@HostListener('click', ['$event'])
  scrollToItem(event) {
    var top = window.pageYOffset;
    if(event.screenY<300){
      top = top + this.elem.nativeElement.offsetTop - 260;
      window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
      setTimeout(() => {
        top = top + this.elem.nativeElement.offsetTop + 230;
        window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
      }, 200);
     

    }
    else{
      top = top + this.elem.nativeElement.offsetTop + 230;
    }
    
    window.scrollTo({ left: 0, top: top, behavior: 'smooth' });

  };

  editAnswer(){
    var top = window.pageYOffset;
    top = top + this.elem.nativeElement.offsetTop - 1380;
      window.scrollTo({ left: 0, top: top, behavior: 'smooth' });
  }


  @HostListener('keydown', ['$event']) onKeyDown(e) {
    if ((e.which == 13 || e.keyCode == 13)) {
      e.preventDefault();
      if (e.srcElement.nextElementSibling) {
        e.srcElement.nextElementSibling.focus();
      }
      else {
        // console.log('close keyboard');
      }
      return;
    }

  }

  startEvaluation(){
    UserKpiStore.setEvaluationStarted();
  }

}
