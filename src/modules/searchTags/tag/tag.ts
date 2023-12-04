import { ViewTemplate } from '../../../utils/viewTemplate';
import { View } from '../../../utils/view';
import html from './tag.tpl.html';

export class Tag {
  view: View;
  text: string;

  constructor(text: string) {
    this.text = text;
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.appendChild(this.view.root);
  }

  render() {
    this.view.tagContent.textContent = this.text;
    (this.view.root as HTMLAnchorElement).href = `/search?query=${this.text}`;
    this.view.root.onclick = (e) => e.preventDefault();
  }
}