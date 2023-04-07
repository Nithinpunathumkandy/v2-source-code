import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterMappingComponent } from './compliance-register-mapping.component';

describe('ComplianceRegisterMappingComponent', () => {
  let component: ComplianceRegisterMappingComponent;
  let fixture: ComponentFixture<ComplianceRegisterMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
