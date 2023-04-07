import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmArciComponent } from './bpm-arci.component';

describe('BpmArciComponent', () => {
  let component: BpmArciComponent;
  let fixture: ComponentFixture<BpmArciComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmArciComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmArciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
