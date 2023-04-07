import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedExpectationComponent } from './need-expectation.component';

describe('NeedExpectationComponent', () => {
  let component: NeedExpectationComponent;
  let fixture: ComponentFixture<NeedExpectationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedExpectationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedExpectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
