import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewSaleActivityLogComponent } from './view-sale-activity-log.component';

describe('ViewSaleActivityLogComponent', () => {
  let component: ViewSaleActivityLogComponent;
  let fixture: ComponentFixture<ViewSaleActivityLogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSaleActivityLogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSaleActivityLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
