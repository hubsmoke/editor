import { MyNodeSpec, NodeGroups } from './types';
import { MdFormatSerialize, TexFormatSerialize } from '../serialize/types';
import { StaticPhrasingContent, LinkBlock } from '../spec';

export interface Attrs {
  title: string;
  description: string;
  url: string;
}

const link_block: MyNodeSpec<Attrs, LinkBlock> = {
  attrs: {
    url: { default: '' },
    title: { default: '' },
    description: { default: '' },
  },
  group: NodeGroups.top,
  content: `${NodeGroups.text}*`,
  selectable: true,
  draggable: true,
  atom: true,
  parseDOM: [
    {
      tag: 'div[title][data-url].link-block',
      getAttrs(dom: any) {
        const attrs = {
          url: dom.getAttribute('data-url') || null,
          title: dom.getAttribute('title') || '',
          description: dom.textContent || '',
        };
        return attrs;
      },
    },
  ],
  toDOM(node: any) {
    const { title, description, url } = node.attrs;
    return [
      'div',
      {
        'data-url': url || undefined,
        title,
        class: 'link-block',
      },
      description,
    ];
  },
  attrsFromMyst: (token) => {
    let description = '';
    if (token.children.length && token.children[0].type === 'text') {
      description = token.children[0].value;
    }
    return {
      url: token.url,
      title: token.title || '',
      description,
    };
  },
  toMyst: (props) => {
    return {
      type: 'linkBlock',
      url: props['data-url'],
      title: props.title || undefined,
      children: (props.children || []) as StaticPhrasingContent[],
    };
  },
};

export const toMarkdown: MdFormatSerialize = (state, node) => {
  // TODO Replace with link block directive...?
  state.ensureNewLine();
  state.write(`\n[${node.attrs.description}](${node.attrs.url} ${node.attrs.title})\n\n`);
};

export const toTex: TexFormatSerialize = (state, node) => {
  state.write('TODO: translate linkblock tex');
};

export default link_block;
