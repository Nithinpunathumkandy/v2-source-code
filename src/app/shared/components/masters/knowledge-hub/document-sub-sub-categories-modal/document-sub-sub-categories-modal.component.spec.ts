import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSubSubCategoriesModalComponent } from './document-sub-sub-categories-modal.component';

describe('DocumentSubSubCategoriesModalComponent', () => {
  let component: DocumentSubSubCategoriesModalComponent;
  let fixture: ComponentFixture<DocumentSubSubCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSubSubCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSubSubCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
