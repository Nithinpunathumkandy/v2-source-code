import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsAddRiskComponent } from './isms-add-risk.component';

describe('IsmsAddRiskComponent', () => {
  let component: IsmsAddRiskComponent;
  let fixture: ComponentFixture<IsmsAddRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsAddRiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsAddRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
