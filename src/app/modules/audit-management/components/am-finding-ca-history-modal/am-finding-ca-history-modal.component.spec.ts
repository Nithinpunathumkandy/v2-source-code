import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmFindingCaHistoryModalComponent } from './am-finding-ca-history-modal.component';

describe('AmFindingCaHistoryModalComponent', () => {
  let component: AmFindingCaHistoryModalComponent;
  let fixture: ComponentFixture<AmFindingCaHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmFindingCaHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmFindingCaHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
