import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleActivitiesLoaderComponent } from './role-activities-loader.component';

describe('RoleActivitiesLoaderComponent', () => {
  let component: RoleActivitiesLoaderComponent;
  let fixture: ComponentFixture<RoleActivitiesLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleActivitiesLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleActivitiesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
