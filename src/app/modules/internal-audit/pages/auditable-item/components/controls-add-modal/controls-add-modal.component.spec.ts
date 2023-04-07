import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlsAddModalComponent } from './controls-add-modal.component';

describe('ControlsAddModalComponent', () => {
  let component: ControlsAddModalComponent;
  let fixture: ComponentFixture<ControlsAddModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlsAddModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlsAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
