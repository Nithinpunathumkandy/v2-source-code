import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistAddModalComponent } from './checklist-add-modal.component';

describe('ChecklistAddModalComponent', () => {
  let component: ChecklistAddModalComponent;
  let fixture: ComponentFixture<ChecklistAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
