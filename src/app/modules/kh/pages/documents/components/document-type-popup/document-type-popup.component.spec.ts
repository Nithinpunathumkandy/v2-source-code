import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypePopupComponent } from './document-type-popup.component';

describe('DocumentTypePopupComponent', () => {
  let component: DocumentTypePopupComponent;
  let fixture: ComponentFixture<DocumentTypePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentTypePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentTypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
