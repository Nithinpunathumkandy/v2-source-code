import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistSingleViewModalComponent } from './checklist-single-view-modal.component';

describe('ChecklistSingleViewModalComponent', () => {
  let component: ChecklistSingleViewModalComponent;
  let fixture: ComponentFixture<ChecklistSingleViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChecklistSingleViewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistSingleViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
