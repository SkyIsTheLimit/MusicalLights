import React from 'react';
import { getMIDIDevices } from '../lib/midi';
import { Light, listLights, processMIDIMessage } from '../lib/utils';
import LightComponent from '../components/light';
import { Piano } from '../components/piano/piano';

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

    const pressedNotes = this.state.messages.filter((msg) => msg.cc === 144);

    return (
      <div className='mx-auto'>
        <div className='flex'>
          <div className='flex-[2] px-4'>
            <div>
              <h2 className='text-2xl font-bold'>
                All Lights ({this.state.lights.length})
              </h2>
              {this.state.lights?.length ? (
                this.state.lights.map((light: any, index: number) => (
                  <div key={index} className='flex-2'>
                    <LightComponent light={light} />
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className='flex-[4] px-4'>
            <h2 className='text-2xl font-bold'>MIDI Notes Played</h2>

            <div className='relative p-4 flex flex-wrap bg-neutral-700 mt-4 shadow-md items-start content-start'>
              <Piano pressedNotes={pressedNotes}></Piano>
            </div>

            <div className='mt-12 border-[0.25em] w-fit mx-auto border-green-200 p-8 bg-green-100 dark:bg-green-900 dark:border-green-800'>
              <div>
                <div>
                  <div className='flex items-center'>
                    <h2 className='text-md uppercase font-bold bg-neutral-900 text-neutral-100 px-4 py-2 rounded-full mr-4'>
                      <p
                        className='w-2 h-2 inline-block mr-4 border-2 border-green-400 bg-green-400 dark:bg-green-500 dark:border-green-500 rounded-full relative bottom-[0.125em]'
                        style={{
                          boxShadow: '0 0 3px 2px #4ADE80',
                        }}
                      ></p>
                      Connected
                    </h2>
                    <h2 className='text-lg font-bold flex'>
                      {this.state.device?.manufacturer}{' '}
                      {this.state.device?.name}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
