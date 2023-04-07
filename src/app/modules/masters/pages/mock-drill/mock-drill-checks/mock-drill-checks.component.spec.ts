import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillChecksComponent } from './mock-drill-checks.component';

describe('MockDrillChecksComponent', () => {
  let component: MockDrillChecksComponent;
  let fixture: ComponentFixture<MockDrillChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
