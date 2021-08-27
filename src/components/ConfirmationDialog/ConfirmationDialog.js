import RNDialog from "react-native-dialog";
import React from "react";

export const ConfirmationDialog = (props) => {
  const {
    visible,
    title,
    onCancel,
    onSave,
    description,
    confirmButtonTitle,
  } = props;
  if (!visible) {
    return null;
  }
  return (
    <RNDialog.Container visible={visible}>
      <RNDialog.Title>{title || "Title"}</RNDialog.Title>
      <RNDialog.Description>
        {description || "Are you sure you want to delete?"}
      </RNDialog.Description>
      <RNDialog.Button label={"Cancel"} onPress={onCancel} />
      <RNDialog.Button
        label={confirmButtonTitle || "Remove"}
        onPress={() => onSave()}
      />
    </RNDialog.Container>
  );
};
