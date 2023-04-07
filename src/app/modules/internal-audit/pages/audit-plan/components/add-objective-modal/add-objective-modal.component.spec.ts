import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddObjectiveModalComponent } from './add-objective-modal.component';

describe('AddObjectiveModalComponent', () => {
  let component: AddObjectiveModalComponent;
  let fixture: ComponentFixture<AddObjectiveModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddObjectiveModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddObjectiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
