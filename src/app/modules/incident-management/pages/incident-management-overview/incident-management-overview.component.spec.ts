import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentManagementOverviewComponent } from './incident-management-overview.component';

describe('IncidentManagementOverviewComponent', () => {
  let component: IncidentManagementOverviewComponent;
  let fixture: ComponentFixture<IncidentManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentManagementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
