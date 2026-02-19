import { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import './ImageUploader.css';

interface ImageUploaderProps {
    label?: string;
    name: string;
    multiple?: boolean;
    preview?: string | string[];
    onChange: (files: FileList | null) => void;
    onRemove?: (index: number) => void;
}

const ImageUploader = ({
    label = 'Upload Image',
    name,
    multiple = false,
    preview,
    onChange,
    onRemove,
}: ImageUploaderProps) => {
    const [dragActive, setDragActive] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files: FileList) => {
        const urls = Array.from(files).map((f) => URL.createObjectURL(f));
        setPreviews(multiple ? [...previews, ...urls] : urls);
        onChange(files);
    };

    const existingPreviews = preview
        ? Array.isArray(preview)
            ? preview
            : [preview]
        : [];

    return (
        <div className="image-uploader">
            {label && <label className="uploader-label">{label}</label>}
            <div
                className={`upload-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <Upload size={24} />
                <p>Drag & drop or click to upload</p>
                <span>JPG, PNG, WebP up to 10MB</span>
                <input
                    ref={inputRef}
                    type="file"
                    name={name}
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
            </div>

            {(existingPreviews.length > 0 || previews.length > 0) && (
                <div className="upload-previews">
                    {existingPreviews.map((url, i) => (
                        <div key={`existing-${i}`} className="preview-item">
                            <img src={url} alt="" />
                            {onRemove && (
                                <button className="preview-remove" onClick={() => onRemove(i)}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                    {previews.map((url, i) => (
                        <div key={`new-${i}`} className="preview-item new">
                            <img src={url} alt="" />
                            <span className="preview-badge">New</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
