export const midiHistory = {
  events: [],
};

export function onMidiMessage(message) {
  console.log(message.data);
}

export function getMIDIDevices() {
  return new Promise((resolve) => {
    (window.navigator as any).requestMIDIAccess().then((access) => {
      resolve(Array.from(access.inputs.values()));
    });
  });
}
