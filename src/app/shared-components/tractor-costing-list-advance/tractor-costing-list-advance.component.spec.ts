import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TractorCostingListAdvanceComponent } from './tractor-costing-list-advance.component';

describe('TractorCostingListAdvanceComponent', () => {
  let component: TractorCostingListAdvanceComponent;
  let fixture: ComponentFixture<TractorCostingListAdvanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TractorCostingListAdvanceComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TractorCostingListAdvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
