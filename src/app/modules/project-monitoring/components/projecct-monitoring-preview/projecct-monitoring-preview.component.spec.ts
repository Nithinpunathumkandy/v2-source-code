import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjecctMonitoringPreviewComponent } from './projecct-monitoring-preview.component';

describe('ProjecctMonitoringPreviewComponent', () => {
  let component: ProjecctMonitoringPreviewComponent;
  let fixture: ComponentFixture<ProjecctMonitoringPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjecctMonitoringPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjecctMonitoringPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
