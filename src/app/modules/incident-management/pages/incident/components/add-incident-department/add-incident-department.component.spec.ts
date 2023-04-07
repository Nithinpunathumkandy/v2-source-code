import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentDepartmentComponent } from './add-incident-department.component';

describe('AddIncidentDepartmentComponent', () => {
  let component: AddIncidentDepartmentComponent;
  let fixture: ComponentFixture<AddIncidentDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIncidentDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIncidentDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
