import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterComponent } from './compliance-register.component';

describe('ComplianceRegisterComponent', () => {
  let component: ComplianceRegisterComponent;
  let fixture: ComponentFixture<ComplianceRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
