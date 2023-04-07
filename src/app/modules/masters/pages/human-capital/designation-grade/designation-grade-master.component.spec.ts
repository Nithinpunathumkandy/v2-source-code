import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationGradeMasterComponent } from './designation-grade-master.component';

describe('DesignationGradeMasterComponent', () => {
  let component: DesignationGradeMasterComponent;
  let fixture: ComponentFixture<DesignationGradeMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignationGradeMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignationGradeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
