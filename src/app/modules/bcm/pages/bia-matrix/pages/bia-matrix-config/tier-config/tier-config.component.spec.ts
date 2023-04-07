import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierConfigComponent } from './tier-config.component';

describe('TierConfigComponent', () => {
  let component: TierConfigComponent;
  let fixture: ComponentFixture<TierConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TierConfigComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TierConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
