import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCategoryModalComponent } from './document-category-modal.component';

describe('DocumentCategoryModalComponent', () => {
  let component: DocumentCategoryModalComponent;
  let fixture: ComponentFixture<DocumentCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
