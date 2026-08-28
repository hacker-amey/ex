import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  BookOpen, 
  UserCheck, 
  AlertCircle,
  FileCheck,
  Bell
} from 'lucide-react';

interface CampusOSProps {
  data: any;
  onAction: (action: string, payload: any) => void;
}

export const CampusOSProduct: React.FC<CampusOSProps> = ({ data, onAction }) => {
  const [activeTab, setActiveTab] = useState<'students' | 'courses' | 'notices'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedAssignment, setSubmittedAssignment] = useState(false);

  const students = data?.students || [];
  const courses = data?.courses || [];
  const notices = data?.notices || [];

  const filteredStudents = students.filter((s: any) => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.major.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleAttendance = (studentId: string, present: boolean) => {
    onAction('CAMPUSOS_TOGGLE_ATTENDANCE', { studentId, present });
  };

  return (
    <div className="rounded-2xl bg-[#090b10] border border-zinc-800 text-zinc-100 overflow-hidden shadow-2xl">
      {/* Topbar */}
      <div className="bg-[#121520] border-b border-zinc-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm tracking-tight text-white">CampusOS</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                UNIVERSITY SYSTEM
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Student records, course registry & attendance ledger</p>
          </div>
        </div>

        {/* View toggles */}
        <div className="flex items-center p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'students' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Student Directory
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'courses' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Course Schedule
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'notices' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Campus Notices
          </button>
        </div>
      </div>

      {/* STUDENTS DIRECTORY VIEW */}
      {activeTab === 'students' && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search student or major..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <span className="text-xs font-mono text-zinc-400">Total Enrolled: {students.length}</span>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                <tr>
                  <th className="p-3">STUDENT</th>
                  <th className="p-3">MAJOR & YEAR</th>
                  <th className="p-3">CUMULATIVE GPA</th>
                  <th className="p-3">ATTENDANCE</th>
                  <th className="p-3">RECORD ATTENDANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {filteredStudents.map((s: any) => (
                  <tr key={s.id} className="hover:bg-zinc-900/40">
                    <td className="p-3">
                      <span className="font-bold text-white block">{s.name}</span>
                      <span className="text-[10px] text-zinc-400">{s.id}</span>
                    </td>
                    <td className="p-3 text-zinc-300">
                      <span>{s.major}</span>
                      <span className="text-[10px] text-zinc-400 block">{s.semester}</span>
                    </td>
                    <td className="p-3 font-bold text-cyan-400">{s.gpa.toFixed(2)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        s.attendance >= 90 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {s.attendance}%
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAttendance(s.id, true)}
                        className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                      >
                        + Present
                      </button>
                      <button
                        onClick={() => handleToggleAttendance(s.id, false)}
                        className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold"
                      >
                        - Absent
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COURSES VIEW */}
      {activeTab === 'courses' && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((c: any) => (
            <div key={c.id} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 font-mono">{c.code}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">{c.credits} Credits</span>
              </div>
              <h4 className="text-sm font-bold text-white">{c.name}</h4>
              <p className="text-xs text-zinc-400">Instructor: <span className="text-zinc-200">{c.instructor}</span></p>
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.schedule}</span>
                <span className="text-emerald-400">{c.enrolled} Enrolled</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NOTICES VIEW & SUBMISSION */}
      {activeTab === 'notices' && (
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-violet-400" />
              <span>Assignment Portal Simulator</span>
            </h4>
            <p className="text-xs text-zinc-400">Submit final laboratory report for CS-301: Distributed Cloud Systems.</p>
            <button
              onClick={() => setSubmittedAssignment(!submittedAssignment)}
              className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase font-mono transition-all"
            >
              {submittedAssignment ? 'Assignment Submitted (Grade: A+)' : 'Submit Lab Project'}
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Official Academic Notices</span>
            </h4>
            {notices.map((n: any) => (
              <div key={n.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-white">{n.title}</h5>
                  <span className="text-[10px] font-mono text-zinc-500">{n.date}</span>
                </div>
                <p className="text-xs text-zinc-400">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
