import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserKpiPageComponent } from './user-kpi-page.component';

describe('UserKpiPageComponent', () => {
  let component: UserKpiPageComponent;
  let fixture: ComponentFixture<UserKpiPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserKpiPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserKpiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
