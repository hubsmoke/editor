import React from 'react';
// import { makeStyles, createStyles, Tooltip } from '@material-ui/core';

// const useStyles = makeStyles(() =>
//   createStyles({
//     root: {
//       font: '11px SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
//       fontSize: 11,
//       '& kbd': {
//         backgroundColor: '#fafbfc',
//         border: '1px solid #c6cbd1',
//         borderBottomColor: '#959da5',
//         borderRadius: 3,
//         boxShadow: 'inset 0 -1px 0 #959da5',
//         color: '#444d56',
//         padding: '3px 5px',
//       },
//     },
//   }),
// );

const mac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

function createShortcut(str: string) {
  return str
    .replace('Shift', '⇧ Shift')
    .replace('Enter', '↵ Enter')
    .replace('Backspace', '← Backspace')
    .replace('Tab', '↹ Tab')
    .replace('Mod', mac ? '⌘ Command' : 'Ctrl')
    .replace('Alt', mac ? '⌥ Option' : 'Alt')
    .replace('Up', '↑ Up')
    .replace('Down', '↓ Down')
    .replace('Left', '← Left')
    .replace('Right', '→ Right')
    .split('-');
}

type Props = {
  shortcut: string | string[];
};

const Keyboard = (props: Props) => {
  const { shortcut } = props;
  // const classes = useStyles();
  const array = typeof shortcut === 'string' ? createShortcut(shortcut) : shortcut;
  const text = array.join(' + ');
  return (
    // <Tooltip title={text}>
    <span
      style={{
        font: '11px SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
        fontSize: 11,
      }}
    >
      {array.map((s) => (
        <kbd
          key={s}
          style={{
            backgroundColor: '#fafbfc',
            border: '1px solid #c6cbd1',
            borderBottomColor: '#959da5',
            borderRadius: 3,
            boxShadow: 'inset 0 -1px 0 #959da5',
            color: '#444d56',
            padding: '3px 5px',
          }}
        >
          {s.split(' ')[0]}
        </kbd>
      ))}
    </span>
    // </Tooltip>
  );
};

export default Keyboard;
