import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskListComponent } from './isms-risk-list.component';

describe('IsmsRiskListComponent', () => {
  let component: IsmsRiskListComponent;
  let fixture: ComponentFixture<IsmsRiskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
