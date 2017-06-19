import React from 'react';
import ReactDOM from 'react-dom';

import {EditorState} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';

// import './Styles/Draft.css';

const imagePlugin = createImagePlugin();
const editorState = EditorState.createEmpty();

// The Editor accepts an array of plugins. In this case, only the imagePlugin
// is passed in, although it is possible to pass in multiple plugins.
const ContentEditor = ({ editorState, onChange }) => (
  <Editor
    editorState={editorState}
    onChange={onChange}
    plugins={[imagePlugin]}
  />
);

export default ContentEditor;