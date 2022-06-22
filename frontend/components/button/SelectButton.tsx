/* This example requires Tailwind CSS v2.0+ */
import { Fragment, ReactNode, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { AddOutlined, DoneOutlined, ExpandMoreOutlined } from '@material-ui/icons';
import classNames from 'classnames';


type SelectButtonProps = {
   className?: string,
   icon?: ReactNode
   onClick?: (key: string) => void
   options: {
      key: string,
      title: string,
      description: string,
   }[]
}

const SelectButton = ({ className, options, icon, onClick }: SelectButtonProps) => {
   const [selected, setSelected] = useState(options[0]);

   return (
      <Listbox value={selected} onChange={setSelected}>
         {({ open }) => (
            <>
               <Listbox.Label className='sr-only'>Change published status</Listbox.Label>
               <div className='relative'>
                  <div className={classNames('inline-flex shadow-sm rounded-md divide-x divide-gray-600', className)}>
                     <div className='relative z-0 inline-flex shadow-sm rounded-md divide-x divide-gray-600'>
                        <button
                           onClick={()=> {
                              onClick?.(selected.key);
                           }}
                           className='relative inline-flex items-center bg-white py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-black cursor-pointer hover:bg-gray-200 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500'>
                           {
                              icon ? icon : <DoneOutlined className='h-5 w-5' aria-hidden='true' />
                           }
                           <p className='ml-2.5 text-sm font-medium'>{selected.title}</p>
                        </button>
                        <Listbox.Button
                           className='relative inline-flex items-center bg-white p-2 rounded-l-none rounded-r-md text-sm font-medium text-black hover:bg-gray-200 focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500'>
                           <span className='sr-only'>Change published status</span>
                           <ExpandMoreOutlined className='h-5 w-5' aria-hidden='true' />
                        </Listbox.Button>
                     </div>
                  </div>

                  <Transition
                     show={open}
                     as={Fragment}
                     leave='transition ease-in duration-100'
                     leaveFrom='opacity-100'
                     leaveTo='opacity-0'
                  >
                     <Listbox.Options
                        className='origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none'>
                        {options.map((option) => (
                           <Listbox.Option
                              key={option.title}
                              className={({ active }) =>
                                 classNames(
                                    'cursor-default select-none relative p-4 text-sm', {
                                       'text-gray-900': !active,
                                       'text-white bg-gray-500': active,
                                    },
                                 )
                              }
                              value={option}
                           >
                              {({ selected, active }) => (
                                 <div className='flex flex-col'>
                                    <div className='flex justify-between'>
                                       <p className={selected ? 'font-semibold' : 'font-normal'}>{option.title}</p>
                                       {selected ? (
                                          <span className={active ? 'text-white' : 'text-gray-500'}>
                              <DoneOutlined className='h-5 w-5' aria-hidden='true' />
                            </span>
                                       ) : null}
                                    </div>
                                    <p className={classNames(active ? 'text-gray-200' : 'text-gray-500', 'mt-2')}>
                                       {option.description}
                                    </p>
                                 </div>
                              )}
                           </Listbox.Option>
                        ))}
                     </Listbox.Options>
                  </Transition>
               </div>
            </>
         )}
      </Listbox>
   );
};

export { SelectButton };