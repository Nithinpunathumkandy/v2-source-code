import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditManagementRiskRatingComponent } from './audit-management-risk-rating.component';

describe('AuditManagementRiskRatingComponent', () => {
  let component: AuditManagementRiskRatingComponent;
  let fixture: ComponentFixture<AuditManagementRiskRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditManagementRiskRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditManagementRiskRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
