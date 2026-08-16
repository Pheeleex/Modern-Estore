import CustomButton from './CustomButton'


const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit, error }) => {
  return (
    <div className="aipicker-container mt-8">
      <textarea
        placeholder='Ask AI...'
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className='aipicker-textarea'
        disabled={generatingImg}
        />
        {error && <p className="picker-error">{error}</p>}
        <div className='flex flex-wrap gap-3'>
          {generatingImg ? (<CustomButton
          type="outline"
          title="Generating"
          customStyles='text-xs'
          disabled />): 
          (<>
              <CustomButton
            type="outline"
            title="AI Logo"
            handleClick={() => handleSubmit('logo')}
            customStyles='text-xs'
            disabled={!prompt.trim()}
             />
             
             <CustomButton
            type="filled"
            title="AI Full"
            handleClick={() => handleSubmit('full')}
            customStyles='text-xs'
            disabled={!prompt.trim()}
             />
          </>
             )}
        </div>
    </div>
  );
}

export default AIPicker;
