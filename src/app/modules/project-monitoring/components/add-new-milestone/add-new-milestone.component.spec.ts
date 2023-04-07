import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewMilestoneComponent } from './add-new-milestone.component';

describe('AddNewMilestoneComponent', () => {
  let component: AddNewMilestoneComponent;
  let fixture: ComponentFixture<AddNewMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewMilestoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
