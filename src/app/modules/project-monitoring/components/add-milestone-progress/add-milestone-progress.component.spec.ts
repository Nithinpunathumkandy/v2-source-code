import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMilestoneProgressComponent } from './add-milestone-progress.component';

describe('AddMilestoneProgressComponent', () => {
  let component: AddMilestoneProgressComponent;
  let fixture: ComponentFixture<AddMilestoneProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMilestoneProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMilestoneProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
