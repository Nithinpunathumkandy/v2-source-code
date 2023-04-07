import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingMappingComplianceComponent } from './audit-finding-mapping-compliance.component';

describe('AuditFindingMappingComplianceComponent', () => {
  let component: AuditFindingMappingComplianceComponent;
  let fixture: ComponentFixture<AuditFindingMappingComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditFindingMappingComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingMappingComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
