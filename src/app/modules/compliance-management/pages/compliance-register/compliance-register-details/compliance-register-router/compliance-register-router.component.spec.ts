import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceRegisterRouterComponent } from './compliance-register-router.component';

describe('ComplianceRegisterRouterComponent', () => {
  let component: ComplianceRegisterRouterComponent;
  let fixture: ComponentFixture<ComplianceRegisterRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceRegisterRouterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceRegisterRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
