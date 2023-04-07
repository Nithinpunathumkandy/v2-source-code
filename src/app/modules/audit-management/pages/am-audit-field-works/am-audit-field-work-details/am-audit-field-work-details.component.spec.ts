import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFieldWorkDetailsComponent } from './am-audit-field-work-details.component';

describe('AmAuditFieldWorkDetailsComponent', () => {
  let component: AmAuditFieldWorkDetailsComponent;
  let fixture: ComponentFixture<AmAuditFieldWorkDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFieldWorkDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFieldWorkDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
