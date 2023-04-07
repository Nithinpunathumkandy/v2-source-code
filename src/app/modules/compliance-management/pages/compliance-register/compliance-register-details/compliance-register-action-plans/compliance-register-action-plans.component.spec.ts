import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterActionPlansComponent } from './compliance-register-action-plans.component';

describe('ComplianceRegisterActionPlansComponent', () => {
  let component: ComplianceRegisterActionPlansComponent;
  let fixture: ComponentFixture<ComplianceRegisterActionPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterActionPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterActionPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
