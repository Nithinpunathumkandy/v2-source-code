import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockDrillHistoryModalComponent } from './mock-drill-history-modal.component';

describe('MockDrillHistoryModalComponent', () => {
  let component: MockDrillHistoryModalComponent;
  let fixture: ComponentFixture<MockDrillHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockDrillHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockDrillHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
