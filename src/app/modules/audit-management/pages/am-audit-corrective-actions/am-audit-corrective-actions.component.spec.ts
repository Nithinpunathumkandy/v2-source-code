import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditCorrectiveActionsComponent } from './am-audit-corrective-actions.component';

describe('AmAuditCorrectiveActionsComponent', () => {
  let component: AmAuditCorrectiveActionsComponent;
  let fixture: ComponentFixture<AmAuditCorrectiveActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditCorrectiveActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditCorrectiveActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
