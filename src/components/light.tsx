import { Light, setState } from '../lib/utils';
import { LightBulbIcon } from '@heroicons/react/solid';

export default ((props) => {
  const light = props.light;

  return (
    <>
      <div className='bg-white p-6 shadow-md my-4 rounded-md border-neutral-100 border-[0.25em]'>
        <div
          className={`flex justify-start items-center ${
            light.power === 'off' ? 'text-neutral-300' : 'text-black'
          }`}
        >
          <LightBulbIcon
            className={`w-12 ${
              light.power === 'off' ? 'text-neutral-300' : 'text-neutral-700'
            }`}
          />

          <div className='flex flex-col flex-1 ml-2'>
            <h2 className='text-2xl font-bold flex mb-2'>{light.label}</h2>
            <sub>RGB Light Bulb</sub>
          </div>

          <div>
            <button
              className='btn'
              onClick={() => setState({ power: 'on' }, `id:${light.id}`)}
            >
              On
            </button>

            <button
              className='btn'
              onClick={() => setState({ power: 'off' }, `id:${light.id}`)}
            >
              Off
            </button>
          </div>
        </div>
      </div>
    </>
  );
}) as React.FC<{
  light: Light;
}>;
