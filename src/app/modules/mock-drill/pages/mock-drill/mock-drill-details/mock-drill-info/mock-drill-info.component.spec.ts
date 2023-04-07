import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillInfoComponent } from './mock-drill-info.component';

describe('MockDrillInfoComponent', () => {
  let component: MockDrillInfoComponent;
  let fixture: ComponentFixture<MockDrillInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
