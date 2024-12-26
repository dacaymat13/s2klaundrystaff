import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepIncomeComponent } from './rep-income.component';

describe('RepIncomeComponent', () => {
  let component: RepIncomeComponent;
  let fixture: ComponentFixture<RepIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
