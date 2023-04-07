import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMilestoneComponent } from './new-milestone.component';

describe('NewMilestoneComponent', () => {
  let component: NewMilestoneComponent;
  let fixture: ComponentFixture<NewMilestoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMilestoneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
