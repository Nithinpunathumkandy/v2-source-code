import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationZoneMasterComponent } from './designation-zone-master.component';

describe('DesignationZoneMasterComponent', () => {
  let component: DesignationZoneMasterComponent;
  let fixture: ComponentFixture<DesignationZoneMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationZoneMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationZoneMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
