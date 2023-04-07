import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventClosureComponent } from './add-event-closure.component';

describe('AddEventClosureComponent', () => {
  let component: AddEventClosureComponent;
  let fixture: ComponentFixture<AddEventClosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventClosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
