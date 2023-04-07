import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsCountListComponent } from './isms-count-list.component';

describe('IsmsCountListComponent', () => {
  let component: IsmsCountListComponent;
  let fixture: ComponentFixture<IsmsCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
