import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserKpiModalComponent } from './user-kpi-modal.component';

describe('UserKpiModalComponent', () => {
  let component: UserKpiModalComponent;
  let fixture: ComponentFixture<UserKpiModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserKpiModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserKpiModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
