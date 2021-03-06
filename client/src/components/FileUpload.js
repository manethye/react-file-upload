import { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [fileName, setFileName] = useState('Choose File');
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState('');
  const [uploadPrecentage, setUploadPrecentage] = useState(0);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          setUploadPrecentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      setTimeout(() => setUploadPrecentage(0), 3000);

      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });

      setMessage('File uploaded.');
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server.');
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : ''}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>
        {uploadPrecentage ? <Progress precentage={uploadPrecentage} /> : null}

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-2"
        />
      </form>
      {uploadedFile ? (
        <div className="row my-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center mb-2">{uploadedFile.fileName}</h3>
            <img style={{ width: '100%' }} src={uploadedFile.filePath} alt="" />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
