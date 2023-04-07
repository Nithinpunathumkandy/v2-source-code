import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmMastersComponent } from './bpm-masters.component';

describe('BpmMastersComponent', () => {
  let component: BpmMastersComponent;
  let fixture: ComponentFixture<BpmMastersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
