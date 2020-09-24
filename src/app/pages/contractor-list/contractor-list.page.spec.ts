import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractorListPage } from './contractor-list.page';

describe('ContractorListPage', () => {
  let component: ContractorListPage;
  let fixture: ComponentFixture<ContractorListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractorListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractorListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
