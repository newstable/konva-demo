export class NodeElement {
  id: string;
  name: string; // type
  object?: any; // canvas object

  constructor(id = '', name = '', object = '') {
    this.id = id;
    this.name = name;
    this.object = object;
  }

  initNode(node: NodeElement) {
    this.id = node.id;
    this.name = node.name;
    this.object = node.object;
  }
}
