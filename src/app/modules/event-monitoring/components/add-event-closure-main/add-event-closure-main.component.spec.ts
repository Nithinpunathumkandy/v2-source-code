import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventClosureMainComponent } from './add-event-closure-main.component';

describe('AddEventClosureMainComponent', () => {
  let component: AddEventClosureMainComponent;
  let fixture: ComponentFixture<AddEventClosureMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEventClosureMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEventClosureMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
