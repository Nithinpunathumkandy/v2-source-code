import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubIncidentCategoryComponent } from './add-sub-incident-category.component';

describe('AddSubIncidentCategoryComponent', () => {
  let component: AddSubIncidentCategoryComponent;
  let fixture: ComponentFixture<AddSubIncidentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSubIncidentCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubIncidentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
