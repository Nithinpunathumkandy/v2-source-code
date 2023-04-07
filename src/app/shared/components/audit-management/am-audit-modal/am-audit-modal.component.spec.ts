import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditModalComponent } from './am-audit-modal.component';

describe('AmAuditModalComponent', () => {
  let component: AmAuditModalComponent;
  let fixture: ComponentFixture<AmAuditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
