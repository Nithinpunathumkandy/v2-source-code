import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaDetailsPageComponent } from './bia-details-page.component';

describe('BiaDetailsPageComponent', () => {
  let component: BiaDetailsPageComponent;
  let fixture: ComponentFixture<BiaDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaDetailsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
