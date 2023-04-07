import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillActionPlansComponent } from './mock-drill-action-plans.component';

describe('MockDrillActionPlansComponent', () => {
  let component: MockDrillActionPlansComponent;
  let fixture: ComponentFixture<MockDrillActionPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillActionPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillActionPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
