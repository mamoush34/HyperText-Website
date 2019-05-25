import React = require("react");
import { observer } from "mobx-react";
import { observable } from "mobx";
import './ImageUploader.scss';
import { ImageNodeStore } from "../stores/ImageNodeStore";


interface ImageUploadProps {
  imageNode: ImageNodeStore
}

@observer
export default class ImageUpload extends React.Component<ImageUploadProps> {
    @observable file:File;
    //@observable imagePreviewUrl:string | ArrayBuffer;
    
    handleImageChange(e:React.ChangeEvent<HTMLInputElement>) {
      e.preventDefault();
  
      let reader = new FileReader();
      let file:File = e.target.files[0];
  
      reader.onloadend = () => {
       
        this.file = file;
        this.props.imageNode.setImageUrl(reader.result);
        //this.imagePreviewUrl = reader.result;
      }
  
      reader.readAsDataURL(file)
    }

    render() {
      let imagePreview = null;
      if (this.props.imageNode.Url) {
        imagePreview = (<img src={this.props.imageNode.Url} />);
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