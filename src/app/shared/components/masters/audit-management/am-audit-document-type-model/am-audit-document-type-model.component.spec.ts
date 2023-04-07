import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditDocumentTypeModelComponent } from './am-audit-document-type-model.component';

describe('AmAuditDocumentTypeModelComponent', () => {
  let component: AmAuditDocumentTypeModelComponent;
  let fixture: ComponentFixture<AmAuditDocumentTypeModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditDocumentTypeModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditDocumentTypeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
