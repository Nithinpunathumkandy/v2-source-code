import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsoCountTypeComponent } from './jso-count-type.component';

describe('JsoCountTypeComponent', () => {
  let component: JsoCountTypeComponent;
  let fixture: ComponentFixture<JsoCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JsoCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsoCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
