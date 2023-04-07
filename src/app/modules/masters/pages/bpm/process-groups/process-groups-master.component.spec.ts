import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessGroupsMasterComponent } from './process-groups-master.component';

describe('ProcessGroupsMasterComponent', () => {
  let component: ProcessGroupsMasterComponent;
  let fixture: ComponentFixture<ProcessGroupsMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessGroupsMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessGroupsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
