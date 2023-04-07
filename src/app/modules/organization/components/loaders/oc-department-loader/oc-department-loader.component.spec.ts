import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OcDepartmentLoaderComponent } from './oc-department-loader.component';

describe('OcDepartmentLoaderComponent', () => {
  let component: OcDepartmentLoaderComponent;
  let fixture: ComponentFixture<OcDepartmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OcDepartmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OcDepartmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
