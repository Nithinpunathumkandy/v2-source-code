import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoDashboardComponent } from './jso-dashboard.component';

describe('JsoDashboardComponent', () => {
  let component: JsoDashboardComponent;
  let fixture: ComponentFixture<JsoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
