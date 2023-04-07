import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoDashboardLoaderComponent } from './jso-dashboard-loader.component';

describe('JsoDashboardLoaderComponent', () => {
  let component: JsoDashboardLoaderComponent;
  let fixture: ComponentFixture<JsoDashboardLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoDashboardLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoDashboardLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
