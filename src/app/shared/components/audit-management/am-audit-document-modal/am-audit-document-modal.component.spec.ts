import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditDocumentModalComponent } from './am-audit-document-modal.component';

describe('AmAuditDocumentModalComponent', () => {
  let component: AmAuditDocumentModalComponent;
  let fixture: ComponentFixture<AmAuditDocumentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditDocumentModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditDocumentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
