import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerListPage } from './worker-list.page';

describe('WorkerListPage', () => {
  let component: WorkerListPage;
  let fixture: ComponentFixture<WorkerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
