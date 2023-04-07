import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditTestPlansComponent } from './am-audit-test-plans.component';

describe('AmAuditTestPlansComponent', () => {
  let component: AmAuditTestPlansComponent;
  let fixture: ComponentFixture<AmAuditTestPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditTestPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditTestPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
