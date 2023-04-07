import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventScopeLoaderComponent } from './event-scope-loader.component';

describe('EventScopeLoaderComponent', () => {
  let component: EventScopeLoaderComponent;
  let fixture: ComponentFixture<EventScopeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventScopeLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventScopeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
