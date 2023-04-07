import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventMilestoneComponent } from './add-event-milestone.component';

describe('AddEventMilestoneComponent', () => {
  let component: AddEventMilestoneComponent;
  let fixture: ComponentFixture<AddEventMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventMilestoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
