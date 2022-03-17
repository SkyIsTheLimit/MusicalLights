import React from 'react';
import { getMIDIDevices } from '../lib/midi';
import {
  getBearerToken,
  Light,
  listLights,
  processMIDIMessage,
  setBearerToken,
} from '../lib/utils';
import LightComponent from '../components/light';
import { Piano } from '../components/piano/piano';
import Head from 'next/head';

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
  {},
  {
    messages: ProcessedMIDIMessage[];
    pressedNotes: {
      [octave: number]: string[];
    };
    lights: Light[];
    selectedMidiDevice: WebMidi.MIDIInput;
    midiDevices: WebMidi.MIDIInput[];
    bearerToken: string;
  }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      messages: [],
      pressedNotes: {},
      lights: props.lights || [],
      selectedMidiDevice: undefined,
      midiDevices: [],
      bearerToken: getBearerToken(),
    };
  }

  async loadLights() {
    const lights = await listLights();

    this.setState({
      lights,
    });
  }

  static async getInitialProps(ctx: any) {
    const lights = await listLights();

    return { lights };
  }

  setSelectMidiDevice(device: WebMidi.MIDIInput) {
    this.setState({
      selectedMidiDevice: device,
    });

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
            [octave]: [...(this.state.pressedNotes[octave] || []), fullNote],
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
  }

  async componentDidMount() {
    const midiDevices = await getMIDIDevices();

    console.log('Devices', midiDevices);

    this.setState({
      midiDevices,
      selectedMidiDevice: midiDevices[0],
    });

    this.setSelectMidiDevice(midiDevices[0]);
  }

  render() {
    const pressedNotes = this.state.messages.filter((msg) => msg.cc === 144);
    return (
      <div className='mx-auto'>
        <Head>
          <title>Musical Lights</title>
          <link rel='icon' href='/favicon-32x32.png' />
        </Head>
        <div className='flex flex-col max-w-screen-xl mx-auto'>
          <div className='mb-12'>
            <h2 className='text-2xl font-bold'>
              All Lights ({this.state.lights?.length || '0'})
            </h2>
            {this.state.lights?.length ? (
              <div className='flex flex-wrap justify-between'>
                {this.state.lights?.length ? (
                  this.state.lights?.map((light: any, index: number) => (
                    <div key={index} className='mr-4 last:mr-0'>
                      <LightComponent light={light} />
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div>
                <p>No Lights Found</p>
                {!this.state.bearerToken ? (
                  <>
                    <p>No Bearer Token Found, please enter bearer token.</p>
                    <input
                      type='text'
                      id='bearerToken'
                      name='bearerToken'
                      className='bg-transparent border-2 border-neutral-700'
                    />
                    <button
                      className='on-btn'
                      onClick={() => {
                        const token = (
                          document.getElementById(
                            'bearerToken'
                          ) as HTMLInputElement
                        ).value;

                        console.log('Token', token);
                        if (token) {
                          setBearerToken(token);
                          this.setState({
                            bearerToken: token,
                          });
                          this.loadLights();
                        }
                      }}
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>

          <div className='mb-12 flex items-start'>
            <div className='flex flex-col flex-[1] border-neutral-800 mr-12'>
              <h2 className='text-2xl font-bold mb-4'>
                Select MIDI Controller
              </h2>
              {this.state.midiDevices.length ? (
                <>
                  {this.state.midiDevices.map((device) => (
                    <div
                      key={device.id}
                      className={`p-4 mb-1  cursor-pointer text-xl ${
                        device === this.state.selectedMidiDevice
                          ? 'bg-neutral-700 text-neutral-200 font-bold'
                          : 'bg-neutral-800 text-neutral-500'
                      }`}
                    >
                      <p onClick={() => this.setSelectMidiDevice(device)}>
                        {device.manufacturer} {device.name}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>

            <div className='flex-[4]'>
              <h2 className='text-2xl font-bold'>MIDI Notes Played</h2>

              <div>
                <div className='flex flex-col flex-[6]'>
                  <div className='flex items-start mb-4'>
                    <h2 className='text-lg font-bold flex mt-2'>
                      {this.state.selectedMidiDevice?.manufacturer}{' '}
                      {this.state.selectedMidiDevice?.name}
                    </h2>
                    <h2 className='text-md uppercase font-bold bg-neutral-700 text-neutral-200 px-4 py-2 rounded-full ml-4'>
                      {pressedNotes.length ? (
                        <p
                          className='w-2 h-2 inline-block mr-2 border-2 border-green-400 bg-green-400 dark:bg-green-500 dark:border-green-500 rounded-full relative bottom-[0.125em]'
                          style={{
                            boxShadow: '0 0 3px 1.5px rgb(34 197 94)',
                          }}
                        ></p>
                      ) : (
                        <p
                          className='w-2 h-2 inline-block mr-2 border-2 border-amber-400 bg-amber-400 dark:bg-amber-500 dark:border-amber-500 rounded-full relative bottom-[0.125em]'
                          style={{
                            boxShadow: '0 0 3px 1.5px rgb(245, 158, 11)',
                          }}
                        ></p>
                      )}
                      Connected
                    </h2>
                  </div>
                  <div className='text-sm'>
                    <Piano pressedNotes={pressedNotes}></Piano>
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
