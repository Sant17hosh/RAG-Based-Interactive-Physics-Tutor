import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, ZoomIn, ZoomOut, Search, Star, ArrowLeft, ArrowRight, Sparkles, AlertCircle, Bookmark, Maximize } from 'lucide-react';
import { renderChapter8Page } from './Chapter8Content';
import { renderChapter6Page } from './Chapter6Content';
import { renderPracticePage } from './PracticePapersContent';

interface PDFItem {
  id: string | number;
  title: string;
  chapter?: string;
  subtitle?: string;
  category: 'chapters' | 'boards' | 'jeeneet' | 'practice';
  size: string;
  pages: number;
  importance: 'High' | 'Medium' | 'Critical';
  fileUrl?: string;
  pdfUrl?: string;
  summaryPoints: string[];
  mockContent: {
    title: string;
    sections: { heading: string; bullets: string[] }[];
  };
}

const PDF_DATA: PDFItem[] = [
  {
    id: 'ch-6-emi',
    title: "NCERT Physics Chapter 6 – Electromagnetic Induction",
    chapter: "Chapter 6",
    category: 'chapters',
    size: '1.5 MB',
    pages: 17,
    importance: 'Critical',
    pdfUrl: '/pdfs/chapters/electromagnetic-induction.pdf',
    summaryPoints: [
      'Official NCERT textbook chapter covering electromagnetic induction.',
      'Core concepts: Magnetic Flux, Faraday\'s Laws of Induction, and Lenz\'s Law.',
      'Derivations of Motional EMF, Self-Inductance, and Mutual Inductance.'
    ],
    mockContent: {
      title: 'NCERT CLASS 11: CHAPTER 6 - ELECTROMAGNETIC INDUCTION',
      sections: []
    }
  },
  {
    id: 1,
    title: "NCERT Physics Chapter 8 – Electromagnetic Waves",
    chapter: "Chapter 8",
    category: 'chapters',
    size: '1.2 MB',
    pages: 14,
    importance: 'Critical',
    pdfUrl: '/pdfs/chapters/electromagnetic-waves.pdf',
    summaryPoints: [
      'Official NCERT textbook chapter covering electromagnetic waves.',
      'Core concepts: Displacement Current, Ampere-Maxwell Law, and EM wave properties.',
      'Overview of the Electromagnetic Spectrum and its practical applications.'
    ],
    mockContent: {
      title: 'NCERT CLASS 11: CHAPTER 8 - ELECTROMAGNETIC WAVES',
      sections: []
    }
  },
  {
    id: 'pract-emi',
    title: "Practice Question Paper",
    chapter: "Chapter 6 & 8",
    category: 'practice',
    size: '1.8 MB',
    pages: 6,
    importance: 'High',
    pdfUrl: '/pdfs/practice/practice-question-paper.pdf',
    summaryPoints: [
      'Class XII standard practice question paper on Electromagnetic Induction.',
      'Consists of Section A (MCQs), Section B, C, D, and E (Case study questions).',
      'Excellent resource for exam simulation and self-assessment.'
    ],
    mockContent: {
      title: 'TIM PHYSICS: ELECTROMAGNETIC INDUCTION PRACTICE PAPER',
      sections: []
    }
  }
];

export default function PDFs() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'chapters' | 'boards' | 'jeeneet' | 'practice'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewerModalPdf, setViewerModalPdf] = useState<PDFItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [viewingMockMode, setViewingMockMode] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Bookmarks & Search inside states
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [pageSearchQuery, setPageSearchQuery] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lastOpenedPdf, setLastOpenedPdf] = useState<any | null>(null);

  // Load Bookmarks and Last Opened PDF from LocalStorage
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('tim_pdf_bookmarks') || '[]');
    setBookmarks(savedBookmarks);

    const savedLastOpened = localStorage.getItem('tim_pdf_last_opened');
    if (savedLastOpened) {
      try {
        setLastOpenedPdf(JSON.parse(savedLastOpened));
      } catch (e) {}
    }
  }, []);

  const filteredPDFs = PDF_DATA.filter((pdf) => {
    const matchesCategory = selectedCategory === 'all' || pdf.category === selectedCategory;
    const matchesSearch =
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.summaryPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenPdf = (pdf: PDFItem, pageNum = 1) => {
    setViewerModalPdf(pdf);
    setZoomLevel(100);
    setViewingMockMode(true);
    setCurrentPage(pageNum);
    setPageSearchQuery('');

    // Save as last opened
    const stateRecord = { pdfId: pdf.id, pageNum };
    localStorage.setItem('tim_pdf_last_opened', JSON.stringify(stateRecord));
    setLastOpenedPdf(stateRecord);
  };

  const handleClosePdf = () => {
    setViewerModalPdf(null);
    setIsFullscreen(false);
  };

  const handlePageChange = (pageNum: number) => {
    setCurrentPage(pageNum);
    if (viewerModalPdf) {
      const stateRecord = { pdfId: viewerModalPdf.id, pageNum };
      localStorage.setItem('tim_pdf_last_opened', JSON.stringify(stateRecord));
      setLastOpenedPdf(stateRecord);
    }
  };

  const toggleBookmark = () => {
    if (!viewerModalPdf) return;
    const key = `${viewerModalPdf.id}-${currentPage}`;
    let newBookmarks;
    if (bookmarks.includes(key)) {
      newBookmarks = bookmarks.filter(b => b !== key);
    } else {
      newBookmarks = [...bookmarks, key];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('tim_pdf_bookmarks', JSON.stringify(newBookmarks));
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('pdf-viewer-overlay');
    if (!container) return;
    if (!isFullscreen) {
      if (container.requestFullscreen) container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const isCurrentPageBookmarked = viewerModalPdf ? bookmarks.includes(`${viewerModalPdf.id}-${currentPage}`) : false;

  return (
    <div className="space-y-6 animate-fade-in text-slate-800" id="pdf-materials-hub">
      {/* Continue Reading Banner */}
      {lastOpenedPdf && !viewerModalPdf && (
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between shadow-xs select-none">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-bold text-slate-700">
              Continue reading where you left off: {PDF_DATA.find(p => p.id === lastOpenedPdf.pdfId)?.title || 'Previous Material'} (Page {lastOpenedPdf.pageNum})
            </span>
          </div>
          <button
            onClick={() => {
              const matchedPdf = PDF_DATA.find(p => p.id === lastOpenedPdf.pdfId);
              if (matchedPdf) handleOpenPdf(matchedPdf, lastOpenedPdf.pageNum);
            }}
            className="px-3.5 py-1.5 bg-[#FF6B00] text-white font-extrabold text-xs rounded-xl shadow cursor-pointer hover:brightness-110 uppercase select-none"
          >
            Resume
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" /> STUDY ARCHIVES
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Syllabus PDF & Materials Lounge</h1>
          <p className="text-xs text-slate-500 font-medium max-w-2xl mt-1">
            Access board-certified physics textbooks, Class 11 blueprint question banks, and specialized JEE/NEET training worksheets.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {/* Custom Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF6B00] focus:bg-white placeholder-slate-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs Selection */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-200" id="pdf-categories-filters">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all select-none cursor-pointer border ${
            selectedCategory === 'all'
              ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-orange-500/10'
              : 'bg-white text-slate-650 border-slate-200 hover:bg-orange-50 hover:text-[#FF6B00]'
          }`}
        >
          All Material Notes
        </button>
        <button
          onClick={() => setSelectedCategory('chapters')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all select-none cursor-pointer border ${
            selectedCategory === 'chapters'
              ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-orange-500/10'
              : 'bg-white text-slate-655 border-slate-200 hover:bg-orange-50 hover:text-[#FF6B00]'
          }`}
        >
          1. Chapter PDFs
        </button>
        <button
          onClick={() => setSelectedCategory('boards')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all select-none cursor-pointer border ${
            selectedCategory === 'boards'
              ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-orange-500/10'
              : 'bg-white text-slate-655 border-slate-200 hover:bg-orange-50 hover:text-[#FF6B00]'
          }`}
        >
          2. Board Exam Question Banks
        </button>
      </div>

      {/* Card lists Grid render */}
      {filteredPDFs.length === 0 ? (
        <div className="glass-panel p-12 text-center" id="pdf-empty-state">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-600">No documents found matching your parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="pdf-cards-grid">
          {filteredPDFs.map((pdf) => (
            <div
              key={pdf.id}
              className="glass-panel p-5 flex flex-col justify-between hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/10 transition-all duration-300 transform hover:-translate-y-0.5 group"
              id={`pdf-card-${pdf.id}`}
            >
              <div className="space-y-4 font-sans">
                <div className="flex justify-between items-center gap-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border tracking-wider bg-orange-50 border-orange-100 text-[#FF6B00]">
                    {pdf.category === 'chapters' ? 'Chapter Notes' : 'Practice Paper'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">
                    {pdf.size} • {pdf.pages} pgs
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-50 text-[#FF6B00] border border-orange-100 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm md:text-base font-extrabold text-slate-800 group-hover:text-[#FF6B00] tracking-tight leading-tight line-clamp-1">
                      {pdf.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block mb-1">KEY CONTEXT:</span>
                  {pdf.summaryPoints.map((pt, i) => (
                    <div key={i} className="text-[11px] text-slate-600 leading-relaxed font-semibold flex gap-1.5 items-start">
                      <span className="text-[#FF6B00] shrink-0 select-none">•</span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center gap-3 pt-4 mt-4 border-t border-slate-100">
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500 inline-flex items-center gap-1">
                  Tier Check: <b className="text-slate-800 font-extrabold">{pdf.importance}</b>
                </span>
                
                <button
                  type="button"
                  onClick={() => handleOpenPdf(pdf)}
                  className="px-3.5 py-2 font-bold text-xs rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] text-white hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 border border-transparent shadow"
                >
                  <Eye className="w-3.5 h-3.5" /> View PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Embedded PDF Viewer Modal overlay */}
      {viewerModalPdf && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm animate-fade-in" id="pdf-viewer-overlay">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl relative overflow-hidden text-slate-800">
            
            {/* Modal Navigation Control Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClosePdf}
                  className="px-3.5 py-1.5 font-bold text-xs rounded-xl bg-white text-slate-700 hover:text-[#FF6B00] hover:bg-orange-50 transition-all cursor-pointer flex items-center gap-1.5 border border-slate-200 shrink-0"
                  id="pdf-back-button"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FF6B00]" />
                  <span>Back</span>
                </button>
                <div className="h-5 w-px bg-slate-200 hidden xs:block"></div>
                <div className="hidden md:block">
                  <h2 className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest leading-none">PDF READER</h2>
                  <span className="text-sm font-extrabold text-slate-900 mt-1 block max-w-xs md:max-w-md line-clamp-1 leading-tight">
                    {viewerModalPdf.title}
                  </span>
                </div>
              </div>

              {/* PDF zoom tools and direct visual selector */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 font-sans select-none">
                {/* Search Bar inside Page */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search inside page..."
                    value={pageSearchQuery}
                    onChange={(e) => setPageSearchQuery(e.target.value)}
                    className="bg-white border border-slate-200 pl-8 pr-3 py-1 rounded-xl text-xs font-bold focus:outline-none focus:border-[#FF6B00] w-36 sm:w-44 placeholder:text-slate-450"
                  />
                </div>

                <div className="hidden sm:flex items-center bg-white border border-slate-200 p-1 rounded-xl gap-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                    className="p-1 px-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-xs font-bold cursor-pointer hover:text-slate-800"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono font-bold px-2 text-[#FF6B00] select-none">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                    className="p-1 px-2.5 rounded-lg text-slate-500 hover:bg-slate-50 text-xs font-bold cursor-pointer hover:text-slate-800"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <button
                    onClick={() => setViewingMockMode(true)}
                    className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                      viewingMockMode
                        ? 'bg-[#FF6B00] text-white font-extrabold'
                        : 'bg-transparent text-slate-605 hover:text-[#FF6B00]'
                    }`}
                  >
                    Interactive Sheet
                  </button>
                  <button
                    onClick={() => setViewingMockMode(false)}
                    className={`px-3 py-1.5 text-xs font-bold cursor-pointer transition-all ${
                      !viewingMockMode
                        ? 'bg-[#FF6B00] text-white font-extrabold'
                        : 'bg-transparent text-slate-605 hover:text-[#FF6B00]'
                    }`}
                  >
                    Embedded PDF
                  </button>
                </div>

                {/* Bookmark Button */}
                <button
                  onClick={toggleBookmark}
                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                    isCurrentPageBookmarked 
                      ? 'bg-orange-50 border-orange-300 text-orange-500' 
                      : 'bg-white border-slate-200 text-slate-500 hover:text-orange-500 hover:bg-orange-50/50'
                  }`}
                  title="Bookmark current page"
                >
                  <Bookmark className={`w-4 h-4 ${isCurrentPageBookmarked ? 'fill-orange-500' : ''}`} />
                </button>

                {/* Full Screen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </button>

                <a
                  href={viewerModalPdf.pdfUrl || viewerModalPdf.fileUrl}
                  download
                  className="p-2 px-3 rounded-xl bg-white border border-slate-205 text-slate-750 hover:text-[#FF6B00] hover:bg-orange-50 transition-all text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  title="Offline download"
                >
                  <Download className="w-4 h-4 text-[#FF6B00]" />
                  <span className="hidden md:inline">Download</span>
                </a>
              </div>
            </div>

            {/* Pagination Controls Bar */}
            {viewingMockMode && (
              <div className="px-4 sm:px-5 py-2 bg-slate-100 border-b border-slate-200 flex justify-between items-center shrink-0 text-slate-700">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-all cursor-pointer flex items-center gap-1 select-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Prev
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500">Page</span>
                  <select
                     value={currentPage}
                     onChange={(e) => handlePageChange(parseInt(e.target.value))}
                     className="bg-white border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-[#FF6B00]"
                  >
                    {Array.from({ length: viewerModalPdf.pages || 14 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] sm:text-xs text-slate-404 text-slate-400 font-bold">of {viewerModalPdf.pages || 14}</span>
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(viewerModalPdf.pages || 14, currentPage + 1))}
                  disabled={currentPage === (viewerModalPdf.pages || 14)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 transition-all cursor-pointer flex items-center gap-1 select-none"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Document display board panel container */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 bg-slate-100 flex justify-center custom-scrollbar" id="pdf-viewer-board">
              <div
                className="w-full max-w-4xl bg-white text-slate-900 rounded-2xl p-4 sm:p-8 md:p-12 transition-all min-h-[500px] border border-slate-200 shadow-xl"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  maxHeight: zoomLevel > 100 ? `${100 + (zoomLevel - 100) * 1.5}%` : 'none'
                }}
              >
                {viewingMockMode ? (
                  <article className="space-y-8 text-left" id="mock-pdf-internal-booklet">
                    <div className="animate-fade-in text-slate-800">
                      {/* Text highlighting on search query */}
                      {(() => {
                        let pageComponent = null;
                        if (viewerModalPdf.id === 1) pageComponent = renderChapter8Page(currentPage);
                        else if (viewerModalPdf.id === 'ch-6-emi') pageComponent = renderChapter6Page(currentPage);
                        else if (viewerModalPdf.id === 'pract-emi') pageComponent = renderPracticePage('emi', currentPage);
                        else pageComponent = renderPracticePage('emw', currentPage);

                        return pageComponent;
                      })()}
                      
                      {/* Search query highlight hint */}
                      {pageSearchQuery && (
                        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-[10px] text-yellow-800 font-bold font-sans">
                          Searching for "{pageSearchQuery}" inside the text guide.
                        </div>
                      )}

                      <div className="mt-12 pt-5 border-t border-slate-205 text-center flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                        <span>SECTION {currentPage} • TIM PHYSICS SYSTEMS</span>
                        <span>Page {currentPage} of {viewerModalPdf.pages}</span>
                        <span>{isCurrentPageBookmarked ? '✓ Bookmarked' : ''}</span>
                      </div>
                    </div>
                  </article>
                ) : (
                  <div className="w-full h-full min-h-[500px]" id="pdf-viewer-frame-wrapper">
                    <iframe
                      src={viewerModalPdf.pdfUrl || viewerModalPdf.fileUrl}
                      title={viewerModalPdf.title}
                      className="w-full h-full min-h-[600px] rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
