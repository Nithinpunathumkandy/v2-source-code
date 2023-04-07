import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiskMappingComplianceComponent } from './add-risk-mapping-compliance.component';

describe('AddRiskMappingComplianceComponent', () => {
  let component: AddRiskMappingComplianceComponent;
  let fixture: ComponentFixture<AddRiskMappingComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRiskMappingComplianceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRiskMappingComplianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
