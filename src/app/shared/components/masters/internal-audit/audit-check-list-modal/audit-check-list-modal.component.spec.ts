import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditCheckListModalComponent } from './audit-check-list-modal.component';

describe('AuditCheckListModalComponent', () => {
  let component: AuditCheckListModalComponent;
  let fixture: ComponentFixture<AuditCheckListModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditCheckListModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditCheckListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
