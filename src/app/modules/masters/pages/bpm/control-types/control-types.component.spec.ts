import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTypesComponent } from './control-types.component';

describe('ControlTypesComponent', () => {
  let component: ControlTypesComponent;
  let fixture: ComponentFixture<ControlTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
