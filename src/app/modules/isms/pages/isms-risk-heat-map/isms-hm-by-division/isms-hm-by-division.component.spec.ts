import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsHmByDivisionComponent } from './isms-hm-by-division.component';

describe('IsmsHmByDivisionComponent', () => {
  let component: IsmsHmByDivisionComponent;
  let fixture: ComponentFixture<IsmsHmByDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsHmByDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsHmByDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
