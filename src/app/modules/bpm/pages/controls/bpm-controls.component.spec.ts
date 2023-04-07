import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmControlsComponent } from './bpm-controls.component';

describe('BpmControlsComponent', () => {
  let component: BpmControlsComponent;
  let fixture: ComponentFixture<BpmControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
