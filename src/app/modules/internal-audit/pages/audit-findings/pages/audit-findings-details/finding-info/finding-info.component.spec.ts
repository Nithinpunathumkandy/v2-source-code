import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingInfoComponent } from './finding-info.component';

describe('FindingInfoComponent', () => {
  let component: FindingInfoComponent;
  let fixture: ComponentFixture<FindingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
