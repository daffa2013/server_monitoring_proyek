import React, { useState } from 'react';
import { EDUCATIONAL_CONCEPTS } from '../data/initialData';
import { BookOpen, Cpu, HardDrive, Zap, Activity, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export const EducationalGlossaryView: React.FC = () => {
  const [activeQuizQuestion, setActiveQuizQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  const quizQuestions = [
    {
      q: 'Jika 35 siswa membuka game kuis sejarah bersamaan di lab komputer, komponen server manakah yang paling cepat naik bebannya?',
      options: [
        'CPU (untuk memproses perhitungan skor siswa secara serentak)',
        'Warna monitor komputer',
        'Kabel colokan listrik stopkontak'
      ],
      correct: 0,
      explanation: 'Tepat sekali! CPU bertindak seperti otak koki yang mengolah setiap jawaban kuis siswa dalam hitungan milidetik.'
    },
    {
      q: 'Apa perbedaan utama antara RAM dan Disk Storage pada server sekolah?',
      options: [
        'RAM menyimpan data sementara yang sedang aktif dibuka; Disk menyimpan permanen meski server mati',
        'RAM hanya untuk memutar musik, Disk untuk gambar',
        'Tidak ada bedanya sama sekali'
      ],
      correct: 0,
      explanation: 'Benar! RAM ibarat meja kerja yang luas, sedangkan Disk adalah lemari arsip buku permanen.'
    },
    {
      q: 'Berapakah angka latensi (ping) yang dianggap sangat cepat dan nyaman untuk game atau web siswa?',
      options: [
        'Di bawah 50 milidetik (ms)',
        'Di atas 5000 milidetik (5 detik)',
        '1 jam'
      ],
      correct: 0,
      explanation: 'Luar biasa! Latensi di bawah 50ms membuat halaman web terasa instan dan tanpa jeda.'
    }
  ];

  const handleSelectQuiz = (idx: number) => {
    if (isAnswered) return;
    soundManager.playClick();
    setSelectedAnswer(idx);
    setIsAnswered(true);

    if (idx === quizQuestions[activeQuizQuestion].correct) {
      soundManager.playMilestoneChime();
      setScore(s => s + 1);
    } else {
      soundManager.playAlert();
    }
  };

  const nextQuiz = () => {
    soundManager.playClick();
    if (activeQuizQuestion < quizQuestions.length - 1) {
      setActiveQuizQuestion(a => a + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // finish
      soundManager.playFanfare();
      setActiveQuizQuestion(quizQuestions.length);
    }
  };

  const resetQuiz = () => {
    soundManager.playClick();
    setActiveQuizQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsAnswered(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold text-cyan-400 tracking-wider mb-1">
          MATERI PEMBELAJARAN INFORMATIKA KELAS 7
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Pojok Belajar: Memahami Server & Sumber Daya Komputer
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Pelajari konsep server melalui analogi kehidupan sehari-hari agar siswa kelas 7 mengerti
          mengapa sebuah website bisa cepat, bagaimana data disimpan, dan pentingnya optimasi.
        </p>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EDUCATIONAL_CONCEPTS.map(concept => (
          <div
            key={concept.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                  {concept.id}
                </span>
                <span className="text-xs font-medium text-amber-300">
                  Analogi: {concept.analogy}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                {concept.term}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {concept.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400">
              <span className="font-semibold text-slate-200 block mb-1">
                Kondisi Ideal Server Sekolah:
              </span>
              <span>{concept.idealState}</span>
            </div>
          </div>
        ))}

        {/* Bonus Concept: Arsitektur Client-Server */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                MODEL JARINGAN
              </span>
              <span className="text-xs font-medium text-amber-300">
                Analogi: Pemesan & Dapur
              </span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Klien (Siswa) & Server (Pelayan)
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Komputer atau ponsel siswa disebut <strong>Klien (Client)</strong> yang memesan halaman web.
              Komputer di lab sekolah yang menjawab pesanan tersebut disebut <strong>Server</strong>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400">
            <span className="font-semibold text-slate-200 block mb-1">Tips Kelas 7:</span>
            <span>Semakin rapi kode HTML/CSS siswa, semakin ringan tugas server melayaninya!</span>
          </div>
        </div>
      </div>

      {/* Interactive Quick Quiz for 7th Graders */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Kuis Cepat Pemahaman Server Siswa
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeQuizQuestion < quizQuestions.length ? `Soal ${activeQuizQuestion + 1} dari 3` : 'Hasil Kuis'}
          </span>
        </div>

        {activeQuizQuestion < quizQuestions.length ? (
          <div className="space-y-4 max-w-2xl">
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              {quizQuestions[activeQuizQuestion].q}
            </p>

            <div className="space-y-2">
              {quizQuestions[activeQuizQuestion].options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === quizQuestions[activeQuizQuestion].correct;

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectQuiz(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      !isAnswered
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        : isCorrect
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                        : isSelected
                        ? 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="pt-2 flex items-center justify-between">
                <p className="text-xs text-slate-300">
                  {quizQuestions[activeQuizQuestion].explanation}
                </p>
                <button
                  onClick={nextQuiz}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer shrink-0 ml-4"
                >
                  Lanjut Soal Berikutnya →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-4 max-w-md mx-auto">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Hebat! Kamu Menyelesaikan Kuis!</h3>
            <p className="text-xs text-slate-300">
              Skor Kamu: <span className="font-bold text-cyan-400 font-mono text-base">{score} / 3</span> jawaban benar.
              Pemahamanmu tentang konsep server dan sumber daya sangat baik!
            </p>
            <button
              onClick={resetQuiz}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer"
            >
              Ulangi Kuis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
