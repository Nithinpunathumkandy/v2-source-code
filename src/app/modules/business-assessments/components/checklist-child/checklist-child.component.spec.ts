import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistChildComponent } from './checklist-child.component';

describe('ChecklistChildComponent', () => {
  let component: ChecklistChildComponent;
  let fixture: ComponentFixture<ChecklistChildComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistChildComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
