import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleActivitiesComponent } from './role-activities.component';

describe('RoleActivitiesComponent', () => {
  let component: RoleActivitiesComponent;
  let fixture: ComponentFixture<RoleActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
