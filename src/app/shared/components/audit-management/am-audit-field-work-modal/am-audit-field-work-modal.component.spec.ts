import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditFieldWorkModalComponent } from './am-audit-field-work-modal.component';

describe('AmAuditFieldWorkModalComponent', () => {
  let component: AmAuditFieldWorkModalComponent;
  let fixture: ComponentFixture<AmAuditFieldWorkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditFieldWorkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditFieldWorkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
