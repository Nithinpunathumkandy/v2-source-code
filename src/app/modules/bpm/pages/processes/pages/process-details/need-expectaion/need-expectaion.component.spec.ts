import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedExpectaionComponent } from './need-expectaion.component';

describe('NeedExpectaionComponent', () => {
  let component: NeedExpectaionComponent;
  let fixture: ComponentFixture<NeedExpectaionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeedExpectaionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedExpectaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
