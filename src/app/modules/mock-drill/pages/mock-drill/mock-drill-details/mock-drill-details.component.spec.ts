import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillDetailsComponent } from './mock-drill-details.component';

describe('MockDrillDetailsComponent', () => {
  let component: MockDrillDetailsComponent;
  let fixture: ComponentFixture<MockDrillDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
