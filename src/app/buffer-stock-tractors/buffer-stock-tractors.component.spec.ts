import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BufferStockTractorsComponent } from './buffer-stock-tractors.component';

describe('BufferStockTractorsComponent', () => {
  let component: BufferStockTractorsComponent;
  let fixture: ComponentFixture<BufferStockTractorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferStockTractorsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BufferStockTractorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
