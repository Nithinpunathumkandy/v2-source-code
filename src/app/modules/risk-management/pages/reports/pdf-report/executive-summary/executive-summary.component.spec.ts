import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskCountListComponent } from './risk-count-list.component';

describe('RiskCountListComponent', () => {
  let component: RiskCountListComponent;
  let fixture: ComponentFixture<RiskCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
