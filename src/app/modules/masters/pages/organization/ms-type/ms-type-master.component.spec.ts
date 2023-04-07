import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTypeMasterComponent } from './ms-type-master.component';

describe('MsTypeMasterComponent', () => {
  let component: MsTypeMasterComponent;
  let fixture: ComponentFixture<MsTypeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsTypeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
