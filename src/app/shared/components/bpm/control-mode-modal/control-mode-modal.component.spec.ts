import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlModeModalComponent } from './control-mode-modal.component';

describe('ControlModeModalComponent', () => {
  let component: ControlModeModalComponent;
  let fixture: ComponentFixture<ControlModeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlModeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlModeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
