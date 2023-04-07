import { Directive, Input, Inject, Renderer2, ElementRef, HostListener, AfterViewInit } from "@angular/core";
import { DOCUMENT } from '@angular/common';

@Directive({
    selector: '[scrollPoint]'
})
export class ScrollPointDirective implements AfterViewInit {
    private _refEl: ElementRef;

    constructor(
        @Inject(DOCUMENT) private _document: Document,
        private _renderer2: Renderer2,
        private _el: ElementRef,
    ) { }

    ngAfterViewInit() {
        this._refEl = new ElementRef(this._document.createElement('div'));
        this._renderer2.insertBefore(this._el.nativeElement.parentElement, this._refEl.nativeElement, this._el.nativeElement);
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const height = this._el.nativeElement.offsetHeight;
        const top = this._refEl.nativeElement.offsetTop;

        if (window.pageYOffset >= top) {
            this._renderer2.setStyle(this._refEl.nativeElement, 'height', height + 'px');
            this._renderer2.addClass(this._el.nativeElement, 'affix')
        } else {
            this._renderer2.removeClass(this._el.nativeElement, 'affix');
            this._renderer2.setStyle(this._refEl.nativeElement, 'height', 'auto');
        }
    }
}