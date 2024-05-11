import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

type ThemeModalType = {
  text: string;
  isVisible: boolean;
  onRequestClose: () => void;
  onPress: () => void;
};

export const ThemeModal = (props: ThemeModalType) => {
  const { text, isVisible, onRequestClose, onPress } = props;

  const capitalize = (text: string) => {
    return text[0].toUpperCase() + text.slice(1).toLowerCase() + ".";
  };

  return (
    <View style={layout.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onRequestClose}
      >
        <View style={layout.centeredView}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>{capitalize(text)}</Text>
            <View style={layout.closeButtonContainer}>
              <TouchableOpacity onPress={onPress} style={styles.closeButton}>
                <Entypo name="cross" size={30} color={"#f1f1f1"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const layout = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

const styles = StyleSheet.create({
  modal: {
    margin: 20,
    padding: 35,

    backgroundColor: "rgba(0, 0, 0, 0.8)",

    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#505050",

    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
  },
  modalText: {
    marginBottom: 15,
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "italic",
  },
});
