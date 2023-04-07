import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventChecklistComponent } from './add-event-checklist.component';

describe('AddEventChecklistComponent', () => {
  let component: AddEventChecklistComponent;
  let fixture: ComponentFixture<AddEventChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
