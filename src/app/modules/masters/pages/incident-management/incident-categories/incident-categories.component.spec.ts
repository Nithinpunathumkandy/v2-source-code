import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentCategoriesComponent } from './incident-categories.component';

describe('IncidentCategoriesComponent', () => {
  let component: IncidentCategoriesComponent;
  let fixture: ComponentFixture<IncidentCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
