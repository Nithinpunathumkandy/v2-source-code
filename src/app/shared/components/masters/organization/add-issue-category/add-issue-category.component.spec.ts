import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueCategoryComponent } from './add-issue-category.component';

describe('AddIssueCategoryComponent', () => {
  let component: AddIssueCategoryComponent;
  let fixture: ComponentFixture<AddIssueCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIssueCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIssueCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
