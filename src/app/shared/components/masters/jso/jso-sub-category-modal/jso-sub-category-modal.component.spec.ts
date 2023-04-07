import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoSubCategoryModalComponent } from './jso-sub-category-modal.component';

describe('JsoSubCategoryModalComponent', () => {
  let component: JsoSubCategoryModalComponent;
  let fixture: ComponentFixture<JsoSubCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoSubCategoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoSubCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
