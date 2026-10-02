import React, { useRef, useState } from 'react';
import { compressImageFile, fileToDataUrl } from '../utils/fileUpload';
import { UploadCloud, Image as ImageIcon, Video, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

interface FileUploadInputProps {
  label: string;
  value?: string;
  fileName?: string;
  accept?: string;
  mediaType?: 'image' | 'video' | 'file';
  onChange: (url: string, fileName?: string) => void;
  helperText?: string;
}

export const FileUploadInput: React.FC<FileUploadInputProps> = ({
  label,
  value,
  fileName,
  accept = 'image/*',
  mediaType = 'image',
  onChange,
  helperText = 'Importez depuis la galerie ou les dossiers de votre appareil',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);

    try {
      // Check file size (max 8MB for direct upload)
      if (file.size > 8 * 1024 * 1024) {
        throw new Error('Le fichier sélectionné dépasse la taille limite recommandée (8 Mo).');
      }

      let dataUrl = '';
      if (file.type.startsWith('image/')) {
        // Compress image to ensure light footprint and sharp rendering
        dataUrl = await compressImageFile(file, 1600, 0.82);
      } else {
        // Video or document (PDF, zip, etc.)
        dataUrl = await fileToDataUrl(file);
      }

      onChange(dataUrl, file.name);
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err?.message || 'Erreur lors de la lecture du fichier.');
    } finally {
      setLoading(false);
      // Reset input value so same file can be picked again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-slate-300 font-medium text-xs">{label}</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('', '')}
            className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
          >
            <X className="w-3 h-3" />
            <span>Effacer</span>
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action Button & Status */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="flex-1 py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-400 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm group"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <UploadCloud className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          )}
          <span>
            {loading ? 'Chargement en cours...' : 'Choisir un fichier (Téléphone / PC)'}
          </span>
        </button>

        {/* Or enter direct URL */}
        <input
          type="text"
          value={value?.startsWith('data:') ? `[Fichier importé : ${fileName || 'média local'}]` : value || ''}
          onChange={(e) => {
            if (!value?.startsWith('data:')) {
              onChange(e.target.value);
            }
          }}
          placeholder="Ou collez une URL directe (https://...)"
          disabled={value?.startsWith('data:')}
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono disabled:opacity-80"
        />
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Preview if image or video */}
      {value && (
        <div className="mt-2 p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
          {mediaType === 'image' && (
            <img
              src={value}
              alt="Aperçu"
              className="w-16 h-12 object-cover rounded-lg bg-slate-900 border border-slate-800"
            />
          )}
          {mediaType === 'video' && (
            <div className="w-16 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-cyan-400">
              <Video className="w-6 h-6" />
            </div>
          )}
          {mediaType === 'file' && (
            <div className="w-16 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Fichier prêt</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {fileName || (value.startsWith('data:') ? 'Fichier importé avec succès' : value)}
            </p>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 leading-tight">
        {helperText}
      </p>
    </div>
  );
};
