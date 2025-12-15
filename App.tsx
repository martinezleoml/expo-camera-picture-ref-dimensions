import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const camera = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleTakePictureWithRef = async () => {
    const photo = await camera.current?.takePictureAsync({ pictureRef: true });

    Alert.alert(
      "Picture with ref",
      `Width: ${photo?.width.toString() ?? "0"}, Height: ${
        photo?.height.toString() ?? "0"
      }`
    );
  };

  const handleTakePictureWithoutRef = async () => {
    const photo = await camera.current?.takePictureAsync();

    Alert.alert(
      "Picture without ref",
      `Width: ${photo?.width.toString() ?? "0"}, Height: ${
        photo?.height.toString() ?? "0"
      }`
    );
  };

  return (
    <View style={styles.container}>
      <CameraView ref={camera} style={styles.camera} facing={"back"} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTakePictureWithRef}
        >
          <Text style={styles.text}>Take picture with ref</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTakePictureWithoutRef}
        >
          <Text style={styles.text}>Take picture without ref</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
    padding: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
