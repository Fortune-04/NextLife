import { useState } from 'react'
import axios from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../Components/ui/alert-dialog'
import { TriangleAlert, Trash2, Settings as SettingsIcon, CheckCircle2, XCircle, Download, Upload, HardDrive } from 'lucide-react'

const Settings: React.FC = () => {
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState('')
  const [backupMessage, setBackupMessage] = useState('')
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)

  const handleReset = async () => {
    setResetting(true)
    setMessage('')
    try {
      await axios.delete('http://localhost:4001/settings/reset')
      setMessage('All data has been reset successfully.')
    } catch (error) {
      console.log(error)
      setMessage('Failed to reset data. Please try again.')
    }
    setResetting(false)
  }

  const handleExport = async () => {
    setExporting(true)
    setBackupMessage('')
    try {
      const response = await axios.get('http://localhost:4001/settings/backup')
      const jsonData = JSON.stringify(response.data, null, 2)

      // Try Electron native dialog first, fallback to browser download
      if (window.ipcRenderer) {
        const result = await window.ipcRenderer.invoke('dialog-save-backup', jsonData)
        if (result.canceled) {
          setExporting(false)
          return
        }
        if (result.success) {
          setBackupMessage('Backup saved successfully.')
        } else {
          setBackupMessage(`Failed to save backup: ${result.error}`)
        }
      } else {
        const blob = new Blob([jsonData], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `nextlife-backup-${new Date().toISOString().slice(0, 10)}.json`
        a.click()
        URL.revokeObjectURL(url)
        setBackupMessage('Backup downloaded successfully.')
      }
    } catch (error) {
      console.log(error)
      setBackupMessage('Failed to create backup. Please try again.')
    }
    setExporting(false)
  }

  const handleImport = async () => {
    setImporting(true)
    setBackupMessage('')
    try {
      let jsonContent: string | null = null

      if (window.ipcRenderer) {
        const result = await window.ipcRenderer.invoke('dialog-open-backup')
        if (result.canceled) {
          setImporting(false)
          return
        }
        if (!result.success) {
          setBackupMessage(`Failed to read file: ${result.error}`)
          setImporting(false)
          return
        }
        jsonContent = result.content
      } else {
        jsonContent = await new Promise<string | null>((resolve) => {
          const input = document.createElement('input')
          input.type = 'file'
          input.accept = '.json'
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) { resolve(null); return }
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = () => resolve(null)
            reader.readAsText(file)
          }
          input.oncancel = () => resolve(null)
          input.click()
        })
      }

      if (!jsonContent) {
        setImporting(false)
        return
      }

      const backupData = JSON.parse(jsonContent)
      if (!backupData.data || backupData.status !== 'success') {
        setBackupMessage('Invalid backup file format.')
        setImporting(false)
        return
      }

      await axios.post('http://localhost:4001/settings/restore', backupData)
      setBackupMessage('Data restored successfully from backup.')
    } catch (error) {
      console.log(error)
      setBackupMessage('Failed to restore data. Please check the file and try again.')
    }
    setImporting(false)
  }

  return (
    <div className='min-h-[650px] bg-gray-100 rounded-lg backdrop-filter backdrop-blur-lg bg-opacity-40 p-6'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-10 h-10 rounded-xl bg-gray-200/70 flex items-center justify-center'>
          <SettingsIcon className='h-5 w-5 text-gray-600' />
        </div>
        <div>
          <h1 className='text-2xl font-extrabold text-gray-700'>Settings</h1>
          <p className='text-xs text-gray-400'>Manage your application preferences</p>
        </div>
      </div>

      {/* Backup & Restore */}
      <div className='bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6'>
        <div className='px-6 py-4 bg-blue-50/60 border-b border-blue-100'>
          <div className='flex items-center gap-2'>
            <HardDrive className='h-4 w-4 text-blue-500' />
            <h2 className='text-sm font-semibold text-blue-700 uppercase tracking-wide'>Backup & Restore</h2>
          </div>
        </div>

        <div className='p-6 space-y-5'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <h3 className='text-base font-semibold text-gray-800 mb-1'>Export Backup</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>
                Save all your data to a JSON file. You can use this file later to restore your data.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-blue-200 active:scale-[0.97] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'>
              <Download className='h-4 w-4' />
              {exporting ? 'Exporting...' : 'Export Data'}
            </button>
          </div>

          <div className='border-t border-gray-100' />

          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <h3 className='text-base font-semibold text-gray-800 mb-1'>Restore from Backup</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>
                Load a previously exported backup file to restore all your data. This will replace all current data.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  disabled={importing}
                  className='flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-amber-200 active:scale-[0.97] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'>
                  <Upload className='h-4 w-4' />
                  {importing ? 'Restoring...' : 'Restore Data'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className='max-w-sm rounded-2xl p-0 gap-0 border-0 shadow-2xl overflow-hidden'>
                <AlertDialogHeader className='p-6 pb-4 text-center sm:text-center'>
                  <div className='w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3'>
                    <Upload className='h-7 w-7 text-amber-500' />
                  </div>
                  <AlertDialogTitle className='text-lg font-bold text-gray-900'>
                    Restore from Backup?
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-sm text-gray-500 leading-relaxed mt-1'>
                    This will <span className='font-medium text-gray-700'>replace all current data</span> with the data from the backup file. Make sure you have exported a backup of your current data first.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex-row gap-3 px-6 pb-6 sm:justify-center'>
                  <AlertDialogAction
                    onClick={handleImport}
                    className='flex-1 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-sm'>
                    Yes, Restore Data
                  </AlertDialogAction>
                  <AlertDialogCancel className='flex-1 rounded-xl border-gray-200 hover:bg-gray-50 font-medium mt-0 sm:mt-0'>
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {backupMessage && (
            <div className={`flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl ${
              backupMessage.includes('successfully')
                ? 'text-green-700 bg-green-50 border border-green-100'
                : 'text-red-700 bg-red-50 border border-red-100'
            }`}>
              {backupMessage.includes('successfully')
                ? <CheckCircle2 className='h-4 w-4 shrink-0' />
                : <XCircle className='h-4 w-4 shrink-0' />
              }
              {backupMessage}
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className='bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm'>
        <div className='px-6 py-4 bg-red-50/60 border-b border-red-100'>
          <div className='flex items-center gap-2'>
            <TriangleAlert className='h-4 w-4 text-red-500' />
            <h2 className='text-sm font-semibold text-red-700 uppercase tracking-wide'>Danger Zone</h2>
          </div>
        </div>

        <div className='p-6'>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex-1'>
              <h3 className='text-base font-semibold text-gray-800 mb-1'>Reset All Data</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>
                Permanently delete all your data including networth, investments, trading, business, goals, and skills. This action cannot be undone.
              </p>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className='flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-red-200 active:scale-[0.97] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={resetting}>
                  <Trash2 className='h-4 w-4' />
                  {resetting ? 'Resetting...' : 'Reset All Data'}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className='max-w-sm rounded-2xl p-0 gap-0 border-0 shadow-2xl overflow-hidden'>
                <AlertDialogHeader className='p-6 pb-4 text-center sm:text-center'>
                  <div className='w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3'>
                    <TriangleAlert className='h-7 w-7 text-red-500' />
                  </div>
                  <AlertDialogTitle className='text-lg font-bold text-gray-900'>
                    Reset Everything?
                  </AlertDialogTitle>
                  <AlertDialogDescription className='text-sm text-gray-500 leading-relaxed mt-1'>
                    This will <span className='font-medium text-gray-700'>permanently delete</span> all your data including networth, investments, trading, business, goals, and skills.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex-row gap-3 px-6 pb-6 sm:justify-center'>
                  <AlertDialogAction
                    onClick={handleReset}
                    className='flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm'>
                    Yes, Reset Everything
                  </AlertDialogAction>
                  <AlertDialogCancel className='flex-1 rounded-xl border-gray-200 hover:bg-gray-50 font-medium mt-0 sm:mt-0'>
                    Cancel
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {message && (
            <div className={`mt-5 flex items-center gap-2 text-sm font-medium px-4 py-3 rounded-xl ${
              message.includes('success')
                ? 'text-green-700 bg-green-50 border border-green-100'
                : 'text-red-700 bg-red-50 border border-red-100'
            }`}>
              {message.includes('success')
                ? <CheckCircle2 className='h-4 w-4 shrink-0' />
                : <XCircle className='h-4 w-4 shrink-0' />
              }
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
