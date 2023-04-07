import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNeedsExpectationComponent } from './add-needs-expectation.component';

describe('AddNeedsExpectationComponent', () => {
  let component: AddNeedsExpectationComponent;
  let fixture: ComponentFixture<AddNeedsExpectationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNeedsExpectationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNeedsExpectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
