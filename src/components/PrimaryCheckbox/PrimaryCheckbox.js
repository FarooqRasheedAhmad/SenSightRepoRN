import { AppConstants, StorageUtils, showMessage } from "../../utils";
import React, { useEffect, useState } from "react";

import { CheckBox } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import { api } from "../../api";
import { theme } from "../../theme";

export const PrimaryCheckbox = ({ id: caregiverId, value, fetchUsers }) => {
  const [checkbox, setCheckbox] = useState(value);
  const [loadingPrimary, setLoadingPrimary] = useState(false);

  useEffect(() => {}, [checkbox]);

  const onCheckPrimary = async () => {
    setCheckbox(true);
    setLoadingPrimary(true);

    const token = await StorageUtils.getValue(AppConstants.SP.ACCESS_TOKEN);
    const body = new FormData();
    body.append("caregiverId", caregiverId);
    body.append("setPriority", 1);

    try {
      const res = await fetch(api.caregiverPriority, {
        method: "put",
        headers: { Accept: "application/json", "Content-Type": "multipart/form-data", Authorization: "Bearer " + token,
        },
        body,
      });

      // console.log("res: ", res);
      if (res) {
        // setLoadingPrimary(false);
        if (res.ok) {
          const json = await res.json();
          
          if (json) {
            setLoadingPrimary(false);
            showMessage("Supervisor set as primary cargiver");
            if (fetchUsers) fetchUsers();
          }

        } else {
          setCheckbox(false);
          showMessage("Error!", "long");
        }
      }
    } catch (error) {
      console.log("error: ", error);
      
      setLoadingPrimary(false);
      setCheckbox(false);
      showMessage("Error!", "long");
    }
  };

  return (
    <>
      <Spinner visible={loadingPrimary} />
      <CheckBox
        title={`${checkbox ? "Set" : "Set"} Primary`}
        containerStyle={{ width: "96%", marginVertical: 12 }}
        size={32}
        checked={checkbox}
        checkedColor={theme.colors.colorPrimary}
        onPress={checkbox ? undefined : onCheckPrimary}
      />
    </>
  );
};
