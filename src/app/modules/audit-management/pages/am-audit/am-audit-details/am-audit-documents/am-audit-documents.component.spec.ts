import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditDocumentsComponent } from './am-audit-documents.component';

describe('AmAuditDocumentsComponent', () => {
  let component: AmAuditDocumentsComponent;
  let fixture: ComponentFixture<AmAuditDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
