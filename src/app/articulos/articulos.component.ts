import { Component, inject } from '@angular/core';
import { ArticulosService } from '../servicios/articulos.service';
import { RecordWorkspace, RecordWorkspaceComponent } from '../shared/ui/record-workspace.component';

@Component({
  selector: 'app-articulos',
  standalone: true,
  imports: [RecordWorkspaceComponent],
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.css'],
})
export class ArticulosComponent {
  private readonly service = inject(ArticulosService);
  readonly workspace: RecordWorkspace = {
    title: 'Artículos',
    singular: 'Artículo',
    group: 'Inventario',
    description: 'Administra los artículos, sus existencias y su proveedor.',
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
      },
      {
        "key": "proveedor",
        "label": "Proveedor",
        "required": true,
        "hint": "Conserva el nombre o código que utiliza tu registro actual."
      }
    ],
    list: () => this.service.consultartodoArticulo(),
    create: record => this.service.insertarArticulo(record),
    update: record => this.service.modificarArticulo(record),
    remove: record => this.service.eliminarArticulo(record),
  };
}
