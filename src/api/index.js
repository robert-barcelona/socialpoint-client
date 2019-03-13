import axios from 'axios'


export const uploadHandler = async (addJob, file) => {
  const formData = new FormData()
  formData.append(
    'xxzzy',
    file,
    file.name
  )

  const config = {
    headers: {
      'content-type': 'multipart/form-data'
    }
  }

  const url = `${process.env.REACT_APP_IMAGE_UPLOAD_SERVER}/uploadx`

  try {
    const response = await axios.post(url, formData, config)
    const fileCrypt = response.data.file.split('/')[1]
    return addJob({variables: {file: file.name, fileCrypt}});
  } catch (err) {
    throw new Error(err.toString())
  }


}


export const downloadHandler = async (file, fileCrypt) => {
  const config = {
    responseType: 'blob',
  }

  const url = `${process.env.REACT_APP_IMAGE_UPLOAD_SERVER}/download`
  try {
    const response = await axios.post(url, {
      file,
      fileCrypt,
    }, config)
    const fakeURL = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    console.log(response)
    link.href = fakeURL;
    link.setAttribute('download', file); //or any other extension
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (err) {
    throw new Error(err.toString())
  }
}
