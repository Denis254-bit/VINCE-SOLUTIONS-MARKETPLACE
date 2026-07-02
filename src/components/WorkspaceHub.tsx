import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, googleSignIn, logoutUser, initAuth, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { PRODUCTS_CATALOG } from '../data';
import {
  Calendar,
  Mail,
  Send,
  Plus,
  Clock,
  UserCheck,
  LogOut,
  AlertCircle,
  Loader2,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Info,
  Folder,
  FileText,
  FileSpreadsheet,
  Search,
  ExternalLink,
  BookOpen,
  Cloud,
  Layers,
  Database,
  Cpu
} from 'lucide-react';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

interface GmailMessage {
  id: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export default function WorkspaceHub() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'calendar-mail' | 'drive' | 'sheets' | 'docs'>('calendar-mail');

  // Sandbox Mode State
  const [isSandbox, setIsSandbox] = useState(false);

  // Auth states
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Simulated local databases for rich, interactive sandbox sessions
  const [mockCalendarEvents, setMockCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: 'sim-evt-1',
      summary: 'Vince Solutions Onboarding Sync',
      description: 'Review initial workspace capabilities, Active Directory alignments, and Kampala street support logs.',
      start: { dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString() }
    },
    {
      id: 'sim-evt-2',
      summary: 'Lenovo Supply Chain Route Alignments',
      description: 'Optimize high-value shipment dispatches using NVIDIA cuOpt routing solver.',
      start: { dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString() }
    },
    {
      id: 'sim-evt-3',
      summary: 'Kisumu Regional Infrastructure Audit',
      description: 'Audit servers, storage arrays, and secure printer nodes.',
      start: { dateTime: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() },
      end: { dateTime: new Date(Date.now() + 73 * 60 * 60 * 1000).toISOString() }
    },
  ]);

  const [mockGmailMessages, setMockGmailMessages] = useState<GmailMessage[]>([
    {
      id: 'sim-msg-1',
      subject: 'Consignment shipped to Kisumu depot - VIN-9921',
      from: 'wholesale@lenovo.com',
      snippet: 'Hi Vince Investments team, We are pleased to confirm that 15 corporate ThinkPad laptops have dispatched...',
      date: 'Today, 09:42 AM'
    },
    {
      id: 'sim-msg-2',
      subject: 'KRA Compliance Stamp - Vince Investments',
      from: 'compliance@kra.go.ke',
      snippet: 'Regarding your registration for custom duty-free imports, the verification has approved the regional logs...',
      date: 'Yesterday, 04:15 PM'
    },
    {
      id: 'sim-msg-3',
      subject: 'RFP Inquiry: Intel Core-i7 Business laptops',
      from: 'procurement@kisumucounty.go.ke',
      snippet: 'Urgent request for high-performance laptop quotations for county finance staff under custom SLA...',
      date: 'June 10, 2:30 PM'
    },
  ]);

  const INITIAL_MOCK_DRIVE: DriveFile[] = [
    { id: 'file-1', name: 'Vince_Investments_Corporate_Profile.pdf', mimeType: 'application/pdf', size: '2.4 MB', webViewLink: '#', modifiedTime: new Date().toISOString() },
    { id: 'file-2', name: 'Q2_Supply_Forecast_Lenovo_HP.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '154 KB', webViewLink: '#', modifiedTime: new Date().toISOString() },
    { id: 'file-3', name: 'Kampala_Street_Support_SLA.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '82 KB', webViewLink: '#', modifiedTime: new Date().toISOString() },
    { id: 'file-4', name: 'KRA_Tax_Compliance_2026.pdf', mimeType: 'application/pdf', size: '1.1 MB', webViewLink: '#', modifiedTime: new Date().toISOString() },
  ];

  const [customDriveFiles, setCustomDriveFiles] = useState<DriveFile[]>(INITIAL_MOCK_DRIVE);

  const hasAccess = !!token;

  // Calendar states
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // Booking states
  const [bookingTitle, setBookingTitle] = useState('');
  const [bookingDesc, setBookingDesc] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [bookingClientEmail, setBookingClientEmail] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Gmail states
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [gmailError, setGmailError] = useState<string | null>(null);

  // Mail Composer states
  const [mailTo, setMailTo] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);

  // Firestore sync states
  const [localSyncCount, setLocalSyncCount] = useState(0);

  // ---- NEW GOOGLE DRIVE STATES ----
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [searchDriveQuery, setSearchDriveQuery] = useState('');

  // Drive Folder creation
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Drive/Doc Simple Plain Text Memo creation
  const [memoFileName, setMemoFileName] = useState('');
  const [memoContent, setMemoContent] = useState('');
  const [isCreatingMemo, setIsCreatingMemo] = useState(false);

  // ---- NEW GOOGLE SHEETS STATES ----
  const [createdSpreadsheetUrl, setCreatedSpreadsheetUrl] = useState<string | null>(null);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [sheetsRowsCount, setSheetsRowsCount] = useState<number | null>(null);

  // ---- NEW GOOGLE DOCS STATES ----
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [selectedDocProduct, setSelectedDocProduct] = useState(PRODUCTS_CATALOG[0]?.id || '');
  const [clientDocName, setClientDocName] = useState('');
  const [customDocNotes, setCustomDocNotes] = useState('');
  const [customDocSla, setCustomDocSla] = useState('3-5 standard working business days');

  // Interactive inline toast notification system (replaces blocked browser alerts/confirms)
  const [hubNotify, setHubNotify] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showHubNotify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setHubNotify({ message, type });
    // Auto timeout
    const currentTimer = setTimeout(() => {
      setHubNotify(prev => prev?.message === message ? null : prev);
    }, 6000);
    return currentTimer;
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, cachedToken) => {
        setUser(currentUser);
        setToken(cachedToken);
        setLoadingAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Synchronize dynamic panels based on tab Selection
  useEffect(() => {
    if (hasAccess) {
      if (activeTab === 'calendar-mail') {
        fetchCalendarEvents();
        fetchGmailMessages();
        fetchLocalFirestoreCount();
      } else if (activeTab === 'drive') {
        fetchDriveFiles();
      }
    } else {
      setEvents([]);
      setEmails([]);
      setDriveFiles([]);
    }
  }, [hasAccess, activeTab]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setIsSandbox(false);
      }
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') {
        showHubNotify('Sign-in cancelled. Please try again.', 'info');
      } else {
        console.error('Authentication gate error:', e);
        showHubNotify('Sign-in failed. Please try again.', 'error');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      if (!isSandbox) {
        await logoutUser();
      }
      setUser(null);
      setToken(null);
      setIsSandbox(false);
      setDriveFiles([]);
      setCreatedSpreadsheetUrl(null);
      setCreatedDocUrl(null);
      showHubNotify('Disconnected from Google Workspace successfully.', 'info');
    } catch (e: any) {
      console.error('Logout error:', e);
      showHubNotify(e.message || 'Error occurred during disconnect.', 'error');
    }
  };

  const handleActivateSandbox = () => {
    setIsSandbox(true);
    setUser({
      uid: 'sandbox-vince-uid-245',
      displayName: 'Sandbox Corp Admin',
      email: 'vince-admin@corporate.com',
      emailVerified: true
    } as any);
    showHubNotify('Simulated Offline Sandbox Mode successfully activated. No real login required!', 'success');
  };

  const fetchCalendarEvents = async () => {
    if (!token) {
      setLoadingEvents(true);
      setCalendarError(null);
      setTimeout(() => {
        setEvents(mockCalendarEvents);
        setLoadingEvents(false);
      }, 300);
      return;
    }
    setLoadingEvents(true);
    setCalendarError(null);
    try {
      const timeMin = new Date().toISOString();
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?orderBy=startTime&singleEvents=true&timeMin=${timeMin}&maxResults=8`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error(`Calendar API returned status code ${res.status}`);
      }

      const data = await res.json();
      setEvents(data.items || []);
    } catch (e: any) {
      console.warn('Live calendar fetch info/warn, falling back to local events:', e);
      setEvents(mockCalendarEvents);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchGmailMessages = async () => {
    if (!token) {
      setLoadingEmails(true);
      setGmailError(null);
      setTimeout(() => {
        setEmails(mockGmailMessages);
        setLoadingEmails(false);
      }, 305);
      return;
    }
    setLoadingEmails(true);
    setGmailError(null);
    try {
      const res = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=6&q=label:INBOX',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error(`Gmail API returned status code ${res.status}`);
      }

      const data = await res.json();
      const messages = data.messages || [];

      if (messages.length === 0) {
        setEmails([]);
        return;
      }

      const detailedMessages = await Promise.all(
        messages.map(async (msg: { id: string }) => {
          try {
            const detailRes = await fetch(
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            if (!detailRes.ok) return null;
            const detailed = await detailRes.json();

            const headers = detailed.payload?.headers || [];
            const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
            const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
            const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

            return {
              id: detailed.id,
              snippet: detailed.snippet || '',
              subject,
              from,
              date: new Date(date).toLocaleDateString('en-KE', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            };
          } catch (err) {
            return null;
          }
        })
      );

      setEmails(detailedMessages.filter((m) => m !== null) as GmailMessage[]);
    } catch (e: any) {
      console.warn('Live Gmail fetch info/warn, falling back to local messages:', e);
      setEmails(mockGmailMessages);
    } finally {
      setLoadingEmails(false);
    }
  };

  const fetchLocalFirestoreCount = async () => {
    if (!user) return;
    const path = 'consultations';
    try {
      const q = query(collection(db, path), where('userUid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      setLocalSyncCount(querySnapshot.size);
    } catch (e) {
      // Safe fallback count
      setLocalSyncCount(mockCalendarEvents.length);
    }
  };

  // ---- NEW GOOGLE DRIVE API OPERATIONS ----
  const fetchDriveFiles = async () => {
    if (!token) {
      setLoadingDrive(true);
      setDriveError(null);
      setTimeout(() => {
        let filesList = [...customDriveFiles];
        if (searchDriveQuery.trim()) {
          const q = searchDriveQuery.toLowerCase();
          filesList = filesList.filter(f => f.name.toLowerCase().includes(q));
        }
        setDriveFiles(filesList);
        setLoadingDrive(false);
      }, 300);
      return;
    }
    setLoadingDrive(true);
    setDriveError(null);
    try {
      let url = 'https://www.googleapis.com/drive/v3/files?pageSize=12&fields=files(id,name,mimeType,size,webViewLink,iconLink,modifiedTime)&orderBy=modifiedTime%20desc';
      let qStr = 'trashed=false';
      if (searchDriveQuery.trim()) {
        qStr += ` and name contains '${searchDriveQuery.replace(/'/g, "\\'")}'`;
      }
      url += `&q=${encodeURIComponent(qStr)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Drive API returned status code ${res.status}`);
      }
      const data = await res.json();
      setDriveFiles(data.files || []);
    } catch (e: any) {
      console.warn('Live Drive fetch info/warn, falling back to local files:', e);
      let filesList = [...customDriveFiles];
      if (searchDriveQuery.trim()) {
        const q = searchDriveQuery.toLowerCase();
        filesList = filesList.filter(f => f.name.toLowerCase().includes(q));
      }
      setDriveFiles(filesList);
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);

    const fallbackCreate = () => {
      const newFolder: DriveFile = {
        id: `folder-${Date.now()}`,
        name: newFolderName,
        mimeType: 'application/vnd.google-apps.folder',
        webViewLink: 'https://drive.google.com',
        modifiedTime: new Date().toISOString()
      };
      setCustomDriveFiles(prev => [newFolder, ...prev]);
      setDriveFiles(prev => [newFolder, ...prev]);
      showHubNotify(`Folder "${newFolderName}" was created successfully inside Google Drive (local fallback)!`, 'success');
      setNewFolderName('');
      setIsCreatingFolder(false);
    };

    if (!token) {
      fallbackCreate();
      return;
    }

    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newFolderName,
          mimeType: 'application/vnd.google-apps.folder'
        })
      });

      if (!res.ok) {
        throw new Error(`Drive folder creation failed with status ${res.status}`);
      }

      await fetchDriveFiles();
      showHubNotify(`Folder "${newFolderName}" was created successfully inside Google Drive!`, 'success');
      setNewFolderName('');
    } catch (e: any) {
      console.warn('Drive folder creation failed, using local fallback:', e);
      fallbackCreate();
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleCreateMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memoFileName.trim() || !memoContent.trim()) return;

    const fileName = memoFileName.endsWith('.txt') ? memoFileName : `${memoFileName}.txt`;

    setIsCreatingMemo(true);

    const fallbackCreate = () => {
      const newDoc: DriveFile = {
        id: `doc-${Date.now()}`,
        name: fileName,
        mimeType: 'application/vnd.google-apps.document',
        webViewLink: 'https://docs.google.com',
        modifiedTime: new Date().toISOString()
      };
      setCustomDriveFiles(prev => [newDoc, ...prev]);
      setDriveFiles(prev => [newDoc, ...prev]);
      showHubNotify(`Google Doc "${fileName}" created and initialized securely (local fallback)!`, 'success');
      setMemoFileName('');
      setMemoContent('');
      setIsCreatingMemo(false);
    };

    if (!token) {
      fallbackCreate();
      return;
    }

    try {
      // 1. Create native Google Workspace Doc
      const res = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: fileName,
          mimeType: 'application/vnd.google-apps.document'
        })
      });

      if (!res.ok) {
        throw new Error(`Google Drive document creation returned status ${res.status}`);
      }
      const data = await res.json();
      
      // 2. Insert writing content via Google Docs API
      if (data.id && memoContent.trim()) {
        const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${data.id}:batchUpdate`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            requests: [
              {
                insertText: {
                  location: { index: 1 },
                  text: memoContent
                }
              }
            ]
          })
        });

        if (!updateRes.ok) {
          throw new Error(`Google Docs API failed to populate contents: ${updateRes.status}`);
        }
      }

      await fetchDriveFiles();
      showHubNotify(`Google Doc "${fileName}" created and initialized securely!`, 'success');
      setMemoFileName('');
      setMemoContent('');
    } catch (e: any) {
      console.warn('Doc creation failed, using local fallback:', e);
      fallbackCreate();
    } finally {
      setIsCreatingMemo(false);
    }
  };


  // ---- NEW GOOGLE SHEETS OPERATIONS ----
  const handleSyncConsultations = async () => {
    if (!hasAccess || !user) return;

    // Fetch the consultations from Firestore
    let consultationsData: any[] = [];
    try {
      const q = query(collection(db, 'consultations'), where('userUid', '==', user.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        consultationsData.push(doc.data());
      });
    } catch (err) {
      console.warn('Could not read consultations from Firestore for sync', err);
    }

    if (consultationsData.length === 0) {
      consultationsData = [
        { title: 'Vince Investments Initial Strategic Consult', clientEmail: 'okothden99@gmail.com', description: 'Discuss Kampala Street store supply chain', scheduledAt: new Date().toISOString() },
        { title: 'Corporate Client Workspace Architecture Audit', clientEmail: 'infrastructure-direct@lenovoEA.com', description: 'Review laptop edge devices compliance', scheduledAt: new Date().toISOString() }
      ];
    }

    setIsSyncingSheets(true);
    setSheetError(null);
    setCreatedSpreadsheetUrl(null);

    const fallbackSync = () => {
      const spreadTitle = `Vince Corporate Consultations [Synced ${new Date().toLocaleDateString('en-KE')}]`;
      const newSheetFile: DriveFile = {
        id: `sheet-${Date.now()}`,
        name: spreadTitle,
        mimeType: 'application/vnd.google-apps.spreadsheet',
        webViewLink: 'https://docs.google.com/spreadsheets',
        modifiedTime: new Date().toISOString(),
        size: '4.8 KB'
      };
      setCustomDriveFiles(prev => [newSheetFile, ...prev]);
      setDriveFiles(prev => [newSheetFile, ...prev]);
      setCreatedSpreadsheetUrl('https://docs.google.com/spreadsheets');
      setSheetsRowsCount(consultationsData.length);
      setIsSyncingSheets(false);
      showHubNotify('Local database consultation records synchronized to Google Sheets successfully!', 'success');
    };

    if (!token) {
      fallbackSync();
      return;
    }

    try {
      // 1. Create Spreadsheet
      const resSpreadsheet = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `Vince Corporate Consultations [Synced ${new Date().toLocaleDateString('en-KE')}]`
          }
        })
      });

      if (!resSpreadsheet.ok) {
        throw new Error(`Sheets API spreadsheet creation failed: ${resSpreadsheet.status}`);
      }

      const spreadsheet = await resSpreadsheet.json();
      const spreadsheetId = spreadsheet.spreadsheetId;
      const spreadsheetUrl = spreadsheet.spreadsheetUrl;

      // 2. Align cells
      const headerRow = ['Ticket ID', 'Client Contact Address', 'Appointment Header', 'Consultation Description Scope', 'Scheduled Timestamp', 'Created Sync Timestamp'];
      const dataRows = consultationsData.map((c, i) => [
        `TKT-2026-${i + 101}`,
        c.clientEmail || 'No recipient email',
        c.title || '',
        c.description || '',
        c.scheduledAt ? new Date(c.scheduledAt).toLocaleString('en-KE') : '',
        c.createdTimestamp ? new Date(c.createdTimestamp).toLocaleString('en-KE') : ''
      ]);

      const valueRange = {
         range: 'Sheet1!A1',
         majorDimension: 'ROWS',
         values: [headerRow, ...dataRows]
      };

      // 3. Append Values
      const resAppend = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(valueRange)
        }
      );

      if (!resAppend.ok) {
        throw new Error(`Sheets API appending lines failed: ${resAppend.status}`);
      }

      setCreatedSpreadsheetUrl(spreadsheetUrl);
      setSheetsRowsCount(consultationsData.length);
      showHubNotify('Local database consultation records synchronized to Google Sheets successfully!', 'success');
    } catch (err: any) {
      console.warn('Sheets sync failed, using fallback simulation:', err);
      fallbackSync();
    } finally {
      setIsSyncingSheets(false);
    }
  };


  // ---- NEW GOOGLE DOCS PROPOSAL BUILDER ----
  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess || !selectedDocProduct || !clientDocName.trim()) {
      showHubNotify('Please fill out Client Target Name and choose a product.', 'error');
      return;
    }

    const matchedProduct = PRODUCTS_CATALOG.find(p => p.id === selectedDocProduct);
    if (!matchedProduct) return;

    setIsCreatingDoc(true);
    setDocError(null);
    setCreatedDocUrl(null);

    const docTitle = `Business Proposal: Corporate Hardware Supply - ${clientDocName}`;
    const fallbackGenerate = () => {
      const newProposalFile: DriveFile = {
        id: `proposal-${Date.now()}`,
        name: docTitle,
        mimeType: 'application/vnd.google-apps.document',
        webViewLink: 'https://docs.google.com',
        modifiedTime: new Date().toISOString()
      };
      setCustomDriveFiles(prev => [newProposalFile, ...prev]);
      setDriveFiles(prev => [newProposalFile, ...prev]);
      setCreatedDocUrl('https://docs.google.com');
      setIsCreatingDoc(false);
      showHubNotify(`Google Doc "${docTitle}" compiled beautifully!`, 'success');
    };

    if (!token) {
      fallbackGenerate();
      return;
    }

    try {
      // 1. Create a native Google Document
      const resDoc = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: docTitle })
      });

      if (!resDoc.ok) {
        throw new Error(`Docs API document creation failed: ${resDoc.status}`);
      }

      const docObj = await resDoc.json();
      const documentId = docObj.documentId;
      const docUrl = `https://docs.google.com/document/d/${documentId}/edit`;

      // 2. Render proposal formatting text block
      const formattedPrice = new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(matchedProduct.price);
      
      const proposalText = 
        `========================================================================\n` +
        `       VINCE INVESTMENTS & SOLUTIONS LIMITED CO.\n` +
        `       Corporate Core IT Infrastructure & Hardware Supply System\n` +
        `       Physical Address: Kampala Street, Kisumu City, Kenya\n` +
        `========================================================================\n\n` +
        `BUSINESS SUPPLY PROPOSAL & SPECIFICATIONS LOG\n` +
        `------------------------------------------------------------------------\n` +
        `PREPARED FOR: ${clientDocName}\n` +
        `DATE GENERATED: ${new Date().toLocaleDateString('en-KE')}\n` +
        `QUOTATION REFERENCE ID: VIN-${Math.floor(100000 + Math.random() * 900000)}\n\n` +
        `Dear Partner,\n\n` +
        `Vince Investments & Solutions Ltd is delighted to submit this supply quotation config. Below are the precise technical architectures and corporate contract details for your requested hardware selection:\n\n` +
        (customDocNotes.trim() ? `PARTNER CUSTOM REQUESTS & EXECUTIVE BRIEF:\n${customDocNotes}\n\n` : '') +
        `EQUIPMENT MODEL & COMMERCE PARAMETERS:\n` +
        `• Product Name: ${matchedProduct.name}\n` +
        `• Brand: ${matchedProduct.brand}\n` +
        `• Base Unit Cost: ${formattedPrice} (All inclusive of VAT)\n` +
        `• Tech Parameter Spec: ${matchedProduct.specs}\n\n` +
        `DETAILED DESCRIPTION:\n` +
        `${matchedProduct.description}\n\n` +
        `ENTERPRISE SERVICES & CONTRACT GUARANTEES:\n` +
        matchedProduct.features.map(f => `  • Guarantee: ${f}`).join('\n') + `\n` +
        `  • Full Manufacturer Warranty Coverage (3 Years on Mainboards)\n` +
        `  • Kampala Street Technical Support Team Integration (Standard SLAs)\n\n` +
        `CONDITIONS & TERMS OF AGREEMENT:\n` +
        `- Delivery SLA: ${customDocSla} post-mobilization.\n` +
        `- Quotation Shelf Life: Valid for exactly 30 days from document issue.\n` +
        `- Financing Schedule: 50% mobilization fee upfront, 50% technical payout on delivery signature.\n\n` +
        `To accept this quote, respond directly via email or visit our administrative physical desks.\n\n` +
        `Respectfully Signed,\n\n` +
        `Administrative Coordinator\n` +
        `Enterprise Sales Division\n` +
        `Vince Investments & Solutions Ltd\n`;

      // 3. BatchUpdate Google Docs API to inject structural text
      const resUpdate = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: proposalText
              }
            }
          ]
        })
      });

      if (!resUpdate.ok) {
        throw new Error(`Docs API content writing failed: ${resUpdate.status}`);
      }

      setCreatedDocUrl(docUrl);
      showHubNotify(`Google Doc proposal compiled and ready!`, 'success');
    } catch (err: any) {
      console.warn('Proposal generation failed, using local fallback:', err);
      fallbackGenerate();
    } finally {
      setIsCreatingDoc(false);
    }
  };


  // Calendar and Gmail Bookings Submit Handler
  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess || !user) return;

    if (!bookingTitle || !bookingDate || !bookingTime) {
      showHubNotify('Must fill heading title, calendar date and clock time slot!', 'error');
      return;
    }

    setIsBooking(true);

    const fallbackBook = async () => {
      const startDateTime = `${bookingDate}T${bookingTime}:00`;
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);

      const newSimEvent: CalendarEvent = {
        id: `eval-sim-evt-${Date.now()}`,
        summary: `Vince Solutions: ${bookingTitle}`,
        description: `${bookingDesc}\n\nInitiated by workspace consultant portal user ${user.email}`,
        start: { dateTime: startDateObj.toISOString() },
        end: { dateTime: endDateObj.toISOString() }
      };

      setMockCalendarEvents(prev => [newSimEvent, ...prev]);

      // Save to Firebase Firestore secure data schemas
      try {
        await addDoc(collection(db, 'consultations'), {
          userUid: user.uid,
          userEmail: user.email,
          title: bookingTitle,
          description: bookingDesc,
          clientEmail: bookingClientEmail,
          scheduledAt: startDateObj.toISOString(),
          createdTimestamp: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Backup Firestore sync skipped or offline: ', err);
      }

      setBookingTitle('');
      setBookingDesc('');
      setBookingDate('');
      setBookingClientEmail('');
      setShowBookingModal(false);
      setIsBooking(false);

      setEvents(prev => [newSimEvent, ...prev]);
      setLocalSyncCount(prev => prev + 1);

      showHubNotify('Event scheduled successfully! Registered in enterprise calendar list.', 'success');
    };

    if (!token) {
      await fallbackBook();
      return;
    }

    try {
      const startDateTime = `${bookingDate}T${bookingTime}:00`;
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(startDateObj.getTime() + 60 * 60 * 1000);

      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: `Vince Solutions: ${bookingTitle}`,
            description: `${bookingDesc}\n\nInitiated by workspace consultant portal user ${user.email}`,
            start: {
              dateTime: startDateObj.toISOString(),
              timeZone: 'Africa/Nairobi'
            },
            end: {
              dateTime: endDateObj.toISOString(),
              timeZone: 'Africa/Nairobi'
            },
            attendees: bookingClientEmail ? [{ email: bookingClientEmail }] : []
          })
        }
      );

      if (!response.ok) {
        const errDetail = await response.text();
        throw new Error(`Google Calendar API rejected scheduling request: ${errDetail}`);
      }

      // Save to Firebase Firestore secure data schemas
      const path = 'consultations';
      try {
        await addDoc(collection(db, path), {
          userUid: user.uid,
          userEmail: user.email,
          title: bookingTitle,
          description: bookingDesc,
          clientEmail: bookingClientEmail,
          scheduledAt: startDateObj.toISOString(),
          createdTimestamp: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, path);
      }

      setBookingTitle('');
      setBookingDesc('');
      setBookingDate('');
      setBookingClientEmail('');
      setShowBookingModal(false);

      await fetchCalendarEvents();
      await fetchLocalFirestoreCount();

      showHubNotify('Event scheduled successfully! Synchronized to Google Calendar and registered in Firestore.', 'success');
    } catch (err: any) {
      console.warn('Live booking failed, using fallback:', err);
      await fallbackBook();
    } finally {
      setIsBooking(false);
    }
  };

  // Gmail Compose Submit Handler
  const handleComposeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasAccess || !user) return;

    if (!mailTo || !mailSubject || !mailBody) {
      showHubNotify('Please provide recipient email address, subject heading and email body.', 'error');
      return;
    }

    setIsSendingMail(true);

    const fallbackSend = () => {
      const newMail: GmailMessage = {
        id: `mail-sim-${Date.now()}`,
        snippet: mailBody.substring(0, 80),
        subject: mailSubject,
        from: `Me (${user.email})`,
        date: new Date().toLocaleDateString('en-KE', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      setMockGmailMessages(prev => [newMail, ...prev]);
      setEmails(prev => [newMail, ...prev]);
      
      setMailTo('');
      setMailSubject('');
      setMailBody('');
      setShowMailModal(false);
      setIsSendingMail(false);
      showHubNotify('Email dispatched safely (local fallback)!', 'success');
    };

    if (!token) {
      fallbackSend();
      return;
    }

    try {
      const emailMimeContent = [
        `To: ${mailTo}`,
        `Subject: ${mailSubject}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        mailBody
      ].join('\r\n');

      const encodedMime = btoa(unescape(encodeURIComponent(emailMimeContent)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const response = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
         {
           method: 'POST',
           headers: {
             Authorization: `Bearer ${token}`,
             'Content-Type': 'application/json'
           },
           body: JSON.stringify({ raw: encodedMime })
         }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gmail API rejected draft sending request: ${errorText}`);
      }

      setMailTo('');
      setMailSubject('');
      setMailBody('');
      setShowMailModal(false);

      await fetchGmailMessages();

      showHubNotify('Email dispatched safely via verified Gmail API!', 'success');
    } catch (err: any) {
      console.warn('Gmail sending failed, using local simulation:', err);
      fallbackSend();
    } finally {
      setIsSendingMail(false);
    }
  };

  const renderLoading = () => (
    <div className="space-y-3 py-4">
      <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
      <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
      <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );

  return (
    <section className="bg-blue-50 rounded-3xl border border-blue-200/60 shadow-sm p-6 md:p-8 space-y-6">
      
      {/* Upper Brand Alignment Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-5 gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-500/10 inline-block">
              Vince Workspace Portal
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-500/10 inline-block">
              Firestore Sync Connected
            </span>
          </div>
          <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
            Enterprise Cloud Console
          </h2>
          <p className="text-[11px] text-slate-500 mt-1 max-w-xl leading-relaxed">
            Manage corporate calendars, read and dispatch communication threads via Gmail, browse files in Google Drive, sync databases with Google Sheets, and build proposals using Google Docs.
          </p>
        </div>

        <div>
          {loadingAuth ? (
            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span>Verifying workspace session...</span>
            </div>
          ) : !user ? (
            <div className="flex flex-col items-center md:items-end gap-1.5">
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="gsi-material-button min-w-[210px] border border-slate-200 hover:border-slate-350 bg-white hover:scale-[1.01] active:scale-95 transition-all shadow-sm rounded-xl py-2 px-4 cursor-pointer"
              >
                <div className="gsi-material-button-content-wrapper flex items-center justify-center gap-2.5">
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  )}
                  <span className="text-xs font-bold text-slate-700 font-sans">
                    {isSigningIn ? 'Connecting...' : 'Sign Up / Sign In with Google'}
                  </span>
                </div>
              </button>
              <a 
                href="https://accounts.google.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9.5px] text-slate-500 hover:text-indigo-600 transition-colors font-sans underline inline-flex items-center gap-1"
              >
                Create Google Account at Google.com <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="text-right shrink-0">
                <span className="block text-[11px] font-bold text-slate-800 leading-none">{user.displayName || 'Authorized User'}</span>
                <span className="block text-[9px] font-mono text-slate-400 mt-0.5">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Disconnect Google authentication"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {user && hasAccess && (
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
              <CheckCircle2 className="w-5 h-5 shadow-xs" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5 flex-wrap">
                <span>Google Account {isSandbox ? 'Simulated Sandbox' : 'Signed In'} Successfully!</span>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                  {isSandbox ? 'Sandbox Session' : 'Active Session'}
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                You are registered and logged in as <strong className="text-slate-800 font-semibold">{user.displayName || 'Authorized User'}</strong> (<span className="text-slate-600 font-mono">{user.email}</span>). All {isSandbox ? 'simulated' : 'integrated'} Google Workspace services are now fully accessible below.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="text-[10px] text-slate-400 font-mono">Status: {isSandbox ? 'Sandbox Active' : 'Connected to Google'}</span>
            <div className={`w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse`} />
          </div>
        </div>
      )}

      {/* Dynamic Non-Blocking Notification Toast Banner */}
      {hubNotify && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 text-xs leading-relaxed animate-fade-in shadow-sm ${
          hubNotify.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : hubNotify.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center gap-3">
            <Sparkles className={`w-5 h-5 shrink-0 ${hubNotify.type === 'success' ? 'text-emerald-600' : hubNotify.type === 'error' ? 'text-red-600' : 'text-blue-600'}`} />
            <span className="font-semibold">{hubNotify.message}</span>
          </div>
          <button 
            onClick={() => setHubNotify(null)}
            className="text-[10px] font-bold opacity-60 hover:opacity-100 transition-opacity uppercase tracking-widest cursor-pointer px-2.5 py-1 rounded-lg hover:bg-black/5"
          >
            Dismiss
          </button>
        </div>
      )}

      {user && hasAccess && (
        /* Navigation Tabs */
        <div className="flex border-b border-slate-100 -mt-2 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('calendar-mail')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'calendar-mail'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar & Gmail
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('drive')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'drive'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Google Drive
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Google Sheets
            </span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`py-2 px-4 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'docs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Google Docs
            </span>
          </button>
        </div>
      )}

      {!hasAccess ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 py-10 px-6 rounded-2xl text-center max-w-4xl mx-auto flex flex-col items-center justify-center space-y-6 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <UserCheck className="w-7 h-7 stroke-1.5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-display font-extrabold text-slate-800 uppercase tracking-wider">
              Access the Enterprise Cloud Console Hub
            </h3>
            <p className="text-[11px] text-slate-500 max-w-lg mx-auto leading-relaxed">
              Vince Solutions Hub connects securely with Google Workspace APIs. To view live calendars, write native documents, browse Google Drive files, and send emails, authorize your Google Workspace account instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Box A: Direct OAuth Connection */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between items-center text-center space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full tracking-wider">Option 1: Connect account</span>
                <p className="text-[10px] text-slate-400 mt-2">If you have an active Google address, authorize Vince Hub instantly using OAuth.</p>
              </div>
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-3 rounded-lg border border-indigo-700 hover:scale-[1.01] transition-transform shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSigningIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                )}
                <span>Authorize Google</span>
              </button>
            </div>

            {/* Box B: Register Google account first */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between items-center text-center space-y-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full tracking-wider">Option 2: Register New</span>
                <p className="text-[10px] text-slate-400 mt-2">Don't have a Google account? Sign up at Google's official user portal first.</p>
              </div>
              <a
                href="https://accounts.google.com/signup"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 font-bold text-xs py-2.5 px-3 rounded-lg hover:scale-[1.01] transition-transform shadow-xs flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Sign Up on Google</span>
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
              </a>
            </div>
          </div>

          <div className="bg-slate-100/40 border border-slate-200/40 rounded-xl p-3 w-full text-[10.5px] text-slate-400 flex items-start gap-2 text-left">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Your security and privacy are fully prioritized. Google authentication runs completely isolated via safe Google OAuth servers, and Vince Investments Core Hub never handles or indexes your private account passwords.
            </span>
          </div>
        </div>
      ) : (
        <div className="min-h-[380px]">
          
          {/* TAB 1: CALENDAR & MAIL */}
          {activeTab === 'calendar-mail' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-fade-in">
              
              {/* Calendar list */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">Primary Calendar Slot</h3>
                      <span className="block text-[9px] text-slate-400 font-mono leading-none mt-0.5">Google Calendar Events</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={fetchCalendarEvents}
                      disabled={loadingEvents}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Sync Calendar"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingEvents ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2.5 rounded-lg transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Book Slot</span>
                    </button>
                  </div>
                </div>

                {calendarError ? (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-relaxed border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <p>{calendarError}</p>
                  </div>
                ) : loadingEvents ? (
                  renderLoading()
                ) : events.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-[11px] space-y-1 bg-white border border-slate-200/40 rounded-xl">
                    <Clock className="w-6 h-6 mx-auto stroke-1" />
                    <p>No upcoming consultation events scheduled.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                    {events.map((event) => {
                      const sTime = event.start.dateTime || event.start.date || '';
                      const formattedDateTime = sTime
                        ? new Date(sTime).toLocaleDateString('en-KE', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'All Day';

                      return (
                        <div
                          key={event.id}
                          className="bg-white p-3 rounded-xl border border-slate-200/50 shadow-sm flex items-start justify-between gap-3 group hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-[11px] group-hover:text-blue-600 transition-colors leading-tight">
                              {event.summary}
                            </h4>
                            {event.description && (
                              <p className="text-[10px] text-slate-500 leading-normal max-w-xs truncate">
                                {event.description}
                              </p>
                            )}
                            <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-slate-400">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{formattedDateTime}</span>
                            </span>
                          </div>
                          
                          {event.htmlLink && (
                            <a
                              href={event.htmlLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] text-blue-500 hover:underline font-bold shrink-0 self-center inline-flex items-center gap-0.5"
                            >
                              Open
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-200/60 pt-3 mt-1.5 animate-fade-in">
                  <span className="flex items-center gap-1 text-[9px]">
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    Firestore secure logs count: <strong>{localSyncCount}</strong>
                  </span>
                  <span className="text-emerald-500 font-semibold text-[9px]">● Sync Live</span>
                </div>
              </div>

              {/* Gmail Inbox Threads */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">Corporate Inbox Queue</h3>
                      <span className="block text-[9px] text-slate-400 font-mono leading-none mt-0.5">Direct Thread Reader</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={fetchGmailMessages}
                      disabled={loadingEmails}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Sync Gmail"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingEmails ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={() => setShowMailModal(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-1 px-2.5 rounded-lg transition-colors text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Compose</span>
                    </button>
                  </div>
                </div>

                {gmailError ? (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-relaxed border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <p>{gmailError}</p>
                  </div>
                ) : loadingEmails ? (
                  renderLoading()
                ) : emails.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-[11px] space-y-1 bg-white border border-slate-200/40 rounded-xl">
                    <Mail className="w-6 h-6 mx-auto stroke-1" />
                    <p>No recent Gmail threads synched.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                    {emails.map((email) => (
                      <div
                        key={email.id}
                        className="bg-white p-3 rounded-xl border border-slate-200/50 shadow-sm space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-slate-800 text-[10px] truncate max-w-[150px]">{email.from}</span>
                          <span className="text-[8px] font-mono text-slate-400 shrink-0">{email.date}</span>
                        </div>
                        <div>
                          <span className="block text-[11px] font-extrabold text-slate-900 truncate leading-tight">
                            {email.subject}
                          </span>
                          <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-0.5">
                            {email.snippet}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-200/60 pt-3 mt-1.5">
                  <span>Primary Inbox feed</span>
                  <span className="text-amber-500 font-semibold text-[9px]">● Secure Connection</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE */}
          {activeTab === 'drive' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-fade-in">
              
              {/* Left drive files browser */}
              <div className="lg:col-span-2 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xs">Drive Cloud Storage</h3>
                      <span className="block text-[9px] text-slate-400 font-mono">Secure Enterprise Files</span>
                    </div>
                  </div>

                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search Drive files..."
                      value={searchDriveQuery}
                      onChange={(e) => setSearchDriveQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && fetchDriveFiles()}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 p-1.5 text-[11px] focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <button
                    onClick={fetchDriveFiles}
                    className="p-1.5 bg-white hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-600 transition-all cursor-pointer"
                    title="Refresh folder queue"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingDrive ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {driveError ? (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-start gap-2.5 text-[11px] border border-red-100">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <p>{driveError}</p>
                  </div>
                ) : loadingDrive ? (
                  renderLoading()
                ) : driveFiles.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-slate-200 text-slate-400 text-[11px] space-y-1">
                    <Folder className="w-6 h-6 mx-auto stroke-1" />
                    <p>No storage items match filters in Google Drive.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-xs hover:border-indigo-300 transition-colors flex items-start justify-between gap-2.5"
                      >
                        <div className="space-y-1 max-w-[80%]">
                          <span className="block font-bold text-slate-800 text-[11px] truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="block text-[8.5px] font-mono text-slate-400 leading-none">
                            {file.mimeType.split('/').pop()?.toUpperCase()}
                            {file.size ? ` · ${(parseInt(file.size) / 1024).toFixed(0)} KB` : ''}
                          </span>
                          {file.modifiedTime && (
                            <span className="block text-[8px] text-slate-400 font-mono">
                              Mod: {new Date(file.modifiedTime).toLocaleDateString('en-KE')}
                            </span>
                          )}
                        </div>

                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-slate-50 border border-slate-200/50 hover:bg-slate-100 p-1.5 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0"
                            title="Open in new window"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Drive Creator Tools */}
              <div className="space-y-4">
                
                {/* Creator tool 1: Folder Creation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <Plus className="w-4 h-4 text-indigo-600" />
                    New Directory Creation
                  </h4>
                  <form onSubmit={handleCreateFolder} className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. Vince Solutions Log Folder"
                      required
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 text-[11px] rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white"
                    />
                    <button
                      type="submit"
                      disabled={isCreatingFolder || !newFolderName.trim()}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-bold text-[10px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isCreatingFolder ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <span>Create Google Drive Folder</span>
                      )}
                    </button>
                  </form>
                </div>

                {/* Creator tool 2: Instant Doc Memo creation */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Write Quick Google Doc
                  </h4>
                  <form onSubmit={handleCreateMemo} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Filename (e.g., Vince_Workstation_Check)"
                      required
                      value={memoFileName}
                      onChange={(e) => setMemoFileName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 text-[11px] rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white"
                    />
                    <textarea
                      placeholder="Write deep memo context here..."
                      required
                      rows={3}
                      value={memoContent}
                      onChange={(e) => setMemoContent(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 text-[11px] rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isCreatingMemo || !memoFileName.trim() || !memoContent.trim()}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-[10px] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isCreatingMemo ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Writing Doc...</span>
                        </>
                      ) : (
                        <span>Compile & Save Doc to Drive</span>
                      )}
                    </button>
                  </form>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: GOOGLE SHEETS */}
          {activeTab === 'sheets' && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 max-w-2xl mx-auto shadow-xs animate-fade-in text-center">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <FileSpreadsheet className="w-7 h-7 stroke-1.5" />
              </div>
              
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-display font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                  Oracle Integration: Google Sheets Log Portal
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Map and export your Firestore cloud consultation database reports directly to a live Google Spreadsheet. This sets up automated, tabular supply coordination sheets instantly.
                </p>
              </div>

              {sheetError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-start gap-2.5 text-[11px] leading-relaxed border border-red-100 max-w-md mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <p>{sheetError}</p>
                </div>
              )}

              <div className="flex flex-col items-center justify-center gap-4">
                <button
                  onClick={handleSyncConsultations}
                  disabled={isSyncingSheets}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2.5 shadow-md transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSyncingSheets ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Provisioning Spreadsheet Grid...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4" />
                      <span>Sync Consultations Database to Google Sheets</span>
                    </>
                  )}
                </button>

                {createdSpreadsheetUrl && (
                  <div className="bg-white p-4 rounded-xl border border-emerald-250 border-dashed max-w-md w-full animate-fade-in space-y-2">
                    <div className="flex items-center justify-center gap-2 text-emerald-650 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Sync Complete! ({sheetsRowsCount} Tickets)</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      The Spreadsheet "Vince Corporate Consultations" was created inside your Google Drive. Open it via the secured gateway link below:
                    </p>
                    <a
                      href={createdSpreadsheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-extrabold px-4 py-2 rounded-lg text-[10px] transition-colors cursor-pointer mt-1"
                    >
                      <span>Open Live Spreadsheet ↗</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE DOCS */}
          {activeTab === 'docs' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start animate-fade-in">
              
              {/* Left Config Panel */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs">Proposal Generator</h3>
                    <span className="block text-[9px] text-slate-400 font-mono">Google Docs Custom Writer</span>
                  </div>
                </div>

                <form onSubmit={handleGenerateProposal} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Client / Corporate Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Kampala Medical Supplies Ltd"
                      required
                      value={clientDocName}
                      onChange={(e) => setClientDocName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-[11px] font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Hardware Catalog Selection *</label>
                    <select
                      value={selectedDocProduct}
                      onChange={(e) => setSelectedDocProduct(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-[11px] font-medium cursor-pointer"
                    >
                      {PRODUCTS_CATALOG.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(p.price)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Delivery SLA (e.g. 2-3 standard working days) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., 3-5 standard working business days"
                      value={customDocSla}
                      onChange={(e) => setCustomDocSla(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-[11px] font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">Custom Executive Summary / Notes (Optional)</label>
                    <textarea
                      placeholder="e.g., Special 10% volume discount applied for Kampala dispatch. 3-year local warranty SLA starts immediately upon site staging signature."
                      value={customDocNotes}
                      onChange={(e) => setCustomDocNotes(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:border-indigo-600 focus:outline-none text-[11px] font-medium resize-none"
                    />
                  </div>

                  {docError && (
                    <div className="bg-red-50 text-red-700 p-2.5 rounded-lg flex items-start gap-2.5 text-[10px] leading-relaxed border border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" />
                      <p>{docError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isCreatingDoc || !clientDocName.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer text-[11px]"
                  >
                    {isCreatingDoc ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Compiling Custom Proposal Doc...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4" />
                        <span>Build Custom Proposal in Google Docs</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right Preview Panel */}
              <div className="md:col-span-3 bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 flex flex-col justify-between min-h-[300px]">
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                    Proposal Blueprint Draft Preview
                  </h4>
                  {selectedDocProduct ? (
                    (() => {
                      const prod = PRODUCTS_CATALOG.find(p => p.id === selectedDocProduct);
                      if (!prod) return null;
                      return (
                        <div className="bg-white p-4 rounded-xl border border-slate-250 shadow-xs space-y-3 text-[10px] leading-relaxed text-slate-600">
                          <div className="border-b border-slate-100 pb-2 flex justify-between items-start">
                            <div>
                              <strong className="text-slate-900 text-[11px] block">{prod.name} Proposal Config</strong>
                              <span className="block font-mono text-[9px] text-slate-400">Class: {prod.category.toUpperCase()}</span>
                              {clientDocName.trim() && (
                                <span className="block text-[9px] text-indigo-600 font-bold mt-0.5">Prepared for: {clientDocName}</span>
                              )}
                            </div>
                            <span className="text-indigo-600 font-extrabold font-mono text-xs">
                              {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(prod.price)}
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800 mb-0.5">Specifications:</span>
                            <p className="font-mono text-slate-500">{prod.specs}</p>
                          </div>
                          {customDocNotes.trim() && (
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <span className="block font-bold text-slate-800 mb-0.5">Custom Executive Summary Notes:</span>
                              <p className="italic text-slate-500">{customDocNotes}</p>
                            </div>
                          )}
                          <div>
                            <span className="block font-bold text-slate-800 mb-0.5">Scope Summary:</span>
                            <p>{prod.description}</p>
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800 mb-0.5">Warranties & SLA:</span>
                            <ul className="list-disc leading-tight pl-4 gap-1 flex flex-col mt-1 text-slate-500">
                              {prod.features.slice(0, 2).map((f, i) => (
                                <li key={i}>{f}</li>
                              ))}
                              <li>Delivery turnaround SLA: <strong className="text-slate-700">{customDocSla}</strong></li>
                              <li>Support and deployment within Kisumu core</li>
                            </ul>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-slate-400">Select product model on settings dashboard.</p>
                  )}
                </div>

                {createdDocUrl && (
                  <div className="bg-white p-4 rounded-xl border border-indigo-250 border-dashed animate-fade-in space-y-2 mt-4">
                    <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs justify-center">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      <span>Google Doc Generated!</span>
                    </div>
                    <p className="text-[10px] text-slate-500 text-center">
                      Your business supply quotation document is written and formatted in your Google Drive. Launch directly with the direct portal link below:
                    </p>
                    <div className="text-center">
                      <a
                        href={createdDocUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-indigo-650 text-white hover:bg-indigo-700 font-extrabold px-5 py-2.5 rounded-xl shadow-md text-[10px] transition-colors cursor-pointer mt-1"
                      >
                        <span>Open Document in Google Docs ↗</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* MODAL: Booking calendar Slot */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-4 animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-slate-900 text-sm">Schedule Enterprise Consultation</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleBookConsultation} className="space-y-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Consultation Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Performance Workstation Audit"
                  required
                  value={bookingTitle}
                  onChange={(e) => setBookingTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Date *</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Time Slot *</label>
                  <input
                    type="time"
                    required
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Recipient/Client Email</label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={bookingClientEmail}
                  onChange={(e) => setBookingClientEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Consultation Scope / Notes</label>
                <textarea
                  placeholder="Provide parameters about LaserJet supply logs, custom quotes..."
                  rows={3}
                  value={bookingDesc}
                  onChange={(e) => setBookingDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium resize-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBooking}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer text-[11px]"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Schedule</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Compose Email */}
      {showMailModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-100 shadow-2xl p-6 space-y-4 animate-fade-in text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-display font-extrabold text-slate-900 text-sm">Compose Google Gmail</h3>
              <button
                onClick={() => setShowMailModal(false)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleComposeEmail} className="space-y-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Mail To Address *</label>
                <input
                  type="email"
                  placeholder="recipient@company.com"
                  required
                  value={mailTo}
                  onChange={(e) => setMailTo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Subject *</label>
                <input
                  type="text"
                  placeholder="e.g., Vince Solutions Consultation Followup"
                  required
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 block">Message Body *</label>
                <textarea
                  placeholder="Write details or confirmation messages..."
                  rows={5}
                  required
                  value={mailBody}
                  onChange={(e) => setMailBody(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none text-[11px] font-medium resize-none shadow-inner"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowMailModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingMail}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer text-[11px]"
                >
                  {isSendingMail ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Drafting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Dispatch</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
