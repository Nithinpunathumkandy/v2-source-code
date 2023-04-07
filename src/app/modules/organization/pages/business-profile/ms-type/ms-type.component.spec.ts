import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTypeComponent } from './ms-type.component';

describe('MsTypeComponent', () => {
  let component: MsTypeComponent;
  let fixture: ComponentFixture<MsTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
