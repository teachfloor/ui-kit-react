import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';
import styled, { css } from 'styled-components';
import Dropzone from 'react-dropzone';
import { color, spacing, typography } from '../../shared/styles';
import { toBase64 } from '../../shared/mixins';

const StyledProgressRing = styled.div`
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);

   span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: ${typography.weight.medium}:
      fotn-size: ${typography.size.s2};
   }
`;
class ProgressRing extends React.Component {
   constructor(props) {
      super(props);

      const { radius, stroke } = this.props;

      this.normalizedRadius = radius - stroke * 2;
      this.circumference = this.normalizedRadius * 2 * Math.PI;
   }

   render() {
      const { radius, stroke, progress } = this.props;

      const strokeDashoffset = this.circumference - (progress / 100) * this.circumference;

      return (
         <StyledProgressRing>
            <svg height={radius * 2} width={radius * 2}>
               <circle
                  stroke={color.darkest}
                  fill={color.lighter}
                  strokeWidth={stroke}
                  strokeDasharray={this.circumference + ' ' + this.circumference}
                  style={{ strokeDashoffset }}
                  r={this.normalizedRadius}
                  cx={radius}
                  cy={radius}
               />
            </svg>
            <span>{progress}%</span>
         </StyledProgressRing>
      );
   }
}

const StyledIcon = styled.div`
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);

   svg {
      width: 64px;
      height: 64px;
      color: ${color.medium};
   }
`;

const isFileImage = (file) => {
   return file && file.type.split('/')[0] === 'image';
};

const isUrlImage = (url) => {
   return url.match(/\.(jpeg|jpg|gif|png|svg)$/) != null;
};

const StyledFilePreviewImage = styled.div`
   position: relative;
   width: 80px;
   height: 80px;
   border-radius: ${spacing.borderRadius.default}px;
   background-size: cover;
   background-position: center;
   background-color: ${color.lighter};

   ${(props) =>
      props.file &&
      isFileImage(props.file) &&
      css`
         background-image: url(${URL.createObjectURL(props.file)});
      `}

   ${({ url }) =>
      url &&
      isUrlImage(url) &&
      css`
         background-image: url(${url});
      `}
`;

const StyledFilePreviewLabel = styled.div`
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   text-transform: uppercase;
   font-weight: 600;
`;

const StyledFilePreview = styled.div`
   position: relative;
   display: inline-flex;
   line-height: 0;
   margin-bottom: ${spacing.margin.small}px;
   margin-right: ${spacing.margin.small}px;
   transition: all 0.3s;

   ${({ completed }) =>
      completed &&
      css`
         opacity: 1;
      `}

   ${({ accepted }) =>
      accepted &&
      css`
         opacity: 0.5;

         &:hover {
            opacity: 1;
         }
      `}

   ${({ rejected }) =>
      rejected &&
      css`
         ${StyledFilePreviewLabel} {
            color: #fff;
         }

         ${StyledFilePreviewImage} {
            opacity: 0.75;
            background-color: ${color.danger};
            box-shadow: inset 0 0 0 2px ${color.danger};
         }
      `}
`;

const StyledFileInput = styled.input``;

const StyledDropzone = styled.div`
   position: relative;
   display: block;
   height: 20vw;
   max-height: 260px;
   border-radius: ${spacing.borderRadius.default}px;
   background-color: ${color.lighter};
   outline: none;
   padding: 10px 20px;
   overflow: auto;
   cursor: pointer;

   ${(props) =>
      !props.error &&
      !props.success &&
      css`
         &:hover {
            ${StyledIcon} {
               svg {
                  color: ${color.mediumdark};
               }
            }
         }

         &:focus {
            box-shadow: inset 0 0 0 1px ${color.primary};

            ${StyledIcon} {
               svg {
                  color: ${color.primary};
               }
            }
         }
      `}

   ${(props) =>
      props.error &&
      css`
         color: ${color.danger};
         box-shadow: inset 0 0 0 1px ${color.danger};

         &::-webkit-input-placeholder {
            color: ${color.danger};
         }
      `}

   ${(props) =>
      props.success &&
      css`
         color: ${color.success};
         box-shadow: inset 0 0 0 1px ${color.success};
         &::-webkit-input-placeholder {
            color: ${color.success};
         }
      `}

   ${(props) =>
      props.dragOver &&
      css`
         background-color: ${color.lighter};
         box-shadow: inset 0 0 0 1px ${color.primary};
      `}
`;

const StyledFilePreviews = styled.div`
   display: block;

   ${StyledFilePreview} {
      ${StyledFilePreviewImage} {
      }

      ${StyledIcon}.delete {
         display: none;
         cursor: pointer;
         svg {
         }
      }

      &:hover {
         ${StyledFilePreviewImage} {
            opacity: 0.5;
         }

         ${StyledIcon}.delete {
            display: block;

            svg {
               color: ${color.danger};
            }
         }
      }
   }

   ${(props) =>
      !props.multiple &&
      css`
         ${StyledFilePreview} {
            display: block;
            margin: 0;

            ${StyledFilePreviewImage} {
               width: 100%;
               height: 20vw;
            }
         }
      `}

   ${StyledDropzone} {
      display: inline-flex;
      width: 80px;
      height: 80px;
      line-height: 0;
      padding: 0;
   }
`;

const StyledFilePicker = styled.div``;

const FilePreview = ({ file, fileUrl, onDelete, uploadPercent, ...props }) => {
   const getFileLabel = () => {
      if (fileUrl && !isUrlImage(fileUrl)) {
         return fileUrl.split('.').pop();
      }

      if (!file) {
         return null;
      }

      if (isFileImage(file)) {
         return null;
      }

      if (!file.name) {
         return null;
      }

      return file.name.split('.').pop();
   };

   const renderDeleteButton = () => {
      if (!onDelete) {
         return null;
      }

      return (
         <StyledIcon className={'delete'} onClick={() => onDelete(file)}>
            <Icon icon={'Close'} />
         </StyledIcon>
      );
   };

   const renderUploadProgress = useCallback(() => {
      if (uploadPercent === false) {
         return null;
      }

      return <ProgressRing radius={40} stroke={4} progress={uploadPercent} />;
   }, [uploadPercent]);

   return (
      <StyledFilePreview {...props}>
         <StyledFilePreviewImage file={file} url={fileUrl} />
         <StyledFilePreviewLabel>{getFileLabel()}</StyledFilePreviewLabel>
         {renderUploadProgress()}
         {renderDeleteButton()}
      </StyledFilePreview>
   );
};

FilePreview.defaultProps = {
   onDelete: undefined,
   uploadPercent: false,
};

export const Filepicker = ({
   accept,
   multiple,
   onChange,
   onFocus,
   onBlur,
   onUpload,
   onUploadError,
   onDelete,
   ...props
}) => {
   // const ref = useRef(null);
   const defaultValue = props.value || props.defaultValue || (multiple ? [] : null);

   const [dragOver, setDragOver] = useState(false);
   const [value, setValue] = useState(defaultValue);
   const [acceptedFiles, setAcceptedFiles] = useState([]);
   const [completedFiles, setCompletedFiles] = useState([]);
   const [rejectedFiles, setRejectedFiles] = useState([]);

   // const [uploadCompleted, setUploadCompleted] = useState(false);
   // const [uploadErrored, setUploadErrored] = useState(false);
   const [uploadPercent, setUploadPercent] = useState(false);

   // useEffect(() => {
   //    switch (uploadPercent) {
   //       case false:
   //          setTimeout(() => setUploadPercent(0), 500);
   //          break;

   //       case 100:
   //          setTimeout(() => setUploadPercent(false), 500);
   //          break;

   //       default:
   //          setTimeout(() => setUploadPercent(uploadPercent + 1), 500);
   //    }
   // }, [uploadPercent]);

   useEffect(() => {
      if (acceptedFiles.length > 0) {
         handleUpload(acceptedFiles[0]);
      }
   }, [acceptedFiles]);

   useEffect(() => {
      onChange(value);
   }, [value]);

   const handleUploadCompletion = (response, file) => {
      // "file" is equal to the first element of "acceptedFiles"

      if (multiple) {
         const newValue = [...value];
         newValue.push(response);
         setValue(newValue);
      } else {
         setValue(response);
      }

      // Add the completed accepted file to the completed files
      const completed = [...completedFiles];
      completed.push(file);
      setCompletedFiles(completed);

      // Remove completed file from the accepted files
      const accepted = [...acceptedFiles];
      accepted.shift();
      setAcceptedFiles(acceptedFiles.length > 1 ? accepted : []);
   };

   const handleUploadError = (error, file) => {
      // setUploadErrored(true)
      onUploadError(error, file);
   };

   const handleUploadProgress = (progress) => {
      if (!progress) {
         return;
      }

      const progressPercent = Math.round((progress.loaded * 100) / progress.total);
      setUploadPercent(progressPercent);
   };

   const handleUpload = (file) => {
      (onUpload ? onUpload(file, handleUploadProgress) : toBase64(file))
         .then((res) => handleUploadCompletion(res, file))
         .catch((err) => handleUploadError(err, file));
   };

   const handleDrop = (accepted, rejected) => {
      setDragOver(false);

      if (accepted.length > 0) {
         if (!multiple) {
            setCompletedFiles([]);
         }
         setAcceptedFiles([...accepted]);
      }

      if (rejected.length > 0) {
         setRejectedFiles([...rejected]);
      }
   };

   const handleDelete = (file, list, key) => {
      onDelete(file);

      if (!multiple) {
         setCompletedFiles([]);
         setAcceptedFiles([]);
         setRejectedFiles([]);
         setValue(null);
      } else {
         switch (list) {
            case 'completed':
               setCompletedFiles(completedFiles.filter((file, index) => index != key));
               setValue(value.filter((val, index) => index != key));
               break;

            case 'accepted':
               setAcceptedFiles(acceptedFiles.filter((file, index) => index != key));
               break;

            case 'rejected':
               setRejectedFiles(rejectedFiles.filter((file, index) => index != key));
               break;
         }
      }
   };

   // const getPlaceholderImage = () => {
   //    if (multiple) {
   //       return defaultValue || false;
   //    }

   //    if (completedFiles.length) {
   //       return URL.createObjectURL(completedFiles[0])
   //    }

   //    if (acceptedFiles.length) {
   //       return URL.createObjectURL(acceptedFiles[0])
   //    }

   //    if (defaultValue) {
   //       return defaultValue
   //    }

   //    return false
   // }

   const renderFilePreviews = () => {
      return (
         <StyledFilePreviews multiple={multiple}>
            {!completedFiles.length &&
            !acceptedFiles.length &&
            (multiple ? value.length : value) ? (
               multiple ? (
                  value.map((image, key) => (
                     <FilePreview
                        key={`default_${key}`}
                        fileUrl={image}
                        completed
                        onDelete={() => setValue(value.filter((val, index) => index != key))}
                     />
                  ))
               ) : (
                  <FilePreview fileUrl={value} completed onDelete={() => setValue(null)} />
               )
            ) : null}

            {completedFiles.map((file, key) => (
               <FilePreview
                  key={`completed_${key}`}
                  file={file}
                  completed
                  onDelete={() => handleDelete(file, 'completed', key)}
               />
            ))}

            {acceptedFiles.map((file, key) => (
               <FilePreview
                  key={`accepted_${key}`}
                  file={file}
                  accepted
                  onDelete={() => handleDelete(file, 'accepted', key)}
                  uploadPercent={key === 0 ? uploadPercent : false}
               />
            ))}
            {rejectedFiles.map((reject, key) => (
               <FilePreview
                  key={`rejected_${key}`}
                  file={reject.file}
                  rejected
                  onDelete={() => handleDelete(reject.file, 'rejected', key)}
               />
            ))}
            {multiple ? renderDropzone() : null}
         </StyledFilePreviews>
      );
   };

   const renderDropzoneChild = ({ getRootProps, getInputProps }) => {
      return (
         <StyledDropzone {...getRootProps()} dragOver={dragOver}>
            <StyledFileInput {...getInputProps()} />
            <StyledIcon>
               <Icon icon={'Add'} />
            </StyledIcon>
         </StyledDropzone>
      );
   };

   const renderDropzone = () => {
      return (
         <Dropzone
            accept={accept}
            multiple={multiple}
            onDrop={handleDrop}
            onDragEnter={() => setDragOver(true)}
            onDragLeave={() => setDragOver(false)}
            onDragOver={() => setDragOver(true)}
         >
            {renderDropzoneChild}
         </Dropzone>
      );
   };

   return (
      <StyledFilePicker>
         {renderFilePreviews()}
         {acceptedFiles.length || multiple || value ? null : renderDropzone()}
      </StyledFilePicker>
   );
};

Filepicker.propTypes = {
   /**
    * Accepted mime type
    */
   accept: PropTypes.string,

   /**
    * Enables multiple file selection
    */
   multiple: PropTypes.bool,

   /**
    * Callback triggered on file upload
    */
   onChange: PropTypes.func,

   /**
    * Callback function that handles the file upload. Received the `file` as first parameter and the `onUploadProgress` callback to attach to the request as second parameter.
    * When no upload callback function is passed, a base64 of the file is created
    */
   onUpload: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

   /**
    * Callback function triggered on upload error
    */
   onUploadError: PropTypes.func,

   /**
    * Callback function triggered when a file is deleted
    */
   onDelete: PropTypes.func,
   onFocus: PropTypes.func,
   onBlur: PropTypes.func,
};

Filepicker.defaultProps = {
   accept: 'image/jpeg, image/png',
   multiple: false,
   onChange: () => {},
   onDelete: () => {},
   onFocus: () => {},
   onBlur: () => {},
   onUpload: false,
   onUploadError: () => new Promise((r, reject) => reject()),
};
