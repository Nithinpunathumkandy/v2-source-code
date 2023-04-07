import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmProcessesComponent } from './bpm-processes.component';

describe('BpmProcessesComponent', () => {
  let component: BpmProcessesComponent;
  let fixture: ComponentFixture<BpmProcessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmProcessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
