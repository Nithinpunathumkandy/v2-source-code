import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaDetailComponent } from './bia-detail.component';

describe('BiaDetailComponent', () => {
  let component: BiaDetailComponent;
  let fixture: ComponentFixture<BiaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
