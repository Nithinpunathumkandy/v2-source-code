import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTypeModalComponent } from './ms-type-modal.component';

describe('MsTypeModalComponent', () => {
  let component: MsTypeModalComponent;
  let fixture: ComponentFixture<MsTypeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsTypeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
