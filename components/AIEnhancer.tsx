
import React, { useState, useRef } from 'react';
import SectionHeading from './SectionHeading';
import { editImageWithAI } from '../services/geminiService';

const AIEnhancer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!image || !prompt) return;
    setLoading(true);
    setError(null);
    try {
      const result = await editImageWithAI(image, prompt);
      if (result) {
        setEditedImage(result);
      } else {
        setError("AI returned no image data. Please try a different prompt.");
      }
    } catch (err: any) {
      setError("AI generation failed. Make sure your API key is configured correctly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-playground" className="py-20 bg-stone-50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="AI Photo Lab" 
          subtitle="Experience the power of Gemini 2.5 Flash Image. Upload a photo and describe how you'd like to transform it (e.g., 'Make it look like a vintage painting' or 'Add a celebratory academic background')." 
        />
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Original Image / Upload Area */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">Source Image</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                  image ? 'border-stone-200' : 'border-emerald-700 bg-stone-50 hover:bg-emerald-50'
                }`}
              >
                {image ? (
                  <img src={image} alt="Original" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center p-6">
                    <i className="fas fa-cloud-upload-alt text-4xl text-emerald-800 mb-4"></i>
                    <p className="text-stone-600">Click to upload image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </div>
              <p className="text-xs text-stone-400 text-center italic">Supported formats: JPEG, PNG</p>
            </div>

            {/* AI Controls & Result */}
            <div className="flex flex-col space-y-4">
              <label className="block text-sm font-medium text-stone-700">AI Transformation</label>
              <div className="flex-1 space-y-4">
                <textarea
                  className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-emerald-800 outline-none resize-none h-24"
                  placeholder="Describe your edit... (e.g., 'Turn this into a high-quality professional headshot with a library background')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                  onClick={handleEnhance}
                  disabled={!image || !prompt || loading}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all ${
                    !image || !prompt || loading 
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                      : 'bg-emerald-theme text-white hover:bg-emerald-900 shadow-lg'
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i>
                      <span>AI is thinking...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-magic"></i>
                      <span>Generate with Gemini</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start space-x-2">
                    <i className="fas fa-exclamation-circle mt-0.5"></i>
                    <span>{error}</span>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm font-medium text-stone-700 mb-2">AI Result</p>
                  <div className="aspect-square bg-stone-100 rounded-xl flex items-center justify-center overflow-hidden border">
                    {editedImage ? (
                      <img src={editedImage} alt="AI Result" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-stone-400 text-center p-4">
                        <i className="fas fa-image text-3xl mb-2"></i>
                        <p className="text-sm">Your AI-generated image will appear here</p>
                      </div>
                    )}
                  </div>
                  {editedImage && (
                    <a 
                      href={editedImage} 
                      download="ai_portrait.png" 
                      className="block text-center mt-3 text-emerald-800 font-semibold hover:underline"
                    >
                      <i className="fas fa-download mr-1"></i> Download Result
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIEnhancer;
