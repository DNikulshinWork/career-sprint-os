import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  CloudUpload, 
  CloudDownload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  RefreshCw, 
  LogOut, 
  ExternalLink,
  HardDrive,
  FileText,
  Clock
} from 'lucide-react';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  getAccessToken 
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
import { User } from 'firebase/auth';
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [backups, setBackups] = useState<DriveBackupMeta[]>([]);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);

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

  const handleSignIn = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      setUser(res.user);
      setToken(res.accessToken);
      setStatusMessage({ type: 'success', text: `Успешный вход в аккаунт: ${res.user.email}` });
      playTaskCompleteSound();
      await fetchBackups(res.accessToken);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Ошибка входа через Google' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      setToken(null);
      setBackups([]);
      setStatusMessage({ type: 'info', text: 'Вы вышли из аккаунта Google' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDrive = async () => {
    if (!token) {
      setStatusMessage({ type: 'error', text: 'Сначала войдите через Google' });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    try {
      const result = await saveToGoogleDrive(sprints, applications);
      setStatusMessage({ 
        type: 'success', 
        text: `Все спринты и отклики успешно сохранены в Google Диск! (${new Date().toLocaleTimeString('ru-RU')})` 
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 via-blue-500/20 to-emerald-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">
                Синхронизация с Google Drive
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                OAuth 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Хранение и упорядочение прогресса спринтов, базы откликов и артефактов в вашем личном облаке
            </p>
          </div>
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
            <div className="flex-1">{statusMessage.text}</div>
          </div>
        )}

        {/* Auth State Box */}
        {!user ? (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-4">
            <div className="max-w-md mx-auto text-xs text-slate-300 leading-relaxed">
              Войдите в свой аккаунт Google, чтобы связать CareerSprint OS с вашим Google Диском. Данные будут храниться в отдельном зашифрованном файле <span className="font-mono text-cyan-400">CareerSprint_State.json</span>.
            </div>

            {/* Official Google Sign-in Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoading}
                className="inline-flex items-center gap-3 bg-white hover:bg-slate-100 text-slate-800 font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all text-xs border border-slate-200 cursor-pointer disabled:opacity-60"
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
          </div>
        ) : (
          <div className="space-y-4">
            {/* User Profile Bar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-9 h-9 rounded-full border border-cyan-500/40" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {user.displayName || 'Пользователь Google'}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-rose-400 bg-slate-900 hover:bg-rose-950/20 border border-slate-800 px-3 py-1.5 rounded-lg transition-all"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Выйти</span>
                </button>
              </div>
            </div>

            {/* Sync Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSaveToDrive}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 px-4 rounded-xl text-xs shadow-lg shadow-blue-600/20 transition-all disabled:opacity-60 cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" />
                <span>Сохранить текущие данные на Диск</span>
              </button>

              <button
                type="button"
                onClick={() => fetchBackups(token || undefined)}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-3 px-4 rounded-xl text-xs border border-slate-700 transition-all disabled:opacity-60 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Проверить обновления на Диске</span>
              </button>
            </div>

            {/* Cloud Files List */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Файлы синхронизации в вашем Google Диске:</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {backups.length} файл(ов)
                </span>
              </div>

              {backups.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  Резервная копия еще не создана. Нажмите «Сохранить текущие данные на Диск», чтобы выгрузить состояние.
                </div>
              ) : (
                <div className="space-y-2">
                  {backups.map((b) => (
                    <div
                      key={b.id}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <div>
                          <div className="text-xs font-semibold text-white font-mono">
                            {b.name}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 font-mono">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(b.modifiedTime).toLocaleString('ru-RU')}
                            </span>
                            {b.size && <span>• {b.size}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons with custom confirmation */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {confirmRestoreId === b.id ? (
                          <div className="flex items-center gap-1 bg-amber-950/60 border border-amber-500/40 p-1 rounded-lg">
                            <span className="text-[10px] text-amber-300 px-1">Заменить локальные данные?</span>
                            <button
                              type="button"
                              onClick={() => handleRestoreFromDrive(b.id)}
                              className="text-[10px] bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded font-bold"
                            >
                              Да
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmRestoreId(null)}
                              className="text-[10px] text-slate-400 hover:text-white px-1"
                            >
                              Отмена
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmRestoreId(b.id)}
                            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <CloudDownload className="w-3.5 h-3.5" />
                            <span>Восстановить в приложение</span>
                          </button>
                        )}

                        {isDeletingId === b.id ? (
                          <div className="flex items-center gap-1 bg-rose-950/60 border border-rose-500/40 p-1 rounded-lg">
                            <span className="text-[10px] text-rose-300 px-1">Удалить файл?</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteBackup(b.id)}
                              className="text-[10px] bg-rose-600 hover:bg-rose-500 text-white px-2 py-0.5 rounded font-bold"
                            >
                              Да
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsDeletingId(null)}
                              className="text-[10px] text-slate-400 hover:text-white px-1"
                            >
                              Отмена
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsDeletingId(b.id)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/20 transition-colors"
                            title="Удалить файл с Google Диска"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security & Architecture Note */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Конфиденциальность и архитектура доступа:</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Приложение запрашивает минимально достаточный скоуп <code className="text-white font-mono bg-slate-900 px-1 py-0.5 rounded">https://www.googleapis.com/auth/drive.file</code>. Это гарантирует, что у приложения есть доступ <strong>исключительно к файлам, которые оно создало само</strong>. Ваши остальные личные файлы, фотографии и документы на Диске остаются полностью недоступны.
          </p>
        </div>
      </div>
    </div>
  );
};
