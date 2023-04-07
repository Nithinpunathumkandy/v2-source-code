import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSubSubCategoriesComponent } from './document-sub-sub-categories.component';

describe('DocumentSubSubCategoriesComponent', () => {
  let component: DocumentSubSubCategoriesComponent;
  let fixture: ComponentFixture<DocumentSubSubCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSubSubCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSubSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
