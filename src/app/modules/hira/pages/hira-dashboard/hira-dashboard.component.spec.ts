import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraDashboardComponent } from './hira-dashboard.component';

describe('HiraDashboardComponent', () => {
  let component: HiraDashboardComponent;
  let fixture: ComponentFixture<HiraDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
