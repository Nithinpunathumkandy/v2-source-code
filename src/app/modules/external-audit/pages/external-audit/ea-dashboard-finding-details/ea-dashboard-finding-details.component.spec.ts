import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaDashboardFindingDetailsComponent } from './ea-dashboard-finding-details.component';

describe('EaDashboardFindingDetailsComponent', () => {
  let component: EaDashboardFindingDetailsComponent;
  let fixture: ComponentFixture<EaDashboardFindingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EaDashboardFindingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaDashboardFindingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
