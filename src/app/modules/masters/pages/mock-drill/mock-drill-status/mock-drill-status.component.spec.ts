import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillStatusComponent } from './mock-drill-status.component';

describe('MockDrillStatusComponent', () => {
  let component: MockDrillStatusComponent;
  let fixture: ComponentFixture<MockDrillStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
