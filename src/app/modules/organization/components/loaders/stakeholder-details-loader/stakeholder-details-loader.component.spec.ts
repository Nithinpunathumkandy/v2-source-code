import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StakeholderDetailsLoaderComponent } from './stakeholder-details-loader.component';

describe('StakeholderDetailsLoaderComponent', () => {
  let component: StakeholderDetailsLoaderComponent;
  let fixture: ComponentFixture<StakeholderDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StakeholderDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StakeholderDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
