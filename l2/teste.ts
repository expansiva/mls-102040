/// <mls fileReference="_102040_/l2/teste.ts" enhancement="_102020_/l2/enhancementAura"/>

import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { StateLitElement } from '/_102029_/l2/stateLitElement.js';
import { initState, getState } from '/_102029_/l2/collabState.js';
import '/_102040_/l2/molecules/groupviewtable/ml-data-table-minimal'
import '/_102033_/l2/molecules/groupentertext/ml-floating-text-input'

@customElement('teste-102040')
export class Teste102040 extends StateLitElement {

  @property() data:any = [];

  constructor() {
    super();
    
  }

  connectedCallback() {
    super.connectedCallback();
    initState('test', { users: [{ name: 'Lucas', age: 22, cod: 1, role: 'admin' }] })
    this.data = getState('test.users');
    console.log('dados 1', this.data);
    //this.requestUpdate();
  }

  
  render() {
    //const data = getState('test')
    console.log('dados ddd', this.data);

    return html`
<groupviewtable--ml-data-table-minimal
  value=""
  error=""
  selectable="false"
  is-editing="false"
  page="1"
  page-size="0"
  total-items="0"
  disabled="false"
  loading="false"
>
  <Caption>Users</Caption>
  <TableHeader>
    <TableRow>
      <TableHead key="id">ID</TableHead>
      <TableHead key="name">Name</TableHead>
      <TableHead key="role">Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    ${this.data.map((item: any, index: number) => {
      return html`    <TableRow>
      <TableCell>${index + 1}</TableCell>
      <TableCell>${item.name}</TableCell>
      <TableCell>${item.role}</TableCell>
    </TableRow>
` 
    })}
  </TableBody>
</groupviewtable--ml-data-table-minimal>
    `;
  }
  
}
