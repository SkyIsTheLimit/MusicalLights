export type ProcessedMIDIMessage = {
  cc: number;
  value: number;
  velocity: number;
  noteName: string;
  accidental: boolean;
  octave: number;
};

export type LightColor = {
  hue?: number;
  saturation?: number;
  kelvin?: number;
};

export type Light = {
  id: string;
  label: string;
  connected: boolean;
  power: string;
  color: LightColor;
  brightness: number;
  group: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
};

let bearerToken = null;

export function setBearerToken(token: string) {
  bearerToken = token;
}

export function getBearerToken() {
  return bearerToken;
}

export function listLights() {
  return fetch('https://api.lifx.com/v1/lights/all', {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  }).then((res) => res.json() as any as Light[]);
}

export function setState(state: Record<string, any>, selector = 'all') {
  return fetch(`https://api.lifx.com/v1/lights/${selector}/state`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(state),
  })
    .then((res) => res.json())
    .then((data) => console.log('Data', data));
}

export function setRandomColorAtSaturation(
  saturation: number,
  selector = 'all'
) {
  setState(
    {
      color: { saturation, hue: (Math.random() * 1000) % 360 } as LightColor,
    },
    selector
  );
}

export function processMIDIMessage(message: ProcessedMIDIMessage) {
  if (message.cc === 144) {
    //setRandomColorAtSaturation(message.velocity / 127);
  }
}
