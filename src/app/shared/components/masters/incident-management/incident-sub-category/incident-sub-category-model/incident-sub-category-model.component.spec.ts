import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentSubCategoryModelComponent } from './incident-sub-category-model.component';

describe('IncidentSubCategoryModelComponent', () => {
  let component: IncidentSubCategoryModelComponent;
  let fixture: ComponentFixture<IncidentSubCategoryModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentSubCategoryModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentSubCategoryModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
