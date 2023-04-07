import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAudienceModalComponent } from './target-audience-modal.component';

describe('TargetAudienceModalComponent', () => {
  let component: TargetAudienceModalComponent;
  let fixture: ComponentFixture<TargetAudienceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetAudienceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetAudienceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
