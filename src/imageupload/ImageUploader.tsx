import React = require("react");
import { observer } from "mobx-react";
import { observable } from "mobx";
import './ImageUploader.scss';

@observer
export default class ImageUpload extends React.Component<{}> {
    @observable file:File;
    @observable imagePreviewUrl:any;
    
    handleImageChange(e:React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
  
      let reader = new FileReader();
      let file:File = e.target.files[0];
  
      reader.onloadend = () => {
       
        this.file = file;
        this.imagePreviewUrl = reader.result;
      }
  
      reader.readAsDataURL(file)
    }

    render() {
      let imagePreview = null;
      if (this.imagePreviewUrl) {
        imagePreview = (<img src={this.imagePreviewUrl} />);
      } else {
        imagePreview = (<div className="previewText">Please select an Image</div>);
      }
  
      return (
        <div className="previewComponent">
          
            <input className="fileInput" 
              type="file" 
              onChange={(e) => this.handleImageChange(e)} />     
          <div className="imgPreview">
            {imagePreview}
          </div>
        </div>
      )
    }
  }