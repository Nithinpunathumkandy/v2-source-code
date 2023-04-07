import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoUnsafeActionsComponent } from './jso-unsafe-actions.component';

describe('JsoUnsafeActionsComponent', () => {
  let component: JsoUnsafeActionsComponent;
  let fixture: ComponentFixture<JsoUnsafeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoUnsafeActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoUnsafeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
