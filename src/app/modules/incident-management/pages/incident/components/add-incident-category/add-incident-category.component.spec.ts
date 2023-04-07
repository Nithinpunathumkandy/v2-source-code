import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentCategoryComponent } from './add-incident-category.component';

describe('AddIncidentCategoryComponent', () => {
  let component: AddIncidentCategoryComponent;
  let fixture: ComponentFixture<AddIncidentCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
