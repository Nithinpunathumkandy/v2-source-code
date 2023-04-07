import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTypeVersionMasterComponent } from './ms-type-version-master.component';

describe('MsTypeVersionMasterComponent', () => {
  let component: MsTypeVersionMasterComponent;
  let fixture: ComponentFixture<MsTypeVersionMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsTypeVersionMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsTypeVersionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
