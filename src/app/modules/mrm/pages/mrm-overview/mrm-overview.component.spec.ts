import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrmOverviewComponent } from './mrm-overview.component';

describe('MrmOverviewComponent', () => {
  let component: MrmOverviewComponent;
  let fixture: ComponentFixture<MrmOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MrmOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MrmOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
