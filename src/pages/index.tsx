import React from 'react';
import { getMIDIDevices } from '../lib/midi';
import { Light, listLights, processMIDIMessage } from '../lib/utils';
import LightComponent from '../components/light';

export const accidentals = [
  '',
  '#',
  '',
  '#',
  '',
  '',
  '#',
  '',
  '#',
  '',
  '#',
  '',
];

export const notes = [
  'C',
  'C',
  'D',
  'D',
  'E',
  'F',
  'F',
  'G',
  'G',
  'A',
  'A',
  'B',
];

const MIDI_ON_CC = 144;
const MIDI_OFF_CC = 128;

export type MidiMessage = {
  data: Uint8Array[];
};

export type ProcessedMIDIMessage = {
  cc: number;
  value: number;
  velocity: number;
  noteName: string;
  accidental: boolean;
  octave: number;
};

class HomePage extends React.Component<
  any,
  {
    messages: ProcessedMIDIMessage[];
    pressedNotes: {
      [octave: number]: string[];
    };
    lights: Light[];
    device: any;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      messages: [],
      pressedNotes: {},
      lights: props.lights || [],
      device: undefined,
    };
  }

  static async getInitialProps(ctx: any) {
    const lights = await listLights();

    return { lights };
  }

  async componentDidMount() {
    getMIDIDevices().then((devices: any[]) => {
      devices.forEach((device: any) => {
        if (!this.state.device) {
          this.setState({
            device,
          });
        }

        console.log('Device', device);
        device.onmidimessage = (msg: any) => {
          const [cc, value, velocity] = msg.data;

          const octave = Math.floor(value / 12);
          const noteName = `${notes[value % 12]}`;
          const accidental = !!accidentals[value % 12].length;

          const fullNote = `${noteName}${accidental ? '#' : ''}`;

          if (cc == MIDI_ON_CC) {
            this.setState({
              pressedNotes: {
                ...this.state.pressedNotes,
                [octave]: [
                  ...(this.state.pressedNotes[octave] || []),
                  fullNote,
                ],
              },
            });
          } else if (cc == MIDI_OFF_CC) {
            this.setState({
              pressedNotes: {
                ...this.state.pressedNotes,
                [octave]: [
                  ...this.state.pressedNotes[octave]?.filter(
                    (note) => note !== fullNote
                  ),
                ],
              },
            });
          }

          const newMsg: ProcessedMIDIMessage = {
            cc,
            value,
            velocity,
            noteName,
            octave,
            accidental,
          };

          const existingMessage = this.state.messages.filter(
            (msg) => msg.value === newMsg.value && msg.cc === MIDI_ON_CC
          );

          if (existingMessage.length) {
            existingMessage[0].cc = MIDI_OFF_CC;

            this.setState({
              ...this.state,
            });
          } else {
            this.setState({
              messages: [newMsg, ...this.state.messages],
            });
          }

          processMIDIMessage(newMsg);
        };
      });
    });
  }

  render() {
    const getAccidental = (msg: ProcessedMIDIMessage) =>
      msg.accidental ? <sup>#</sup> : <></>;

    return (
      <div className='mx-auto'>
        <div className='flex'>
          <div className='flex-[2] px-4'>
            <div>
              <h2 className='text-2xl font-bold'>
                All Lights ({this.state.lights.length})
              </h2>
              {this.state.lights.map((light: any, index: number) => (
                <div key={index} className='flex-2'>
                  <LightComponent light={light} />
                </div>
              ))}
            </div>

            <div className='mt-12 fixed bottom-0 left-0 w-[512px] shadow-md border-[0.25em] border-neutral-200 p-4'>
              <div>
                <div className='bg-white rounded-md border-neutral-200 border-[0.25em] border-0'>
                  <div className='flex items-center'>
                    <p className='w-6 h-6 inline-block mr-4 bg-green-400 rounded-full'></p>
                    <h2 className='text-lg font-bold flex'>
                      {this.state.device?.manufacturer}{' '}
                      {this.state.device?.name}
                    </h2>
                    <h2 className='text-md uppercase font-bold bg-green-400 px-4 py-1 rounded-full ml-4'>
                      Connected MIDI Controller
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-[4] px-4'>
            <h2 className='text-2xl font-bold'>MIDI Notes Played</h2>

            <div className='relative flex flex-wrap bg-neutral-700 mt-4 shadow-md min-h-[50vh] items-start content-start'>
              {this.state.messages.length === 0 ? (
                <>
                  <div className='absolute top-0 left-0 flex justify-center items-center w-full h-full'>
                    <p className='text-center text-2xl font-light text-neutral-400'>
                      Nothing to see here. Play some notes to get this started.
                    </p>
                  </div>
                </>
              ) : (
                <></>
              )}
              {this.state.messages.map(
                (msg: ProcessedMIDIMessage, index: number) => (
                  <div
                    key={index}
                    className='message min-w-fit flex items-center px-8 py-1 bg-neutral-600 m-4'
                  >
                    {msg.cc === 144 ? (
                      <span className='inline-block rounded-full p-2 text-green-400 bg-green-400 mr-2'></span>
                    ) : (
                      <span className='inline-block rounded-full p-2 bg-red-400 mr-2'></span>
                    )}

                    <span className='inline-block text-lg font-semibold text-neutral-100'>
                      {/* {Math.round((msg.velocity / 127) * 10) / 10} */}

                      <span className='text-2xl'>
                        {msg.noteName}
                        {getAccidental(msg)}
                        <sub>{msg.octave}</sub>
                      </span>
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
