import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPopupComponent } from './control-popup.component';

describe('ControlPopupComponent', () => {
  let component: ControlPopupComponent;
  let fixture: ComponentFixture<ControlPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
