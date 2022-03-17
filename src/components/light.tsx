import { Light, setState } from '../lib/utils';
import { LightBulbIcon } from '@heroicons/react/solid';

export default ((props) => {
  const light = props.light;

  return (
    <>
      <div className='bg-white dark:bg-neutral-800 p-6 shadow-md my-4 rounded-md border-neutral-100 dark:border-neutral-700 border-[0.25em]'>
        <div
          className={`flex justify-start items-center font-light ${
            light.power === 'off'
              ? 'text-neutral-300 dark:text-neutral-700'
              : 'text-black dark:text-neutral-300'
          }`}
        >
          <LightBulbIcon
            className={`w-12 ${
              light.power === 'off'
                ? 'text-neutral-300 dark:text-neutral-700'
                : 'text-neutral-700 dark:text-neutral-300'
            }`}
          />

          <div className='flex flex-col flex-1 ml-2'>
            <h2 className='text-xl font-semibold flex mb-2'>{light.label}</h2>
            <sub className='text-md'>RGB Light Bulb</sub>
          </div>

          <div>
            {light.power === 'on' ? (
              <>
                <button
                  className='on-btn'
                  onClick={() => setState({ power: 'on' }, `id:${light.id}`)}
                  disabled={true}
                >
                  On
                </button>

                <button
                  className='off-btn'
                  onClick={() => setState({ power: 'off' }, `id:${light.id}`)}
                >
                  Off
                </button>
              </>
            ) : (
              <>
                <button
                  className='on-btn'
                  onClick={() => setState({ power: 'on' }, `id:${light.id}`)}
                >
                  On
                </button>

                <button
                  className='off-btn'
                  onClick={() => setState({ power: 'off' }, `id:${light.id}`)}
                  disabled={true}
                >
                  Off
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}) as React.FC<{
  light: Light;
}>;
