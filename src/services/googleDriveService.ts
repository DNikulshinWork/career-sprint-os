import { getAccessToken } from './googleAuth';
import { Sprint, JobApplication } from '../types';

export interface DriveBackupMeta {
  id: string;
  name: string;
  modifiedTime: string;
  size?: string;
  progressPercent?: number;
}

export interface CareerSprintCloudData {
  version: string;
  exportedAt: string;
  device: string;
  sprints: Sprint[];
  applications: JobApplication[];
  notes?: string;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3';
const BACKUP_FILE_NAME = 'CareerSprint_State.json';

/**
 * Lists backups in Google Drive created by this app
 */
export async function listDriveBackups(): Promise<DriveBackupMeta[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Пользователь не авторизован в Google');

  const query = encodeURIComponent(`name = '${BACKUP_FILE_NAME}' and trashed = false`);
  const res = await fetch(`${DRIVE_API_URL}/files?q=${query}&fields=files(id,name,modifiedTime,size,description)&orderBy=modifiedTime desc`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Ошибка загрузки файлов с Google Диска');
  }

  const data = await res.json();
  return (data.files || []).map((f: any) => ({
    id: f.id,
    name: f.name,
    modifiedTime: f.modifiedTime,
    size: f.size ? `${(parseInt(f.size, 10) / 1024).toFixed(1)} KB` : undefined
  }));
}

/**
 * Saves current sprint data and applications to Google Drive
 */
export async function saveToGoogleDrive(
  sprints: Sprint[],
  applications: JobApplication[]
): Promise<{ fileId: string; modifiedTime: string }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Пользователь не авторизован в Google');

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

  const fileContent = JSON.stringify(payload, null, 2);

  // Check if file already exists
  const existingFiles = await listDriveBackups();
  const existingFile = existingFiles.length > 0 ? existingFiles[0] : null;

  if (existingFile) {
    // Update existing file
    const res = await fetch(`${DRIVE_UPLOAD_URL}/files/${existingFile.id}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: fileContent
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Ошибка обновления данных на Google Диске');
    }

    const updated = await res.json();
    return { fileId: updated.id, modifiedTime: new Date().toISOString() };
  } else {
    // Create new multipart file
    const metadata = {
      name: BACKUP_FILE_NAME,
      mimeType: 'application/json',
      description: `Синхронизация данных CareerSprint OS (Прогресс: ${progress}%)`
    };

    const boundary = '-------CareerSprintBoundary' + Date.now();
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const res = await fetch(`${DRIVE_UPLOAD_URL}/files?uploadType=multipart`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Ошибка создания файла на Google Диске');
    }

    const created = await res.json();
    return { fileId: created.id, modifiedTime: new Date().toISOString() };
  }
}

/**
 * Loads data from a Google Drive file
 */
export async function loadFromGoogleDrive(fileId: string): Promise<CareerSprintCloudData> {
  const token = await getAccessToken();
  if (!token) throw new Error('Пользователь не авторизован в Google');

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Ошибка чтения файла с Google Диска');
  }

  const data: CareerSprintCloudData = await res.json();
  if (!data.sprints || !Array.isArray(data.sprints)) {
    throw new Error('Некорректный формат данных в файле Google Диска');
  }
  return data;
}

/**
 * Deletes backup file with explicit caller confirmation
 */
export async function deleteDriveFile(fileId: string): Promise<void> {
  const token = await getAccessToken();
  if (!token) throw new Error('Пользователь не авторизован в Google');

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Ошибка удаления файла с Google Диска');
  }
}
