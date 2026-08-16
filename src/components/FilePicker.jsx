import CustomButton from './CustomButton'


const FilePicker = ({file, setFile, readFile, error}) => {
  const fileName = file
    ? typeof file === 'string'
      ? 'Generated image'
      : file.name
    : 'No file selected';

  return (
        <div className='filepicker-container'>
          <div className='flex-1 flex flex-col'>
            <input 
              id='file-upload'
              type='file'
              accept='image/*'
              onChange={(e) => setFile(e.target.files?.[0] || '')}
              />
              <label htmlFor='file-upload' className='filepicker-label'>
                Upload File
              </label>

              <p className='mt-2 text-gray-500 text-xs truncate'>{fileName}</p>
              {error && <p className="picker-error">{error}</p>}
          </div>

          <div className='mt-4 flex flex-wrap gap-3'>
              <CustomButton
                type="outline"
                title="Logo"
                handleClick={() => readFile('logo')}
                customStyles="text-xs"
                disabled={!file} />

                <CustomButton
                type="filled"
                title="Full"
                handleClick={() => readFile('full')}
                customStyles="text-xs"
                disabled={!file} />
          </div>
        </div>
  )
}

export default FilePicker
