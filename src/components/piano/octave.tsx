import { Key } from './key';

const isPressed = (notes: string[] = [], whichOne: string) =>
  notes.indexOf(whichOne) !== -1;

const isVisible = (note: string, register: number) => {
  if (register === 0) {
    switch (note) {
      case 'C':
      case 'D':
      case 'E':
      case 'F':
      case 'G':
        return false;

      default:
        true;
    }
  }

  if (register === 8) {
    switch (note) {
      case 'D':
      case 'E':
      case 'F':
      case 'G':
      case 'A':
      case 'B':
        return false;

      default:
        return true;
    }
  }

  return true;
};

const isNotePressed = (noteName: string, pressedNotes: string[]) => {
  return pressedNotes.indexOf(noteName) !== -1;
};

export const Octave = ((props) => {
  return (
    <>
      {isVisible('C', props.register) ? (
        <Key
          register={props.register}
          note={'C'}
          accidental={false}
          isWhitePressed={isNotePressed('C', props.pressedNotes)}
        ></Key>
      ) : (
        <></>
      )}

      {isVisible('D', props.register) ? (
        <Key
          register={props.register}
          note={'D'}
          accidental={'b'}
          isWhitePressed={isNotePressed('D', props.pressedNotes)}
          isBlackPressed={isNotePressed('C#', props.pressedNotes)}
        ></Key>
      ) : (
        <></>
      )}

      {isVisible('E', props.register) ? (
        <Key
          register={props.register}
          note={'E'}
          accidental={'b'}
          isWhitePressed={isNotePressed('E', props.pressedNotes)}
          isBlackPressed={isNotePressed('D#', props.pressedNotes)}
        ></Key>
      ) : (
        <></>
      )}

      {isVisible('F', props.register) ? (
        <Key
          register={props.register}
          note={'F'}
          accidental={'#'}
          isWhitePressed={isNotePressed('F', props.pressedNotes)}
          isBlackPressed={isNotePressed('F#', props.pressedNotes)}
        ></Key>
      ) : (
        <></>
      )}

      {isVisible('G', props.register) ? (
        <Key
          register={props.register}
          note={'G'}
          accidental={'#'}
          isWhitePressed={isNotePressed('G', props.pressedNotes)}
          isBlackPressed={isNotePressed('G#', props.pressedNotes)}
        ></Key>
      ) : (
        <></>
      )}

      {isVisible('A', props.register) ? (
        <Key
          register={props.register}
          note={'A'}
          accidental={false}
          isWhitePressed={isNotePressed('A', props.pressedNotes)}
        ></Key>
      ) : (
        <></>
      )}

      {isVisible('B', props.register) ? (
        <Key
          register={props.register}
          note={'B'}
          accidental={'b'}
          isWhitePressed={isNotePressed('B', props.pressedNotes)}
          isBlackPressed={isNotePressed('A#', props.pressedNotes)}
        ></Key>
      ) : (
        <></>
      )}
    </>
  );
}) as React.FC<{ register: number; pressedNotes?: string[] }>;
