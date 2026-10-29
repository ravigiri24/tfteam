import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-delete-cash-reason',
  templateUrl: './delete-cash-reason.component.html',
  styleUrls: ['../add-cash-tractor/add-cash-tractor.component.scss', './delete-cash-reason.component.scss'],
})
export class DeleteCashReasonComponent {
  @Input() action: 'delete' | 'return' = 'delete';

  get isReturn(): boolean { return this.action === 'return'; }
  reasonForm = new FormGroup({
    deletedReason: new FormControl('', [Validators.required, Validators.pattern(/\S/)]),
  });

  constructor(private modalCtrl: ModalController) {}

  async confirm(): Promise<void> {
    this.reasonForm.markAllAsTouched();
    if (this.reasonForm.invalid) return;
    await this.modalCtrl.dismiss({
      [this.isReturn ? 'returnReason' : 'deletedReason']: this.reasonForm.controls.deletedReason.value!.trim(),
    }, 'confirm');
  }

  dismiss() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
