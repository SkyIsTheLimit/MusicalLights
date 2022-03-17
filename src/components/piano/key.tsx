import React from 'react';
import styles from './key.module.scss';

interface KeyProps {
  note: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  accidental: '#' | 'b' | false;
  register: number;
  isWhitePressed?: boolean;
  isBlackPressed?: boolean;
}

interface KeyState {
  isWhitePressed: boolean;
  isBlackPressed: boolean;
}

export class Key extends React.Component<KeyProps, KeyState> {
  constructor(props: KeyProps) {
    super(props);

    this.state = {
      isWhitePressed: false,
      isBlackPressed: false,
    };

    this.render = this.render.bind(this);
  }

  press(key: 'black' | 'white', pressed: boolean) {
    if (key === 'white') {
      this.setState({
        isWhitePressed: pressed,
      });
    }

    if (key === 'black') {
      this.setState({
        isBlackPressed: pressed,
      });
    }
  }

  render() {
    return (
      <>
        <div className='relative'>
          <div
            className={`${styles.white} ${
              this.props?.isWhitePressed ? styles.pressed : ''
            }`}
            onClick={() => this.press('white', true)}
            onDragEnter={() => this.press('white', true)}
            onMouseDown={() => this.press('white', true)}
            onMouseUp={() => this.press('white', false)}
            onDragEnd={() => this.press('white', false)}
          ></div>
          {this.props.accidental ? (
            <>
              <div
                className={`${styles.black} ${styles[this.props.note]} ${
                  this.props.accidental === '#'
                    ? styles.sharp
                    : this.props.accidental === 'b'
                    ? styles.flat
                    : ''
                } ${this.props?.isBlackPressed ? styles.pressed : ''}`}
                onClick={() => this.press('black', true)}
                onMouseDown={() => this.press('black', true)}
                onMouseUp={() => this.press('black', false)}
                onMouseLeave={() => this.press('black', false)}
              ></div>
            </>
          ) : (
            <></>
          )}
        </div>
      </>
    );
  }
}
