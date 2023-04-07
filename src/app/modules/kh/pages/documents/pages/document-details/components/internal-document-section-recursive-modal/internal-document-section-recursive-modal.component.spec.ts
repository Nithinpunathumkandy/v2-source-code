import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDocumentSectionRecursiveModalComponent } from './internal-document-section-recursive-modal.component';

describe('InternalDocumentSectionRecursiveModalComponent', () => {
  let component: InternalDocumentSectionRecursiveModalComponent;
  let fixture: ComponentFixture<InternalDocumentSectionRecursiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalDocumentSectionRecursiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDocumentSectionRecursiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
