import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TractorPriceFranchiseComponent } from './tractor-price-franchise.component';

describe('TractorPriceFranchiseComponent', () => {
  let component: TractorPriceFranchiseComponent;
  let fixture: ComponentFixture<TractorPriceFranchiseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TractorPriceFranchiseComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TractorPriceFranchiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
