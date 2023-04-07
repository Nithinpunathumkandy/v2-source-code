import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoSubCategoryComponent } from './jso-sub-category.component';

describe('JsoSubCategoryComponent', () => {
  let component: JsoSubCategoryComponent;
  let fixture: ComponentFixture<JsoSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
