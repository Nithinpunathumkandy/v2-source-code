import { Injectable } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute, Data, NavigationStart } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AppStore } from 'src/app/stores/app.store';
import { Title } from '@angular/platform-browser';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { BreadCrumbMenuItem } from '../models/general/breadcrumb-menu.model';
import { UtilityService } from "src/app/shared/services/utility.service";

@Injectable({
    providedIn: 'root'
})
export class CoreService {

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _title: Title, private _utilityService: UtilityService
    ) { }

    setPageTitle() {
        this._title.setTitle(AppStore.title);
    }

    subscribeRouteEvents() {
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this._activatedRoute),
            map(route => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
        ).subscribe(route => {
            AppStore.showLoader = false;
            window.scroll(0,0);
            AppStore.setRoute(route);
            this.setAppTitleFromRoute();
            this.setPageTitle();
        });

        this._router.events
        .pipe(filter(event => event instanceof NavigationStart))
        .subscribe((ev: NavigationStart) =>{
            AppStore.previousUrl = AppStore.currentUrl;
            if(ev.url.indexOf('error') == -1) AppStore.currentUrl = ev.url;
            BreadCrumbMenuItemStore.breadCrumbMenuItems = this.createBreadcrumbs(this._activatedRoute.root)
        });
    }

    setAppTitleFromRoute() {
        const route: ActivatedRoute = AppStore.route;

        let title = '';

        let tempRoute = route;
        const allRoutesData: Data = [route.data];

        while (tempRoute.parent) {
            allRoutesData.push(tempRoute.parent.data);
            tempRoute = tempRoute.parent;
        }

        let previousValue = '';
        for (let i = 0; i < allRoutesData.length; i++) {
            const data = allRoutesData[i].value
            if (data['core'] && data['core']['title'] && data['core']['title'] != previousValue) {
                title += this._utilityService.translateToUserLanguage(data['core']['title']) + ' | ';
                previousValue = data['core']['title'];
            }
        }

        if (title) AppStore.setTitle(title);
    }

    private createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: BreadCrumbMenuItem[] = []): BreadCrumbMenuItem[] {
        const children: ActivatedRoute[] = route.children;
    
        if (children.length === 0) {
          return breadcrumbs;
        }
    
        for (const child of children) {
            const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
            if (routeURL !== '') {
                url += `/${routeURL}`;
            }
        
            const label = child.snapshot.data['breadcrumb'];
            if (label !== null && label !== undefined && label != "") {
                let item ={
                path: url,
                name: label,
                params: null
                }
                BreadCrumbMenuItemStore.addBreadCrumbMenu(item);
            }
            
            return this.createBreadcrumbs(child, url, BreadCrumbMenuItemStore.breadCrumbMenuItems);
        }
    }
}