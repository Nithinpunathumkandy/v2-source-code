import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HmByDepartmentComponent } from './hm-by-department.component';

describe('HmByDepartmentComponent', () => {
  let component: HmByDepartmentComponent;
  let fixture: ComponentFixture<HmByDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HmByDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HmByDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
