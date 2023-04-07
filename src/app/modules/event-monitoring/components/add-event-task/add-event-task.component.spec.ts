import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventTaskComponent } from './add-event-task.component';

describe('AddEventTaskComponent', () => {
  let component: AddEventTaskComponent;
  let fixture: ComponentFixture<AddEventTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
