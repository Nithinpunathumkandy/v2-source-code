import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentDashboardComponent } from './incident-dashboard.component';

describe('IncidentDashboardComponent', () => {
  let component: IncidentDashboardComponent;
  let fixture: ComponentFixture<IncidentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
