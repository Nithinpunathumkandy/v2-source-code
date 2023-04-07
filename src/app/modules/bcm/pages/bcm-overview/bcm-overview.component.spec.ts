import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcmOverviewComponent } from './bcm-overview.component';

describe('BcmOverviewComponent', () => {
  let component: BcmOverviewComponent;
  let fixture: ComponentFixture<BcmOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcmOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcmOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
