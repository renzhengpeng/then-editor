import Head from '../components/Head';
import Bold from '../components/Strong';
import Italic from '../components/Italic';
import FontSize from '../components/FontSize';
import FontFamily from '../components/FontFamily';
import Code from '../components/Code';
import Undo from '../components/Undo';
import Redo from '../components/Redo';
import Blockquote from '../components/Blockquote';
import Align from '../components/Align';
import Underline from '../components/Underline';
import StrikeThrough from '../components/StrikeThrough';
import HeightLight from '../components/HeightLight';
import List from '../components/List';
import Link from '../components/Link';
import Img from '../components/Img';
import Table from '../components/Table';
import Video from '../components/Video';
import Graffiti from '../components/Graffiti';

const config = {
  menus: [{
    title: 'Head',
    name: 'head',
    component: Head
  }, {
    title: 'FontSize',
    name: 'fontSize',
    component: FontSize
  }, {
    title: 'FontFamily',
    name: 'fontFamily',
    component: FontFamily
  }, {
    title: 'Bold',
    name: 'bold',
    component: Bold
  }, {
    title: 'Italic',
    name: 'italic',
    component: Italic
  }, {
    title: 'Underline',
    name: 'underline',
    component: Underline
  }, {
    title: 'StrikeThrough',
    name: 'strikeThrough',
    component: StrikeThrough
  }, {
    title: 'HeightLight',
    name: 'heightLight',
    component: HeightLight
  }, {
    title: 'List',
    name: 'list',
    component: List
  }, {
    title: 'Align',
    name: 'align',
    component: Align
  }, {
    title: 'Code',
    name: 'code',
    component: Code
  }, {
    title: 'Link',
    name: 'link',
    component: Link
  }, {
    title: 'Blockquote',
    name: 'blockquote',
    component: Blockquote
  }, {
    title: 'Img',
    name: 'img',
    component: Img
  }, {
    title: 'Table',
    name: 'table',
    component: Table
  }, {
    title: 'Video',
    name: 'video',
    component: Video
  }, {
    title: 'Graffiti',
    name: 'graffiti',
    component: Graffiti
  }, {
    title: 'Undo',
    name: 'undo',
    component: Undo
  }, {
    title: 'Redo',
    name: 'redo',
    component: Redo
  }],
  uploadPath: '',
  withCredentials: false,
  uploadQuery: {}
};

export default config;
