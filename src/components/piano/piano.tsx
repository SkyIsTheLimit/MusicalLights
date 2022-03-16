import React from 'react';
import { ProcessedMIDIMessage } from '../../pages';
import { Octave } from './octave';

const getPressedNotesForRegister = (
  register: number,
  pressedNotes: ProcessedMIDIMessage[]
) => {
  return pressedNotes
    .filter((note) => note.octave === register)
    .map((note) => `${note.noteName}${note.accidental ? '#' : ''}`);
};

export const Piano = ((props) => {
  return (
    <div className='flex w-fit justify-center text-inherit mx-auto shadow-md'>
      <Octave
        register={0}
        pressedNotes={getPressedNotesForRegister(0, props.pressedNotes)}
      ></Octave>
      <Octave
        register={1}
        pressedNotes={getPressedNotesForRegister(1, props.pressedNotes)}
      ></Octave>
      <Octave
        register={2}
        pressedNotes={getPressedNotesForRegister(2, props.pressedNotes)}
      ></Octave>
      <Octave
        register={3}
        pressedNotes={getPressedNotesForRegister(3, props.pressedNotes)}
      ></Octave>
      <Octave
        register={4}
        pressedNotes={getPressedNotesForRegister(4, props.pressedNotes)}
      ></Octave>
      <Octave
        register={5}
        pressedNotes={getPressedNotesForRegister(5, props.pressedNotes)}
      ></Octave>
      <Octave
        register={6}
        pressedNotes={getPressedNotesForRegister(6, props.pressedNotes)}
      ></Octave>
      <Octave
        register={7}
        pressedNotes={getPressedNotesForRegister(7, props.pressedNotes)}
      ></Octave>
      <Octave
        register={8}
        pressedNotes={getPressedNotesForRegister(8, props.pressedNotes)}
      ></Octave>
    </div>
  );
}) as React.FC<{
  pressedNotes: ProcessedMIDIMessage[];
}>;
