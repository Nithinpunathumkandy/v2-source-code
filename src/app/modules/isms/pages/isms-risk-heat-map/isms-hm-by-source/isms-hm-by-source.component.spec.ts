import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsHmBySourceComponent } from './isms-hm-by-source.component';

describe('IsmsHmBySourceComponent', () => {
  let component: IsmsHmBySourceComponent;
  let fixture: ComponentFixture<IsmsHmBySourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsHmBySourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsHmBySourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
