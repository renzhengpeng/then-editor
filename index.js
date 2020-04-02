import './src/style/index.scss';
import './src/utils/polyfill';
import './src/asserts/font/style.scss';
import BdfintEditor from './src/instance';

window.BdfintEditor = window.BdfintEditor || BdfintEditor;
export default BdfintEditor;
