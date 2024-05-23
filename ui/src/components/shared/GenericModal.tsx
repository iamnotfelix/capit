import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";

type GenericModalType = {
  title: string;
  content: string;
  isVisible: boolean;
  actions: React.JSX.Element;
  onClose: () => void;
};

export const GenericModal = (props: GenericModalType) => {
  const { title, content, isVisible, actions, onClose } = props;

  return (
    <View style={layout.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={layout.centeredView}>
          <View style={styles.modal}>
            <View style={layout.headerContainer}>
              <View style={layout.titleContainer}>
                <Text style={styles.headerText}>{title}</Text>
              </View>
              <View style={layout.closeButtonContainer}>
                <TouchableOpacity onPress={onClose}>
                  <Entypo name="cross" size={30} color={"#f1f1f1"} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={layout.contentContainer}>
              <Text style={styles.modalText}>{content}</Text>
            </View>
            <View style={layout.actionsContainer}>{actions}</View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const layout = StyleSheet.create({
  centeredView: {
    // TODO: find a better way flex 1 does not work on ProfileScreen that is why can't center with flex
    top: 270,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    paddingLeft: 15,
    paddingVertical: 10,
    paddingRight: 7,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 10,
    paddingTop: 3,
  },
  closeButtonContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  actionsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

const styles = StyleSheet.create({
  modal: {
    margin: 20,

    // backgroundColor: "#141414",
    // backgroundColor: "#1f1f1f",
    backgroundColor: "#001A1F",

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalText: {
    marginBottom: 15,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
