import { InputRule } from 'prosemirror-inputrules';
import { NodeType, MarkType, Node } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';

type GetAttrs = {
  content?: Node<any>;[key: string]: any;
} | ((p: string[]) => { content?: Node<any>;[key: string]: any });

// https://discuss.prosemirror.net/t/input-rules-for-wrapping-marks/537/11
export function markInputRule(
  regexp: RegExp,
  markType: MarkType,
  options?: {
    getAttrs?: GetAttrs;
    getText?: (p: string[]) => string;
    addSpace?: boolean;
  },
) {
  return new InputRule(regexp, (state, match, start, end) => {
    const { getAttrs, getText, addSpace } = options ?? {};
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const { tr } = state;
    if (state.doc.rangeHasMark(start, end, markType)) {
      return null;
    }
    const mark = markType.create(attrs);
    tr.delete(start, end);
    const text = getText?.(match) ?? match[1];
    tr.insertText(text);
    tr.addMark(start, start + text.length, mark);
    tr.removeStoredMark(markType);
    if (addSpace) tr.insertText(' ');
    return tr;
  });
}

export function insertNodeRule(
  regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs,
  select: boolean | ((p: string[]) => boolean) = false,
  test?: (p: string[]) => boolean,
) {
  // return textblockTypeInputRule(/^\$\$\s$/, nodeType);
  return new InputRule(regExp, (state, match, start, end) => {
    if (test && !test(match)) return null;
    const { content, ...attrs } = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) ?? {};
    const tr = state.tr.delete(start, end).replaceSelectionWith(
      nodeType.create(attrs, content), false,
    ).scrollIntoView();
    const doSelect = select instanceof Function ? select(match) : select;
    if (!doSelect) return tr;
    const nodeSize = tr.selection.$anchor.nodeBefore?.nodeSize ?? 0;
    const resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);
    const selected = tr.setSelection(new NodeSelection(resolvedPos));
    return selected;
  });
}

export function replaceNodeRule(
  regExp: RegExp, nodeType: NodeType, getAttrs?: GetAttrs,
  select: boolean | ((p: string[]) => boolean) = false,
) {
  // return textblockTypeInputRule(/^\$\$\s$/, nodeType);
  return new InputRule(regExp, (state, match, start, end) => {
    const { content, ...attrs } = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) ?? {};
    const tr = state.tr.delete(start, end).replaceSelectionWith(
      nodeType.create(attrs, content), false,
    ).scrollIntoView();
    const doSelect = select instanceof Function ? select(match) : select;
    if (!doSelect) return tr;
    const resolvedPos = tr.doc.resolve(start - 1);
    const selected = tr.setSelection(new NodeSelection(resolvedPos));
    return selected;
  });
}
