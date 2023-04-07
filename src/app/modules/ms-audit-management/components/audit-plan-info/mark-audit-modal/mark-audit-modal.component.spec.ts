import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkAuditModalComponent } from './mark-audit-modal.component';

describe('MarkAuditModalComponent', () => {
  let component: MarkAuditModalComponent;
  let fixture: ComponentFixture<MarkAuditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkAuditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkAuditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
