import { Component, inject } from '@angular/core';
import { VentasService } from '../servicios/ventas.service';
import { RecordWorkspace, RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [RecordWorkspaceComponent],
  templateUrl: './ventas.component.html',
})
export class VentasComponent {
  private readonly service = inject(VentasService);
  readonly workspace: RecordWorkspace = {
    title: 'Ventas',
    singular: 'Venta',
    group: 'Operaciones',
    description: 'Consulta y registra las solicitudes de venta de tarimas.',
    nameKey: 'descripcion_tarima',
    fields: [
      {
        "key": "id",
        "label": "Código",
        "required": true
      },
      {
        "key": "cliente",
        "label": "Cliente",
        "required": true
      },
      {
        "key": "id_tarima",
        "label": "Código de tarima",
        "required": true
      },
      {
        "key": "descripcion_tarima",
        "label": "Descripción de la tarima",
        "required": true
      },
      {
        "key": "cantidad",
        "label": "Cantidad",
        "required": true,
        "kind": "number",
        "min": 1,
        "integer": true
      },
      {
        "key": "precio_tarima",
        "label": "Precio (MXN)",
        "required": true,
        "kind": "money",
        "min": 0.01
      }
    ],
    list: () => this.service.consultartodoVenta(),
    create: record => this.service.insertarVenta(record),
    update: record => this.service.modificarVenta(record),
    remove: record => this.service.eliminarVenta(record),
  };
}
