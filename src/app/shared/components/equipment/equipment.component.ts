import { Component, OnInit, Input } from '@angular/core';
import { Equipment } from '../../../interfaces/equipment';
import { EquipmentService } from '../../../services/equipment.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss'],
})
export class EquipmentComponent implements OnInit {

  public equipments: Equipment[];

  @Input() isCheckable: boolean; /* exibe lista com componente ion-checkbox */
  @Input() result: Equipment[] = []; /* expõe resultado da selação */
  @Input() workRef: string ; /* recebe caminho da origem da coleção de equipments */
  @Input() dailyRef: string; /* recebe caminho da origem da coleção de equipments */

  constructor(
    private equipmentService: EquipmentService
  ) { }

  ngOnInit() {
    this.workRef === undefined ?
    this.equipmentService.getAll().subscribe(data => {this.equipments = data})
    :this.equipmentService.getAllFrom(this.workRef, this.dailyRef)
       .subscribe(data => {
          if (data && data.length > 0) {
            console.log(data);
            this.equipments = data;
          }
       })
  }

  /* controle os workers selecionados no componente e expõe para o utilizador do mesmo */
  onChange(equipment: Equipment, checked: boolean) {
    if (checked) {
      this.result.push(equipment);
    } else {
      this.result.splice(this.result.indexOf(equipment), 1);
    }
  }

}
