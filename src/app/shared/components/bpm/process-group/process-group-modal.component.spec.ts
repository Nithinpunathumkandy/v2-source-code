import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessGroupModalComponent } from './process-group-modal.component';

describe('ProcessGroupModalComponent', () => {
  let component: ProcessGroupModalComponent;
  let fixture: ComponentFixture<ProcessGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
