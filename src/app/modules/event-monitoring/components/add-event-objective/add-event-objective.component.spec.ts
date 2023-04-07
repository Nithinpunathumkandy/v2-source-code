import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventObjectiveComponent } from './add-event-objective.component';

describe('AddEventObjectiveComponent', () => {
  let component: AddEventObjectiveComponent;
  let fixture: ComponentFixture<AddEventObjectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventObjectiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventObjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
