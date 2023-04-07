import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSubCategoriesModalComponent } from './document-sub-categories-modal.component';

describe('DocumentSubCategoriesModalComponent', () => {
  let component: DocumentSubCategoriesModalComponent;
  let fixture: ComponentFixture<DocumentSubCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSubCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSubCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
