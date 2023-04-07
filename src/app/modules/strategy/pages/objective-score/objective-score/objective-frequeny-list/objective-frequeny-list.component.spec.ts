import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveFrequenyListComponent } from './objective-frequeny-list.component';

describe('ObjectiveFrequenyListComponent', () => {
  let component: ObjectiveFrequenyListComponent;
  let fixture: ComponentFixture<ObjectiveFrequenyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveFrequenyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveFrequenyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
