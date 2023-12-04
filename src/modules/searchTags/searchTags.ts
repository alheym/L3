import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchTags.tpl.html';
import { Tag } from './tag/tag';

export class SearchTags {
  view: View;
  tags!: string[];

  constructor() {
    this.view = new ViewTemplate(html).cloneView();
  }

  attach($root: HTMLElement) {
    $root.innerHTML = '';
    $root.appendChild(this.view.root);
  }

  update(tags: string[]) {
    this.tags = tags.filter(tagContent => tagContent !== '');
    this.render();
  }

  render() {
    this.view.root.innerHTML = '';

    this.tags.forEach((tagContent, index) => {
        const tagComp = new Tag(tagContent);
        tagComp.attach(this.view.root);
        tagComp.render();

        const isFirst = index === 0;
        const isUltimate = index === this.tags.length - 1;
        const isPenultimate = index === this.tags.length - 2;

        if (isUltimate) return;

        if (isFirst) {
            tagComp.view.root.insertAdjacentText('beforebegin', 'Например, ');
            tagComp.view.root.insertAdjacentText('afterend', ', ');
        } else if (isPenultimate) {
            tagComp.view.root.insertAdjacentText('afterend', ' или ');
        } else {
            tagComp.view.root.insertAdjacentText('afterend', ', ');
        }
    });
  }
}