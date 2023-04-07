import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCategoriesModelComponent } from './incident-categories-model.component';

describe('IncidentCategoriesModelComponent', () => {
  let component: IncidentCategoriesModelComponent;
  let fixture: ComponentFixture<IncidentCategoriesModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCategoriesModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCategoriesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
