import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmDashboardComponent } from './bpm-dashboard.component';

describe('BpmDashboardComponent', () => {
  let component: BpmDashboardComponent;
  let fixture: ComponentFixture<BpmDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BpmDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
