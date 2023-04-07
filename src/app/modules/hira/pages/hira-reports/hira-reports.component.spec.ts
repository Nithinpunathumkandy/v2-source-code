import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiraReportsComponent } from './hira-reports.component';

describe('HiraReportsComponent', () => {
  let component: HiraReportsComponent;
  let fixture: ComponentFixture<HiraReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiraReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HiraReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
