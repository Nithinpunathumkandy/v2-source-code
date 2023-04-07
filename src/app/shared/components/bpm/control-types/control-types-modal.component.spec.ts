import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTypesModalComponent } from './control-types-modal.component';

describe('ControlTypesModalComponent', () => {
  let component: ControlTypesModalComponent;
  let fixture: ComponentFixture<ControlTypesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlTypesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTypesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
