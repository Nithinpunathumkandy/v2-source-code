import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcQlikDashboardComponent } from './hc-qlik-dashboard.component';

describe('HcQlikDashboardComponent', () => {
  let component: HcQlikDashboardComponent;
  let fixture: ComponentFixture<HcQlikDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcQlikDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HcQlikDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
