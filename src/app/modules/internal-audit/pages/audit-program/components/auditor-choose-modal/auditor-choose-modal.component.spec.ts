import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorChooseModalComponent } from './auditor-choose-modal.component';

describe('AuditorChooseModalComponent', () => {
  let component: AuditorChooseModalComponent;
  let fixture: ComponentFixture<AuditorChooseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorChooseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditorChooseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
