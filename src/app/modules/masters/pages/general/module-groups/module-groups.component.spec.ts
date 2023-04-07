import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleGroupsComponent } from './module-groups.component';

describe('ModuleGroupsComponent', () => {
  let component: ModuleGroupsComponent;
  let fixture: ComponentFixture<ModuleGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
