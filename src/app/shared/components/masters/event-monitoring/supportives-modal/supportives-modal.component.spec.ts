import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportivesModalComponent } from './supportives-modal.component';

describe('SupportivesModalComponent', () => {
  let component: SupportivesModalComponent;
  let fixture: ComponentFixture<SupportivesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportivesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportivesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
