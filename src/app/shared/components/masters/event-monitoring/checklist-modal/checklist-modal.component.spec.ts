import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistModalComponent } from './checklist-modal.component';

describe('ChecklistModalComponent', () => {
  let component: ChecklistModalComponent;
  let fixture: ComponentFixture<ChecklistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
