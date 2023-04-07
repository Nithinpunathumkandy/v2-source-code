import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalDocumentSectionRecursiveModalComponent } from './external-document-section-recursive-modal.component';

describe('ExternalDocumentSectionRecursiveModalComponent', () => {
  let component: ExternalDocumentSectionRecursiveModalComponent;
  let fixture: ComponentFixture<ExternalDocumentSectionRecursiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalDocumentSectionRecursiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDocumentSectionRecursiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
