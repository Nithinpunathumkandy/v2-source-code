import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationHistoryModalComponent } from './investigation-history-modal.component';

describe('InvestigationHistoryModalComponent', () => {
  let component: InvestigationHistoryModalComponent;
  let fixture: ComponentFixture<InvestigationHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestigationHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
