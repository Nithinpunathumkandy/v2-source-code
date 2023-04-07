import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmAuditDocumentTypesComponent } from './am-audit-document-types.component';

describe('AmAuditDocumentTypesComponent', () => {
  let component: AmAuditDocumentTypesComponent;
  let fixture: ComponentFixture<AmAuditDocumentTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmAuditDocumentTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmAuditDocumentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
