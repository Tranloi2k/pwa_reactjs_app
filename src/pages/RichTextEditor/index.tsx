import React, { useState } from "react";
import { EditorState, RichUtils, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const RichTextEditor = () => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (newEditorState: React.SetStateAction<EditorState>) => {
    setEditorState(newEditorState);
  };

  const handleSave = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    console.log(content); // Save or process the content as needed
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  return (
    <div>
      <h1>Rich Text Editor</h1>
      <Editor
        editorState={editorState}
        onEditorStateChange={onEditorStateChange}
        // handleKeyCommand={handleKeyCommand}

        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
      />
      <button onClick={handleSave} style={{ marginTop: "10px" }}>
        Save
      </button>
    </div>
  );
};

export default RichTextEditor;