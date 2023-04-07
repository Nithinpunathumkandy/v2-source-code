import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentSubCategoryComponent } from './incident-sub-category.component';

describe('IncidentSubCategoryComponent', () => {
  let component: IncidentSubCategoryComponent;
  let fixture: ComponentFixture<IncidentSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentSubCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
