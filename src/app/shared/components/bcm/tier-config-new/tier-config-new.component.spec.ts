import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TierConfigNewComponent } from './tier-config-new.component';

describe('TierConfigNewComponent', () => {
  let component: TierConfigNewComponent;
  let fixture: ComponentFixture<TierConfigNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TierConfigNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TierConfigNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
