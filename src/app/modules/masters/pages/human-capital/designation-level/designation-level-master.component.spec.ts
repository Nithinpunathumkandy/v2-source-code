import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationLevelMasterComponent } from './designation-level-master.component';

describe('DesignationLevelMasterComponent', () => {
  let component: DesignationLevelMasterComponent;
  let fixture: ComponentFixture<DesignationLevelMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationLevelMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationLevelMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
