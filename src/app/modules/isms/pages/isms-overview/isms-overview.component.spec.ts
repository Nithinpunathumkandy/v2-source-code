import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsOverviewComponent } from './isms-overview.component';

describe('IsmsOverviewComponent', () => {
  let component: IsmsOverviewComponent;
  let fixture: ComponentFixture<IsmsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
