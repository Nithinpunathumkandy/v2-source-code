import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlModeComponent } from './control-mode.component';

describe('ControlModeComponent', () => {
  let component: ControlModeComponent;
  let fixture: ComponentFixture<ControlModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
