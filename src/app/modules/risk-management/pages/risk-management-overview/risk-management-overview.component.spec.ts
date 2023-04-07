import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskManagementOverviewComponent } from './risk-management-overview.component';

describe('RiskManagementOverviewComponent', () => {
  let component: RiskManagementOverviewComponent;
  let fixture: ComponentFixture<RiskManagementOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskManagementOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskManagementOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
