import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmQlikDashboardComponent } from './bpm-qlik-dashboard.component';

describe('BpmQlikDashboardComponent', () => {
  let component: BpmQlikDashboardComponent;
  let fixture: ComponentFixture<BpmQlikDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmQlikDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmQlikDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
