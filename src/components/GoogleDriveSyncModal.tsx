import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Cloud, 
  CloudUpload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  LogOut, 
  HardDrive, 
  FileText, 
  Clock, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Key, 
  FolderOpen, 
  Sparkles, 
  Info,
  CheckCircle
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getStoredCustomClientId,
  setStoredCustomClientId
} from '../services/googleAuth';
import { 
  saveToGoogleDrive, 
  listDriveBackups, 
  loadFromGoogleDrive, 
  deleteDriveFile, 
  DriveBackupMeta,
  CareerSprintCloudData 
} from '../services/googleDriveService';
import { Sprint, JobApplication } from '../types';
import { playTaskCompleteSound, triggerConfetti } from '../utils/effects';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprints: Sprint[];
  applications: JobApplication[];
  onRestoreData: (cloudData: CareerSprintCloudData) => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  sprints,
  applications,
  onRestoreData
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [backups, setBackups] = useState<DriveBackupMeta[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  
  // Tab: 'cloud_file' vs 'direct_oauth'
  const [activeTab, setActiveTab] = useState<'cloud_file' | 'direct_oauth'>('cloud_file');
  const [customClientId, setCustomClientId] = useState<string>('');
  const [isEditingClientId, setIsEditingClientId] = useState<boolean>(false);
  const [copiedOrigin, setCopiedOrigin] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current domain & strict origin for Google Cloud Console
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://dnikulshinwork.github.io';

  // Initialize stored client ID
  useEffect(() => {
    const stored = getStoredCustomClientId();
    if (stored) {
      setCustomClientId(stored);
    }
  }, []);

  // Initialize Auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        fetchBackups(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setBackups([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch backups whenever modal opens with valid token
  useEffect(() => {
    if (isOpen && token) {
      fetchBackups(token);
    }
  }, [isOpen, token]);

  const fetchBackups = async (activeToken?: string) => {
    try {
      const driveBackups = await listDriveBackups();
      setBackups(driveBackups);
    } catch (err: any) {
      console.warn('Could not list drive backups:', err.message);
    }
  };

  const handleSignInDirect = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      setUser(res.user);
      setToken(res.accessToken);
      setStatusMessage({ type: 'success', text: `Успешный вход в аккаунт Google: ${res.user.email || 'Авторизован'}` });
      playTaskCompleteSound();
      await fetchBackups(res.accessToken);
    } catch (err: any) {
      setStatusMessage({ 
        type: 'error', 
        text: err.message || 'Ошибка подключения к Google Drive API. Проверьте Authorized JavaScript origins.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCustomClientId = () => {
    setStoredCustomClientId(customClientId);
    setIsEditingClientId(false);
    setStatusMessage({
      type: 'success',
      text: customClientId.trim() 
        ? 'Личный Google Client ID сохранен в браузере! Теперь можно войти через Google.'
        : 'Настройки сброшены.'
    });
  };

  const handleCopyOrigin = () => {
    navigator.clipboard.writeText(currentOrigin);
    setCopiedOrigin(true);
    setTimeout(() => setCopiedOrigin(false), 2500);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setBackups([]);
      setStatusMessage({ type: 'info', text: 'Вы вышли из сессии Google' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDrive = async () => {
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Сначала выполните вход' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      await saveToGoogleDrive(sprints, applications);
      setStatusMessage({ 
        type: 'success', 
        text: `Все спринты и отклики успешно синхронизированы с Google Диском! (${new Date().toLocaleTimeString('ru-RU')})` 
      });
      playTaskCompleteSound();
      triggerConfetti();
      await fetchBackups(token);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка сохранения на Google Диск' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreFromDrive = async (fileId: string) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const cloudData = await loadFromGoogleDrive(fileId);
      onRestoreData(cloudData);
      setStatusMessage({ 
        type: 'success', 
        text: `Данные успешно восстановлены с Google Диска! Загружено ${cloudData.sprints.length} спринтов.` 
      });
      setConfirmRestoreId(null);
      playTaskCompleteSound();
      triggerConfetti();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка загрузки данных' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = async (fileId: string) => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      await deleteDriveFile(fileId);
      setStatusMessage({ type: 'info', text: 'Резервная копия удалена с Google Диска' });
      setIsDeletingId(null);
      await fetchBackups(token || undefined);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка удаления файла' });
    } finally {
      setIsLoading(false);
    }
  };

  // Instant File Backup / Restore (Universal & Privacy-first standard)
  const handleDownloadFileBackup = () => {
    const totalTasks = sprints.reduce((acc, s) => acc + s.tasks.length, 0);
    const doneTasks = sprints.reduce((acc, s) => acc + s.tasks.filter(t => t.completed).length, 0);
    const progress = Math.round((doneTasks / totalTasks) * 100) || 0;

    const payload: CareerSprintCloudData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      device: navigator.userAgent,
      sprints,
      applications,
      notes: `Спринты Дмитрия Никульшина. Прогресс: ${progress}%, выполнено задач: ${doneTasks}/${totalTasks}`
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CareerSprint_State_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    playTaskCompleteSound();
    setStatusMessage({
      type: 'success',
      text: 'Файл CareerSprint_State.json сохранен на устройство! Вы можете загрузить его в свой Google Диск для надежного бэкапа.'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed.sprints || !Array.isArray(parsed.sprints)) {
          throw new Error('Файл не содержит корректных данных спринтов');
        }
        onRestoreData(parsed);
        playTaskCompleteSound();
        triggerConfetti();
        setStatusMessage({
          type: 'success',
          text: `Данные успешно восстановлены! Загружено ${parsed.sprints.length} спринтов и ${parsed.applications?.length || 0} откликов.`
        });
      } catch (err: any) {
        setStatusMessage({
          type: 'error',
          text: err.message || 'Ошибка парсинга JSON файла'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-5 my-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">
                Облачное хранилище CareerSprint OS
              </h3>
              <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                Google Drive Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Сохранение и синхронизация прогресса спринтов, базы откликов и артефактов
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('cloud_file')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'cloud_file'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>⚡ Файл для Google Диска (Рекомендуемый)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('direct_oauth')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'direct_oauth'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-blue-400" />
            <span>Прямой Google Drive API (OAuth 2.0)</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300' 
              : statusMessage.type === 'error'
              ? 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
              : 'bg-blue-950/40 border border-blue-500/40 text-blue-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <RefreshCw className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">{statusMessage.text}</div>
          </div>
        )}

        {/* TAB 1: Instant Cloud File Backup & Restore (Zero friction, 100% reliable) */}
        {activeTab === 'cloud_file' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Автономная синхронизация состояния
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Единый структурированный файл <strong className="text-white font-mono">CareerSprint_State.json</strong> позволяет сохранять прогресс и мгновенно переносить его между вашим смартфоном, планшетом и рабочим компьютером.
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadFileBackup}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>1. Скачать CareerSprint_State.json</span>
                </button>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-semibold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>2. Восстановить из файла .json</span>
                  </button>
                </div>
              </div>

              {/* Quick direct link to open Google Drive */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Храните файл в любой папке вашего Google Диска:</span>
                <a
                  href="https://drive.google.com/drive/my-drive"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold underline"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Открыть мой Google Диск ↗</span>
                </a>
              </div>
            </div>

            {/* Explanatory Info Box */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Преимущества:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Файл содержит 100% данных: все выполненные задачи 6 спринтов, прикрепленные ссылки на коммиты/резюме, заметки, воронку вакансий и финансовые расчеты. Никаких сторонних серверов или риска потери данных.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: Direct Google Drive API via User's Own OAuth Client ID */}
        {activeTab === 'direct_oauth' && (
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  <span>Личный Google OAuth Client ID:</span>
                </span>
                {customClientId && !isEditingClientId && (
                  <button
                    type="button"
                    onClick={() => setIsEditingClientId(true)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Изменить
                  </button>
                )}
              </div>

              {isEditingClientId || !customClientId ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="123456789-abcdef.apps.googleusercontent.com"
                    value={customClientId}
                    onChange={(e) => setCustomClientId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-400"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={handleCopyOrigin}
                      className="text-[11px] flex items-center gap-1 text-slate-400 hover:text-slate-200"
                    >
                      {copiedOrigin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Origin: {currentOrigin}</span>
                    </button>
                    <div className="flex items-center gap-2">
                      {customClientId && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomClientId(getStoredCustomClientId());
                            setIsEditingClientId(false);
                          }}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1"
                        >
                          Отмена
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleSaveCustomClientId}
                        className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-4 py-1.5 rounded-lg transition-all"
                      >
                        Сохранить Client ID
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-300 truncate max-w-sm">
                    {customClientId}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Подключен</span>
                  </span>
                </div>
              )}

              {/* Login Button with Client ID */}
              {!user ? (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleSignInDirect}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs border border-slate-200 cursor-pointer disabled:opacity-60"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>{isLoading ? 'Авторизация...' : 'Войти через Google'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-white font-semibold">{user.email || 'Авторизован'}</span>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-rose-400 hover:underline text-[11px]"
                    >
                      Выйти
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveToDrive}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-all"
                  >
                    <CloudUpload className="w-4 h-4" />
                    <span>Синхронизировать с Google Диском</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick clean setup guide */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 space-y-2">
              <div className="font-semibold text-white">Инструкция для подключения Google Cloud:</div>
              <ol className="list-decimal pl-4 space-y-1.5 text-slate-400 text-[11px]">
                <li>В <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-mono">Google Cloud Console ↗</a> перейдите в Credentials.</li>
                <li>Нажмите <strong>Create Credentials → OAuth client ID</strong> (Web application).</li>
                <li>В блоке <strong>«Authorized JavaScript origins»</strong> добавьте строгий origin: <code className="text-white bg-slate-900 px-1.5 py-0.5 rounded font-mono">{currentOrigin}</code> <em>(без слэша на конце)</em>.</li>
                <li>Сохраните и вставьте полученный Client ID в поле выше.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Security & Privacy */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Конфиденциальность и безопасность данных:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Все данные спринтов, резюме и контактов принадлежат только вам. Они не передаются третьим лицам и сохраняются локально либо в вашем персональном Google Диске.
          </p>
        </div>
      </div>
    </div>
  );
};
