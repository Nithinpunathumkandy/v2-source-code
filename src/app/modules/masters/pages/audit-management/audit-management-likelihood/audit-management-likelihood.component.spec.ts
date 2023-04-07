import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditManagementLikelihoodComponent } from './audit-management-likelihood.component';

describe('AuditManagementLikelihoodComponent', () => {
  let component: AuditManagementLikelihoodComponent;
  let fixture: ComponentFixture<AuditManagementLikelihoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditManagementLikelihoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditManagementLikelihoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
