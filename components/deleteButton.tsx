type DeleteButtonProps = {
  handleDelete: () => void
}

export const DeleteButton = ({ handleDelete }: DeleteButtonProps) => {
  return (
    <div className='fixed w-20 top-22 left-2 block z-40'>
      <button
        className='bg-red-400 p-3 shadow-md transition duration-500 hover:scale-125 hover:bg-red-600 hover:text-white focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5'
        type='button'
        onClick={handleDelete}>
        Delete THEM!
      </button>
    </div>
  )
}
