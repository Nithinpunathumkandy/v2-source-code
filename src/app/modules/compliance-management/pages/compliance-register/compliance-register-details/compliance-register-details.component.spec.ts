import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterDetailsComponent } from './compliance-register-details.component';

describe('ComplianceRegisterDetailsComponent', () => {
  let component: ComplianceRegisterDetailsComponent;
  let fixture: ComponentFixture<ComplianceRegisterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
