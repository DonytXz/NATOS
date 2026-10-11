import { Component, inject } from '@angular/core';
import { TarimasService } from '../servicios/tarimas.service';
import { RecordWorkspace, RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

@Component({
  selector: 'app-tarimas',
  standalone: true,
  imports: [RecordWorkspaceComponent],
  templateUrl: './tarimas.component.html',
})
export class TarimasComponent {
  private readonly service = inject(TarimasService);
  readonly workspace: RecordWorkspace = {
    title: 'Tarimas',
    singular: 'Tarima',
    group: 'Inventario',
    description: 'Consulta las tarimas y mantén sus cantidades y precios al día.',
    nameKey: 'descripcion',
    fields: [
      {
        "key": "id",
        "label": "Código",
        "required": true
      },
      {
        "key": "descripcion",
        "label": "Descripción",
        "required": true
      },
      {
        "key": "tipo",
        "label": "Tipo",
        "required": true
      },
      {
        "key": "cantidad",
        "label": "Cantidad",
        "required": true,
        "kind": "number",
        "min": 0,
        "integer": true
      },
      {
        "key": "precio",
        "label": "Precio (MXN)",
        "required": true,
        "kind": "money",
        "min": 0.01
      }
    ],
    list: () => this.service.consultartodoTarima(),
    create: record => this.service.insertarTarima(record),
    update: record => this.service.modificarTarima(record),
    remove: record => this.service.eliminarTarima(record),
  };
}
