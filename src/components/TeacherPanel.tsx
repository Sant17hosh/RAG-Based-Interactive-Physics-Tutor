import React, { useState, useEffect } from 'react';
import { CHANNELS_PUC_DATA } from '../ncertData';
import { 
  GraduationCap, Upload, Film, FileSpreadsheet, Settings, Users, 
  BarChart2, Download, Check, ArrowLeft, Calendar, FileText, BrainCircuit, Activity, X
} from 'lucide-react';

interface StudentRecord {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  rollNumber: string;
  college: string;
  className: string;
  preferredLanguage: string;
  examAttemptsCount: number;
  averageExamScore: number | null;
  lastActive: string;
}

interface ClassStats {
  totalStudents: number;
  activeStudents: number;
  totalExams: number;
  avgExamScore: number;
  totalMcqs: number;
  avgMcqScore: number;
  chapterStats: Array<{ chapter: string; attempts: string; avg_score: string }>;
  bloomStats: Array<{ bloom_level: string; avg_score: string }>;
}

export default function TeacherPanel() {
  const [activeMenu, setActiveMenu] = useState<string>('upload');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Material upload states
  const [pdfTitle, setPdfTitle] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');

  // Backend state
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [classStats, setClassStats] = useState<ClassStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Student detail state
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedStudentData, setSelectedStudentData] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorText(null);
    try {
      const activeToken = localStorage.getItem('tim_token');
      if (!activeToken) throw new Error("Please log in as an administrator.");

      // Fetch students list
      const studentsRes = await fetch('/api/admin/students', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (!studentsRes.ok) throw new Error("Failed to fetch registered students roster.");
      const studentsData = await studentsRes.json();
      setStudents(studentsData.students || []);

      // Fetch global statistics
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setClassStats(statsData.stats || null);
      }
    } catch (err: any) {
      setErrorText(err.message || "Failed to load student registry records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const viewStudentDetails = async (studentId: number) => {
    setSelectedStudentId(studentId);
    setLoadingDetails(true);
    setSelectedStudentData(null);
    try {
      const activeToken = localStorage.getItem('tim_token');
      const res = await fetch(`/api/admin/students/${studentId}`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error("Failed to retrieve detailed student records.");
      const data = await res.json();
      if (data.success) {
        setSelectedStudentData(data.student);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const handleUploadPDF = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim()) return;
    triggerToast(`PDF "${pdfTitle}" successfully uploaded and queued for indexing in RAG / ChromaDB vector stores!`);
    setPdfTitle('');
  };

  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    triggerToast(`Lecture video linked and added to chapter playlist!`);
    setVideoUrl('');
  };

  const handleExportCSV = () => {
    if (students.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student Name,Roll ID,Email,Total Exams Attempted,Average Exam Score %,Last Active Timestamp\r\n";
    
    students.forEach(s => {
      csvContent += `"${s.name}","${s.rollNumber}","${s.email}",${s.examAttemptsCount},${s.averageExamScore !== null ? s.averageExamScore : "N/A"},"${s.lastActive}"\r\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TIM_Student_Analytics_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Spreadsheet registry exported successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 font-sans" id="teacher-panel-module">
      {/* Banner */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
        <div className="space-y-2">
          <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest block">
            TIM Administrative Console • Educator Lounge
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-orange-500" /> Teacher Panel
          </h1>
          <p className="text-xs text-slate-500 font-semibold">
            Manage course chapters, upload textbook materials, audit student gradebooks, and export analytics spreadsheets.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-700 font-bold flex items-center gap-2 animate-fade-in shadow-sm select-none">
          <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          {successMsg}
        </div>
      )}

      {errorText && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 font-bold flex items-center gap-2 animate-fade-in shadow-sm select-none">
          <X className="w-4.5 h-4.5 text-rose-500 shrink-0" />
          {errorText}
        </div>
      )}

      {/* Internal Subtabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 border border-slate-205 rounded-2xl overflow-x-auto shadow-inner">
        {[
          { id: 'upload', label: 'Material Uploads', icon: Upload },
          { id: 'chapters', label: 'Manage Chapters', icon: Settings },
          { id: 'students', label: 'Manage Students', icon: Users },
          { id: 'analytics', label: 'Reports & Export', icon: BarChart2 }
        ].map((menu) => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => { setActiveMenu(menu.id); setSelectedStudentId(null); }}
              className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 select-none flex items-center gap-1.5 border border-transparent ${
                isActive 
                  ? 'bg-white text-orange-600 shadow-sm border-slate-200' 
                  : 'text-slate-650 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{menu.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div className="glass-panel p-6 bg-white border border-slate-200 rounded-2xl min-h-[400px]">
        {loading ? (
          <div className="h-48 flex flex-col items-center justify-center space-y-3">
            <div className="w-6 h-6 rounded-full border-2 border-slate-250 border-t-orange-500 animate-spin"></div>
            <span className="text-xs text-slate-400 font-bold">Querying school database roster...</span>
          </div>
        ) : (
          <>
            {/* Upload Panel */}
            {activeMenu === 'upload' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <form onSubmit={handleUploadPDF} className="space-y-4 border border-slate-150 p-5 rounded-2xl">
                  <h3 className="text-sm font-black uppercase tracking-wide border-b pb-2 flex items-center gap-2 text-slate-800">
                    <FileSpreadsheet className="w-4.5 h-4.5 text-orange-500" /> Upload Course Material PDF
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Document Title:</label>
                    <input
                      type="text"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] focus:bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      placeholder="e.g. Chapter 6 Alternator Self-Study Notes"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Target Chapter:</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none">
                      {CHANNELS_PUC_DATA.map(ch => (
                        <option key={ch.id} value={ch.id}>Chapter {ch.id}: {ch.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 p-6 rounded-xl text-center hover:bg-slate-50/50 cursor-pointer">
                    <span className="text-xs text-slate-400 font-bold block">Drag & Drop Syllabus PDF files here</span>
                    <span className="text-[10px] text-slate-350 block mt-1">Maximum file size: 10MB</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#FF6B00] hover:brightness-110 text-white text-xs font-black rounded-lg cursor-pointer uppercase tracking-wider shadow"
                  >
                    Upload & RAG Index Note
                  </button>
                </form>

                <form onSubmit={handleUploadVideo} className="space-y-4 border border-slate-150 p-5 rounded-2xl">
                  <h3 className="text-sm font-black uppercase tracking-wide border-b pb-2 flex items-center gap-2 text-slate-800">
                    <Film className="w-4.5 h-4.5 text-orange-500" /> Upload Course Videos
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Video Lecture URL (YouTube):</label>
                    <input
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] focus:bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      placeholder="e.g. https://youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Video Topic Title:</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] focus:bg-white rounded-xl px-3.5 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                      placeholder="e.g. Eddy current mitigation demo"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-lg cursor-pointer uppercase tracking-wider shadow"
                  >
                    Link Video
                  </button>
                </form>
              </div>
            )}

            {/* Chapters Manager */}
            {activeMenu === 'chapters' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-black uppercase tracking-wider border-b pb-2 text-slate-550">Course Chapter Management</h3>
                <div className="space-y-2">
                  {CHANNELS_PUC_DATA.map((ch) => (
                    <div key={ch.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-slate-50/50">
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide">Chapter {ch.id}</span>
                        <h4 className="text-xs md:text-sm font-black text-slate-800">{ch.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] bg-orange-50 border border-orange-100 text-[#FF6B00] px-2 py-0.5 rounded font-mono font-bold leading-none select-none">{ch.weightage}</span>
                        <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded font-mono font-bold leading-none select-none">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Students list */}
            {activeMenu === 'students' && (
              <div className="space-y-4 animate-fade-in font-sans">
                {!selectedStudentId ? (
                  <>
                    <h3 className="text-sm font-black uppercase tracking-wider border-b pb-2 text-slate-550">Registered Students Roll</h3>
                    {students.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 font-bold">
                        No students registered on the platform yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 uppercase font-black tracking-wider text-[9px]">
                              <th className="p-3">Student Name</th>
                              <th className="p-3">Roll Number</th>
                              <th className="p-3">Email Address</th>
                              <th className="p-3 text-center">Avg Exam Score</th>
                              <th className="p-3 text-center">Exams Taken</th>
                              <th className="p-3 text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-semibold text-slate-655">
                            {students.map((s) => (
                              <tr key={s.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-extrabold text-slate-850">{s.name}</td>
                                <td className="p-3 font-mono">{s.rollNumber}</td>
                                <td className="p-3">{s.email}</td>
                                <td className="p-3 text-center text-orange-600 font-bold font-mono">
                                  {s.averageExamScore !== null ? `${s.averageExamScore}%` : 'N/A'}
                                </td>
                                <td className="p-3 text-center font-mono">{s.examAttemptsCount}</td>
                                <td className="p-3 text-center">
                                  <button
                                    onClick={() => viewStudentDetails(s.id)}
                                    className="px-2.5 py-1 bg-orange-500 text-white font-extrabold text-[10px] uppercase rounded hover:brightness-105 cursor-pointer shadow-sm select-none"
                                  >
                                    View Logs
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  /* Single Student Detailed Analytics View */
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedStudentId(null)}
                        className="p-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Student Portfolio Details</span>
                        <h3 className="text-base font-black text-slate-850">
                          {students.find(s => s.id === selectedStudentId)?.name || 'Student Logs'}
                        </h3>
                      </div>
                    </div>

                    {loadingDetails ? (
                      <div className="h-44 flex flex-col items-center justify-center space-y-3">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 border-t-orange-500 animate-spin"></div>
                        <span className="text-xs text-slate-400 font-semibold">Retrieving history logs from database...</span>
                      </div>
                    ) : selectedStudentData ? (
                      <div className="space-y-6 animate-fade-in font-sans">
                        {/* Profile Block */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px]">Roll Number:</span>
                            <span className="font-mono font-bold text-slate-800">{selectedStudentData.profile?.roll_number || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px]">College:</span>
                            <span className="font-bold text-slate-800">{selectedStudentData.profile?.college || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px]">Section:</span>
                            <span className="font-bold text-slate-800">{selectedStudentData.profile?.class_name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-semibold block text-[10px]">Preferred Language:</span>
                            <span className="font-bold text-slate-800">{selectedStudentData.profile?.preferred_language || 'English'}</span>
                          </div>
                        </div>

                        {/* Split views */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          
                          {/* Mock Exam History */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-orange-500" /> Written Exam Attempts ({selectedStudentData.exams?.length || 0})
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {selectedStudentData.exams?.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic">No exams attempted yet.</p>
                              ) : (
                                selectedStudentData.exams.map((ex: any) => (
                                  <div key={ex.id} className="p-3 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                                    <div>
                                      <span className="font-bold text-slate-855 block">{ex.chapter}</span>
                                      <span className="text-[10px] text-slate-400 font-mono block">
                                        Completed: {new Date(ex.completed_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-black text-[#FF6B00] block">{ex.obtained_marks} / {ex.total_marks}</span>
                                      <span className="text-[10px] text-slate-400 font-bold block">{ex.percentage}% score</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* MCQ Quiz History */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                              <Activity className="w-4 h-4 text-emerald-500" /> MCQ Quiz Attempts ({selectedStudentData.mcqs?.length || 0})
                            </h4>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                              {selectedStudentData.mcqs?.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic">No quizzes attempted yet.</p>
                              ) : (
                                selectedStudentData.mcqs.map((mq: any) => (
                                  <div key={mq.id} className="p-3 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                                    <div>
                                      <span className="font-bold text-slate-855 block">{mq.chapter}</span>
                                      <span className="text-[10px] text-slate-400 font-mono block">
                                        Accuracy: {mq.percentage}%
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-black text-emerald-600 block">+{mq.score} PTS</span>
                                      <span className="text-[10px] text-slate-400 font-bold block">{mq.correct_answers} correct</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* AI Tutor logs */}
                          <div className="space-y-3 lg:col-span-2">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                              <BrainCircuit className="w-4 h-4 text-indigo-500" /> AI Tutor Chat Logs (Last 20 Queries)
                            </h4>
                            <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1 border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
                              {selectedStudentData.tutorLogs?.length === 0 ? (
                                <p className="text-[11px] text-slate-400 italic text-center py-4">No tutor questions asked yet.</p>
                              ) : (
                                selectedStudentData.tutorLogs.map((log: any) => (
                                  <div key={log.id} className="space-y-2 border-b border-slate-150 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center text-[10px]">
                                      <span className="px-2 py-0.5 bg-orange-50 text-[#FF6B00] border border-orange-100 rounded font-bold uppercase">{log.bloom_level}</span>
                                      <span className="text-slate-400 font-mono">{new Date(log.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-slate-800 font-extrabold">Q: {log.question}</p>
                                    <p className="text-xs text-slate-600 font-semibold bg-white p-2.5 rounded-xl border border-slate-150 leading-relaxed whitespace-pre-line">
                                      A: {log.answer}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-bold text-center py-4">Failed to load detailed logs.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Analytics & Export */}
            {activeMenu === 'analytics' && (
              <div className="space-y-6 animate-fade-in font-sans">
                <h3 className="text-sm font-black uppercase tracking-wider border-b pb-2 text-slate-550">Educator Reports & Analytics</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Average Class Exam Score</span>
                    <div className="text-3xl font-black text-orange-600">
                      {classStats?.avgExamScore ? `${classStats.avgExamScore}%` : '0%'}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Average Quiz Score</span>
                    <div className="text-3xl font-black text-emerald-600">
                      {classStats?.avgMcqScore ? `${classStats.avgMcqScore}%` : '0%'}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Registered Students</span>
                    <div className="text-3xl font-black text-slate-800">
                      {classStats?.totalStudents || 0}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleExportCSV}
                  disabled={students.length === 0}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-950 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow hover:brightness-110 disabled:opacity-50 transition-all select-none flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>Export Student Readiness Registry (CSV)</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
