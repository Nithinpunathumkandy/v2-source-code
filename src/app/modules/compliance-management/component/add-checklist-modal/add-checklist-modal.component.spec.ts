import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChecklistModalComponent } from './add-checklist-modal.component';

describe('AddChecklistModalComponent', () => {
  let component: AddChecklistModalComponent;
  let fixture: ComponentFixture<AddChecklistModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChecklistModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChecklistModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
