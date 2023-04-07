import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChecklistComponentComponent } from './add-checklist-component.component';

describe('AddChecklistComponentComponent', () => {
  let component: AddChecklistComponentComponent;
  let fixture: ComponentFixture<AddChecklistComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChecklistComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChecklistComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
