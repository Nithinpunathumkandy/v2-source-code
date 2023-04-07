import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlArciAddComponent } from './control-arci-add.component';

describe('ControlArciAddComponent', () => {
  let component: ControlArciAddComponent;
  let fixture: ComponentFixture<ControlArciAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlArciAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlArciAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
