import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserKpiLoaderComponent } from './user-kpi-loader.component';

describe('UserKpiLoaderComponent', () => {
  let component: UserKpiLoaderComponent;
  let fixture: ComponentFixture<UserKpiLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserKpiLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserKpiLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
