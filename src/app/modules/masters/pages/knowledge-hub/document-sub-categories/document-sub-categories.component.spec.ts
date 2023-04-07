import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentSubCategoriesComponent } from './document-sub-categories.component';

describe('DocumentSubCategoriesComponent', () => {
  let component: DocumentSubCategoriesComponent;
  let fixture: ComponentFixture<DocumentSubCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentSubCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
