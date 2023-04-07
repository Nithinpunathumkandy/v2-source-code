import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillReportsComponent } from './mock-drill-reports.component';

describe('MockDrillReportsComponent', () => {
  let component: MockDrillReportsComponent;
  let fixture: ComponentFixture<MockDrillReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
