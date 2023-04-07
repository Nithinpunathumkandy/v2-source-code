import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTrainingsComponent } from './user-trainings.component';

describe('UserTrainingsComponent', () => {
  let component: UserTrainingsComponent;
  let fixture: ComponentFixture<UserTrainingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserTrainingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTrainingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
