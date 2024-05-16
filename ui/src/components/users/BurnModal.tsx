import React from "react";
import { Modal, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

type BurnModalType = {
  text: string;
  isVisible: boolean;
  onRequestClose: () => void;
  onBurn: () => void;
  onCancel: () => void;
};

export const BurnModal = (props: BurnModalType) => {
  const { text, isVisible, onRequestClose, onBurn, onCancel } = props;

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
            <View style={layout.closeButtonContainer}>
              <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                <Entypo name="cross" size={30} color={"#f1f1f1"} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>{text}</Text>
            <View style={layout.actionsContainer}>
              <TouchableOpacity onPress={onCancel} style={layout.actionButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onBurn} style={layout.actionButton}>
                <Text style={styles.buttonText}>Burn</Text>
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
    top: 300,
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
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  actionButton: {
    borderColor: "#505050",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    textAlign: "center",
  },
});
