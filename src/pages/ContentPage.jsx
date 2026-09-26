import React, { useState, useEffect, useCallback } from 'react'
import {
  getContentSummary,
  listAgriNews,
  createAgriNews,
  updateAgriNews,
  deleteAgriNews,
  batchUpdateNewsStatus,
  listAgriChannels,
  createAgriChannel,
  updateAgriChannel,
  regenerateStreamKey,
  listChannelChatMessages,
  deleteChatMessage,
  banChatUser,
  batchUpdateChannelStatus,
  listWorkshops,
  createWorkshop,
  updateWorkshop,
  cancelWorkshop,
  getWorkshopRoster,
  issueWorkshopCertificate,
  refundWorkshopEnrollment,
  batchUpdateWorkshopStatus,
  listExpertTalks,
  createExpertTalk,
  updateExpertTalk,
  triageFarmerQuestion,
  batchUpdateTalkStatus,
  listVideoGuides,
  createVideoGuide,
  updateVideoGuide,
  deleteVideoGuide,
  batchUpdateVideoStatus,
  listBlogArticles,
  createBlogArticle,
  updateBlogArticle,
  deleteBlogArticle,
  batchUpdateBlogStatus,
  getContentAuditLogs,
  resetContentSeedData
} from '../api/contentApi'
import {
  ContentMetricBar,
  ContentTabSwitch,
  ContentFiltersBar,
  BatchActionBar,
  AgriNewsTable,
  AgriChannelsTable,
  WorkshopsTable,
  ExpertTalksTable,
  VideoGuidesTable,
  BlogArticlesTable,
  ContentAuditLogsTable,
  ContentPagination
} from './contentWidgets'
import ContentDetailDrawer from '../components/content/ContentDetailDrawer'
import {
  AuditReasonConfirmationModal,
  DualSignOffModal,
  CreateEditNewsModal,
  ManageChannelModal,
  ChannelChatModerationModal,
  CreateEditWorkshopModal,
  WorkshopRosterModal,
  ScheduleExpertTalkModal,
  TriageQuestionsModal,
  CreateEditVideoGuideModal,
  CreateEditBlogModal,
  ResetSeedModal,
  BatchActionModal
} from '../components/content/ContentModals'
import { useNotification } from '../context/NotificationContext'
import { useAuthAdmin } from '../context/AuthAdminContext'
import { AlertTriangle, ShieldCheck } from 'lucide-react'

const PAGE_SIZE = 20

function toCsv(rows) {
  if (!rows || rows.length === 0) return ''
  const head = Object.keys(rows[0]).filter((k) => typeof rows[0][k] !== 'object')
  const lines = rows.map((r) =>
    head.map((k) => `"${String(r[k] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  return [head.join(','), ...lines].join('\n')
}

function downloadBlob(content, filename, type = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ContentPage() {
  const { addToast } = useNotification() || { addToast: () => {} }
  const { currentAdmin, currentRoleKey, hasPermission } = useAuthAdmin() || {
    currentAdmin: { name: 'Super Admin', email: 'root@agrovercity.in' },
    currentRoleKey: 'SUPER_ADMIN',
    hasPermission: () => true
  }

  const isFinancialAuditor = currentRoleKey === 'FINANCIAL_AUDITOR' || currentAdmin?.role === 'FINANCIAL_AUDITOR'
  const canMutate = !isFinancialAuditor && (hasPermission('canUpdateStatus') || hasPermission('canDelete') || currentRoleKey === 'SUPER_ADMIN')

  const [activeTab, setActiveTab] = useState('news') // 'news', 'channels', 'workshops', 'talks', 'videos', 'blogs', 'audit'
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [persona, setPersona] = useState('all')
  const [page, setPage] = useState(1)

  // Multi-row Selection
  const [selectedIds, setSelectedIds] = useState([])

  // Table Data
  const [tableData, setTableData] = useState({ data: [], total: 0 })

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)

  // Modals
  const [newsModal, setNewsModal] = useState({ open: false, item: null })
  const [channelModal, setChannelModal] = useState({ open: false, channel: null })
  const [chatModal, setChatModal] = useState({ open: false, channel: null })
  const [workshopModal, setWorkshopModal] = useState({ open: false, item: null })
  const [rosterModal, setRosterModal] = useState({ open: false, workshop: null, roster: [] })
  const [talkModal, setTalkModal] = useState({ open: false, item: null })
  const [triageModal, setTriageModal] = useState({ open: false, talk: null })
  const [videoModal, setVideoModal] = useState({ open: false, item: null })
  const [blogModal, setBlogModal] = useState({ open: false, item: null })
  const [resetSeedModalOpen, setResetSeedModalOpen] = useState(false)
  const [batchModal, setBatchModal] = useState({ open: false, newStatus: '', title: '', actionLabel: '' })

  // Reason Confirmation & Dual Sign-off
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    confirmVariant: 'rose',
    onConfirm: null
  })
  const [dualSignOffDialog, setDualSignOffDialog] = useState({
    open: false,
    title: '',
    amount: 0,
    details: '',
    onConfirm: null
  })

  // 1. Load Summary
  const loadSummary = useCallback(async () => {
    try {
      const s = await getContentSummary()
      setSummary(s)
    } catch (err) {
      console.warn('Failed to load content summary:', err)
    }
  }, [])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  // Reset page, selection, and filters on tab switch
  const handleTabSelect = (tab) => {
    setActiveTab(tab)
    setPage(1)
    setSearch('')
    setStatusFilter('all')
    setCategoryFilter('all')
    setLanguageFilter('all')
    setDateRange('all')
    setPersona('all')
    setSelectedIds([])
  }

  // 2. Fetch Data for Active Tab
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      let res = { data: [], total: 0 }
      if (activeTab === 'news') {
        res = await listAgriNews({
          q: search,
          status: statusFilter,
          category: categoryFilter,
          language: languageFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'channels') {
        res = await listAgriChannels({
          q: search,
          status: statusFilter,
          language: languageFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'workshops') {
        res = await listWorkshops({
          q: search,
          status: statusFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'talks') {
        res = await listExpertTalks({
          q: search,
          status: statusFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'videos') {
        res = await listVideoGuides({
          q: search,
          status: statusFilter,
          category: categoryFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'blogs') {
        res = await listBlogArticles({
          q: search,
          status: statusFilter,
          category: categoryFilter,
          dateRange,
          persona,
          page,
          pageSize: PAGE_SIZE
        })
      } else if (activeTab === 'audit') {
        res = await getContentAuditLogs({
          q: search,
          actionType: statusFilter,
          dateRange,
          page,
          pageSize: PAGE_SIZE
        })
      }
      setTableData(res)
    } catch (err) {
      addToast({
        title: 'Data Load Error',
        message: err.message || 'Failed to fetch content records.',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, statusFilter, categoryFilter, languageFilter, dateRange, persona, page, addToast])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Multi-row Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (checked) => {
    if (checked && tableData.data) {
      setSelectedIds(tableData.data.map((item) => item.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleClearSelection = () => {
    setSelectedIds([])
  }

  // Handlers for Drawer
  const handleOpenDrawer = (entity) => {
    setSelectedEntity(entity)
    setDrawerOpen(true)
  }

  // Export CSV
  const handleExportCsv = () => {
    if (!tableData.data || tableData.data.length === 0) {
      addToast({
        title: 'Export Failed',
        message: 'No records available to export.',
        type: 'warning'
      })
      return
    }
    const csv = toCsv(tableData.data)
    downloadBlob(csv, `${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`)
    addToast({
      title: 'CSV Export Generated',
      message: `Exported ${tableData.data.length} records for ${activeTab}.`,
      type: 'success'
    })
  }

  // Batch Action Trigger
  const handleBatchActionTrigger = (action) => {
    if (selectedIds.length === 0) return
    if (action === 'export') {
      const selectedRows = tableData.data.filter((r) => selectedIds.includes(r.id))
      const csv = toCsv(selectedRows)
      downloadBlob(csv, `${activeTab}_selected_batch_${new Date().toISOString().slice(0, 10)}.csv`)
      addToast({
        title: 'Batch Export Generated',
        message: `Exported ${selectedRows.length} selected records for ${activeTab}.`,
        type: 'success'
      })
      return
    }

    if (!canMutate) {
      addToast({
        title: 'Permission Denied',
        message: 'Your current admin role does not have permission to execute batch updates.',
        type: 'error'
      })
      return
    }

    setBatchModal({
      open: true,
      newStatus: action,
      title: `Batch Status Update: ${activeTab.toUpperCase()}`,
      actionLabel: `Apply "${action}" to ${selectedIds.length} Records`
    })
  }

  const handleConfirmBatchAction = async (reason) => {
    try {
      const newStatus = batchModal.newStatus
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'

      if (activeTab === 'news') {
        await batchUpdateNewsStatus(selectedIds, newStatus, reason, adminUid, adminName)
      } else if (activeTab === 'channels') {
        await batchUpdateChannelStatus(selectedIds, newStatus, reason, adminUid, adminName)
      } else if (activeTab === 'workshops') {
        await batchUpdateWorkshopStatus(selectedIds, newStatus, reason, adminUid, adminName)
      } else if (activeTab === 'talks') {
        await batchUpdateTalkStatus(selectedIds, newStatus, reason, adminUid, adminName)
      } else if (activeTab === 'videos') {
        await batchUpdateVideoStatus(selectedIds, newStatus, reason, adminUid, adminName)
      } else if (activeTab === 'blogs') {
        await batchUpdateBlogStatus(selectedIds, newStatus, reason, adminUid, adminName)
      }

      addToast({
        title: 'Batch Update Completed',
        message: `Successfully updated ${selectedIds.length} records in ${activeTab}.`,
        type: 'success'
      })
      setSelectedIds([])
      setBatchModal({ open: false, newStatus: '', title: '', actionLabel: '' })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Batch Action Failed', message: err.message, type: 'error' })
    }
  }

  // Reset Seed Data
  const handleConfirmResetSeed = async (reason) => {
    try {
      await resetContentSeedData(reason, currentAdmin?.email, currentAdmin?.name)
      addToast({
        title: 'Benchmark Seed Restored',
        message: 'All Module 20 collections and mock rosters reset to official SOP-20 state.',
        type: 'success'
      })
      setSelectedIds([])
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Reset Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // NEWS ACTIONS
  // -------------------------------------------------------------
  const handleSaveNews = async (formData) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      if (newsModal.item) {
        await updateAgriNews(newsModal.item.id, formData, adminUid, adminName)
        addToast({ title: 'Article Updated', message: 'Agricultural news article updated successfully.', type: 'success' })
      } else {
        await createAgriNews(formData, adminUid, adminName)
        addToast({ title: 'Article Published', message: 'New agricultural news article published to knowledge hub.', type: 'success' })
      }
      setNewsModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Operation Failed', message: err.message, type: 'error' })
    }
  }

  const handleDeleteNews = (item) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Agricultural News Article',
      message: `Are you sure you want to delete "${item.title}"? This action will remove the article and vernacular audio narration from mobile feeds.`,
      confirmLabel: 'Delete Article',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          const adminUid = currentAdmin?.email || 'usr_admin_root'
          const adminName = currentAdmin?.name || 'Super Admin'
          await deleteAgriNews(item.id, reason, adminUid, adminName)
          addToast({ title: 'Article Deleted', message: `Article ${item.id} removed from feed.`, type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // -------------------------------------------------------------
  // CHANNELS ACTIONS
  // -------------------------------------------------------------
  const handleSaveChannel = async (formData) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      if (channelModal.channel) {
        await updateAgriChannel(channelModal.channel.id, formData, adminUid, adminName)
        addToast({ title: 'Channel Updated', message: 'Live stream channel configuration saved.', type: 'success' })
      } else {
        await createAgriChannel(formData, adminUid, adminName)
        addToast({ title: 'Channel Provisioned', message: 'New RTMP ingest & HLS live TV channel created.', type: 'success' })
      }
      setChannelModal({ open: false, channel: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Channel Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleRegenerateKey = (channel) => {
    setConfirmDialog({
      open: true,
      title: 'Regenerate RTMP Stream Ingest Key',
      message: `Regenerating the ingest key for "${channel.channelName}" will immediately terminate any active broadcast feed until the encoder is updated with the new key.`,
      confirmLabel: 'Regenerate Key',
      confirmVariant: 'amber',
      onConfirm: async (reason) => {
        try {
          const adminUid = currentAdmin?.email || 'usr_admin_root'
          const adminName = currentAdmin?.name || 'Super Admin'
          const res = await regenerateStreamKey(channel.id, reason, adminUid, adminName)
          addToast({
            title: 'Stream Key Rotated',
            message: `New RTMP key generated: ${res.streamKey.slice(0, 12)}••••`,
            type: 'success'
          })
          setConfirmDialog({ open: false })
          setChannelModal({ open: false, channel: null })
          loadData()
        } catch (err) {
          addToast({ title: 'Key Rotation Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  const handleDeleteChatMessage = async (channelId, messageId) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      await deleteChatMessage(channelId, messageId, 'Flagged by superadmin moderation', adminUid, adminName)
      addToast({ title: 'Message Pruned', message: 'Chat message deleted from live viewer scroll.', type: 'success' })
      if (chatModal.channel) {
        const msgs = await listChannelChatMessages(channelId)
        setChatModal((prev) => ({
          ...prev,
          channel: { ...prev.channel, chatMessages: msgs }
        }))
      }
      loadData()
    } catch (err) {
      addToast({ title: 'Moderation Failed', message: err.message, type: 'error' })
    }
  }

  const handleBanChatUser = async (channelId, userId, payload) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      await banChatUser(channelId, userId, payload, adminUid, adminName)
      addToast({
        title: 'User Banned',
        message: `User ${userId} banned (${payload.banType}) from live channel chat.`,
        type: 'success'
      })
      if (chatModal.channel) {
        const msgs = await listChannelChatMessages(channelId)
        setChatModal((prev) => ({
          ...prev,
          channel: { ...prev.channel, chatMessages: msgs }
        }))
      }
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Ban Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // WORKSHOPS ACTIONS
  // -------------------------------------------------------------
  const handleSaveWorkshop = async (formData) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      if (workshopModal.item) {
        await updateWorkshop(workshopModal.item.id, formData, adminUid, adminName)
        addToast({ title: 'Workshop Updated', message: 'ICAR workshop curriculum & schedule saved.', type: 'success' })
      } else {
        await createWorkshop(formData, adminUid, adminName)
        addToast({ title: 'Workshop Created', message: 'New accredited workshop opened for farmer registrations.', type: 'success' })
      }
      setWorkshopModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Workshop Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleCancelWorkshop = (ws) => {
    const totalRefundRequired = ws.enrolledCount * ws.feeINR
    const requiresDualSignOff = totalRefundRequired > 50000

    if (requiresDualSignOff) {
      setDualSignOffDialog({
        open: true,
        title: `Authorize Mass Cancellation Refund for ${ws.title}`,
        amount: totalRefundRequired,
        details: `Workshop ID ${ws.id} has ${ws.enrolledCount} enrolled farmers. Mass cancellation will trigger ₹${totalRefundRequired.toLocaleString('en-IN')} in automated refunds.`,
        onConfirm: async ({ secondAdminEmail, reason }) => {
          try {
            const adminUid = currentAdmin?.email || 'usr_admin_root'
            const adminName = currentAdmin?.name || 'Super Admin'
            await cancelWorkshop(ws.id, {
              reason,
              triggerRefunds: true,
              dualSignOffAdmin: secondAdminEmail
            }, adminUid, adminName)
            addToast({
              title: 'Workshop Cancelled & Refunded',
              message: `Cancelled workshop ${ws.id}. Mass refunds of ₹${totalRefundRequired.toLocaleString('en-IN')} dual-authorized by ${secondAdminEmail}.`,
              type: 'success'
            })
            setDualSignOffDialog({ open: false })
            setDrawerOpen(false)
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Cancellation Failed', message: err.message, type: 'error' })
          }
        }
      })
    } else {
      setConfirmDialog({
        open: true,
        title: 'Cancel ICAR Workshop & Trigger Refunds',
        message: `Are you sure you want to cancel "${ws.title}"? This will cancel the session and initiate automatic refunds of ₹${totalRefundRequired.toLocaleString('en-IN')} for all ${ws.enrolledCount} enrolled farmers.`,
        confirmLabel: 'Cancel & Refund',
        confirmVariant: 'rose',
        onConfirm: async (reason) => {
          try {
            const adminUid = currentAdmin?.email || 'usr_admin_root'
            const adminName = currentAdmin?.name || 'Super Admin'
            await cancelWorkshop(ws.id, { reason, triggerRefunds: true }, adminUid, adminName)
            addToast({ title: 'Workshop Cancelled', message: `Workshop ${ws.id} cancelled.`, type: 'success' })
            setConfirmDialog({ open: false })
            setDrawerOpen(false)
            loadData()
            loadSummary()
          } catch (err) {
            addToast({ title: 'Cancellation Failed', message: err.message, type: 'error' })
          }
        }
      })
    }
  }

  const handleOpenRoster = async (ws) => {
    try {
      const roster = await getWorkshopRoster(ws.id)
      setRosterModal({ open: true, workshop: ws, roster })
    } catch (err) {
      addToast({ title: 'Roster Load Error', message: err.message, type: 'error' })
    }
  }

  const handleIssueCert = async (enrollmentId, reason) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      const res = await issueWorkshopCertificate(rosterModal.workshop.id, enrollmentId, reason, adminUid, adminName)
      addToast({
        title: 'ICAR Certificate Issued',
        message: `Certificate ${res.certificateId} issued to ${res.farmerName}.`,
        type: 'success'
      })
      const updatedRoster = await getWorkshopRoster(rosterModal.workshop.id)
      setRosterModal((prev) => ({ ...prev, roster: updatedRoster }))
      loadData()
    } catch (err) {
      addToast({ title: 'Certificate Issuance Failed', message: err.message, type: 'error' })
    }
  }

  const handleRefundRosterFarmer = async (enrollmentId, reason) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      const res = await refundWorkshopEnrollment(rosterModal.workshop.id, enrollmentId, { reason }, adminUid, adminName)
      addToast({
        title: 'Farmer Refund Processed',
        message: `Refund recorded for participant ${res.farmerName}.`,
        type: 'success'
      })
      const updatedRoster = await getWorkshopRoster(rosterModal.workshop.id)
      setRosterModal((prev) => ({ ...prev, roster: updatedRoster }))
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Refund Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // EXPERT TALKS ACTIONS
  // -------------------------------------------------------------
  const handleSaveTalk = async (formData) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      if (talkModal.item) {
        await updateExpertTalk(talkModal.item.id, formData, adminUid, adminName)
        addToast({ title: 'Session Updated', message: 'Ask-the-Scientist talk updated.', type: 'success' })
      } else {
        await createExpertTalk(formData, adminUid, adminName)
        addToast({ title: 'Session Scheduled', message: 'New expert scientist talk scheduled.', type: 'success' })
      }
      setTalkModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Session Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleTriageQuestionAction = async (talkId, questionId, status, priority, reason) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      await triageFarmerQuestion(talkId, questionId, { status, priority, reason }, adminUid, adminName)
      addToast({
        title: 'Question Triaged',
        message: `Question status updated to "${status}" (${priority} priority).`,
        type: 'success'
      })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Triage Failed', message: err.message, type: 'error' })
    }
  }

  // -------------------------------------------------------------
  // VIDEOS ACTIONS
  // -------------------------------------------------------------
  const handleSaveVideo = async (formData) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      if (videoModal.item) {
        await updateVideoGuide(videoModal.item.id, formData, adminUid, adminName)
        addToast({ title: 'Video Updated', message: 'Agronomy tutorial video metadata updated.', type: 'success' })
      } else {
        await createVideoGuide(formData, adminUid, adminName)
        addToast({ title: 'Video Published', message: 'New video guide published to knowledge hub.', type: 'success' })
      }
      setVideoModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Video Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleDeleteVideo = (vid) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Agronomy Video Guide',
      message: `Are you sure you want to remove "${vid.title}"? It will no longer be discoverable in farmer search results.`,
      confirmLabel: 'Delete Video',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          const adminUid = currentAdmin?.email || 'usr_admin_root'
          const adminName = currentAdmin?.name || 'Super Admin'
          await deleteVideoGuide(vid.id, reason, adminUid, adminName)
          addToast({ title: 'Video Removed', message: `Video ${vid.id} deleted.`, type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // -------------------------------------------------------------
  // BLOG ARTICLES ACTIONS
  // -------------------------------------------------------------
  const handleSaveBlog = async (formData) => {
    try {
      const adminUid = currentAdmin?.email || 'usr_admin_root'
      const adminName = currentAdmin?.name || 'Super Admin'
      if (blogModal.item) {
        await updateBlogArticle(blogModal.item.id, formData, adminUid, adminName)
        addToast({ title: 'Article Updated', message: 'Knowledge blog article updated.', type: 'success' })
      } else {
        await createBlogArticle(formData, adminUid, adminName)
        addToast({ title: 'Article Published', message: 'New knowledge blog published to portal.', type: 'success' })
      }
      setBlogModal({ open: false, item: null })
      loadData()
      loadSummary()
    } catch (err) {
      addToast({ title: 'Blog Save Failed', message: err.message, type: 'error' })
    }
  }

  const handleDeleteBlog = (blog) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Knowledge Blog Article',
      message: `Are you sure you want to remove "${blog.title}"?`,
      confirmLabel: 'Delete Blog',
      confirmVariant: 'rose',
      onConfirm: async (reason) => {
        try {
          const adminUid = currentAdmin?.email || 'usr_admin_root'
          const adminName = currentAdmin?.name || 'Super Admin'
          await deleteBlogArticle(blog.id, reason, adminUid, adminName)
          addToast({ title: 'Blog Deleted', message: `Article ${blog.id} deleted.`, type: 'success' })
          setConfirmDialog({ open: false })
          setDrawerOpen(false)
          loadData()
          loadSummary()
        } catch (err) {
          addToast({ title: 'Delete Failed', message: err.message, type: 'error' })
        }
      }
    })
  }

  // Handle generic "Create New" click
  const handleCreateNew = () => {
    if (!canMutate) {
      addToast({
        title: 'Action Restricted',
        message: 'Your role does not allow publishing or creating content.',
        type: 'warning'
      })
      return
    }
    if (activeTab === 'news') setNewsModal({ open: true, item: null })
    else if (activeTab === 'channels') setChannelModal({ open: true, channel: null })
    else if (activeTab === 'workshops') setWorkshopModal({ open: true, item: null })
    else if (activeTab === 'talks') setTalkModal({ open: true, item: null })
    else if (activeTab === 'videos') setVideoModal({ open: true, item: null })
    else if (activeTab === 'blogs') setBlogModal({ open: true, item: null })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              SOP-20 Console
            </span>
            <span className="text-xs font-mono text-slate-500">
              Target Collections: agri_news • agri_channels • workshops • expert_talks • video_guides • blog_articles
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Knowledge Hub, Content CMS &amp; Live Media
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Agricultural news CMS with vernacular narration, live TV streaming &amp; chat moderation, ICAR paid workshops, Ask-the-Scientist Q&amp;A sessions, and bilingual agronomy guides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono flex items-center gap-2 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 font-semibold">{currentAdmin?.name || 'Super Admin'}</span>
            <span className="text-slate-400">({currentRoleKey})</span>
          </div>
        </div>
      </div>

      {/* Statutory Auditor Notice if Financial Auditor Persona */}
      {isFinancialAuditor && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Statutory Compliance Audit Mode (Financial Auditor):</strong> Read-only access enforced under SOP-20 Section 6. Editorial creation, stream key regeneration, live chat bans, and refund disbursements are disabled.
            </span>
          </div>
          <span className="font-mono text-[10px] bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full font-bold uppercase">
            AUDIT_MODE
          </span>
        </div>
      )}

      {/* Top Metric Bar */}
      <ContentMetricBar summary={summary} loading={!summary} />

      {/* Main Content Workspace Card */}
      <div className="bg-white/90 border border-emerald-100/90 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)] backdrop-blur-xl overflow-hidden">
        {/* Module Tab Switcher */}
        <ContentTabSwitch
          activeTab={activeTab}
          onSelectTab={handleTabSelect}
          counts={{
            news: summary?.totalNewsArticles,
            channels: summary?.liveChannelsCount,
            workshops: summary?.activeWorkshops,
            talks: summary?.expertTalksScheduled,
            videos: summary?.videoGuidesPublished,
            blogs: summary?.blogArticlesPublished,
            audit: summary?.totalAuditLogs
          }}
        />

        {/* Search & Filter Bar */}
        <ContentFiltersBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          category={categoryFilter}
          onCategoryChange={setCategoryFilter}
          language={languageFilter}
          onLanguageChange={setLanguageFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          persona={persona}
          onPersonaChange={setPersona}
          activeTab={activeTab}
          onRefresh={loadData}
          onExportCsv={handleExportCsv}
          onCreateNew={handleCreateNew}
          onResetSeed={() => setResetSeedModalOpen(true)}
          canCreate={canMutate}
        />

        {/* Batch Action Toolbar */}
        <div className="px-4">
          <BatchActionBar
            selectedCount={selectedIds.length}
            activeTab={activeTab}
            onBatchAction={handleBatchActionTrigger}
            onClearSelection={handleClearSelection}
          />
        </div>

        {/* Primary Data Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600 mr-2" />
            Loading {activeTab} data records...
          </div>
        ) : (
          <>
            {activeTab === 'news' && (
              <AgriNewsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEdit={canMutate ? (item) => setNewsModal({ open: true, item }) : null}
                onDelete={canMutate ? handleDeleteNews : null}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            )}

            {activeTab === 'channels' && (
              <AgriChannelsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onManageKeys={canMutate ? (chan) => setChannelModal({ open: true, channel: chan }) : null}
                onModerateChat={canMutate ? (chan) => setChatModal({ open: true, channel: chan }) : null}
                onToggleStatus={canMutate ? (chan) => setChannelModal({ open: true, channel: chan }) : null}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            )}

            {activeTab === 'workshops' && (
              <WorkshopsTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onRoster={handleOpenRoster}
                onEdit={canMutate ? (ws) => setWorkshopModal({ open: true, item: ws }) : null}
                onCancel={canMutate ? handleCancelWorkshop : null}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            )}

            {activeTab === 'talks' && (
              <ExpertTalksTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onTriage={canMutate ? (talk) => setTriageModal({ open: true, talk }) : null}
                onEdit={canMutate ? (talk) => setTalkModal({ open: true, item: talk }) : null}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            )}

            {activeTab === 'videos' && (
              <VideoGuidesTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEdit={canMutate ? (vid) => setVideoModal({ open: true, item: vid }) : null}
                onDelete={canMutate ? handleDeleteVideo : null}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            )}

            {activeTab === 'blogs' && (
              <BlogArticlesTable
                data={tableData.data}
                onView={handleOpenDrawer}
                onEdit={canMutate ? (blog) => setBlogModal({ open: true, item: blog }) : null}
                onDelete={canMutate ? handleDeleteBlog : null}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onSelectAll={handleSelectAll}
              />
            )}

            {activeTab === 'audit' && (
              <ContentAuditLogsTable data={tableData.data} />
            )}

            {/* Pagination Controls */}
            <ContentPagination
              page={page}
              pageSize={PAGE_SIZE}
              total={tableData.total || 0}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <ContentDetailDrawer
        isOpen={drawerOpen}
        entity={selectedEntity}
        type={activeTab}
        canMutate={canMutate}
        role={currentRoleKey}
        onClose={() => setDrawerOpen(false)}
        onEdit={(item) => {
          if (!canMutate) return
          if (activeTab === 'news') setNewsModal({ open: true, item })
          else if (activeTab === 'channels') setChannelModal({ open: true, channel: item })
          else if (activeTab === 'workshops') setWorkshopModal({ open: true, item })
          else if (activeTab === 'talks') setTalkModal({ open: true, item })
          else if (activeTab === 'videos') setVideoModal({ open: true, item })
          else if (activeTab === 'blogs') setBlogModal({ open: true, item })
        }}
        onDelete={(item) => {
          if (!canMutate) return
          if (activeTab === 'news') handleDeleteNews(item)
          else if (activeTab === 'videos') handleDeleteVideo(item)
          else if (activeTab === 'blogs') handleDeleteBlog(item)
        }}
        onManageKeys={canMutate ? (chan) => setChannelModal({ open: true, channel: chan }) : null}
        onModerateChat={canMutate ? (chan) => setChatModal({ open: true, channel: chan }) : null}
        onRoster={(ws) => handleOpenRoster(ws)}
        onTriage={canMutate ? (talk) => setTriageModal({ open: true, talk }) : null}
      />

      {/* Action Modals */}
      <CreateEditNewsModal
        isOpen={newsModal.open}
        initialData={newsModal.item}
        onClose={() => setNewsModal({ open: false, item: null })}
        onSave={handleSaveNews}
      />

      <ManageChannelModal
        isOpen={channelModal.open}
        channel={channelModal.channel}
        onClose={() => setChannelModal({ open: false, channel: null })}
        onSave={handleSaveChannel}
        onRegenerateKey={handleRegenerateKey}
      />

      <ChannelChatModerationModal
        isOpen={chatModal.open}
        channel={chatModal.channel}
        onClose={() => setChatModal({ open: false, channel: null })}
        onDeleteMessage={handleDeleteChatMessage}
        onBanUser={handleBanChatUser}
      />

      <CreateEditWorkshopModal
        isOpen={workshopModal.open}
        initialData={workshopModal.item}
        onClose={() => setWorkshopModal({ open: false, item: null })}
        onSave={handleSaveWorkshop}
      />

      <WorkshopRosterModal
        isOpen={rosterModal.open}
        workshop={rosterModal.workshop}
        roster={rosterModal.roster}
        onClose={() => setRosterModal({ open: false, workshop: null, roster: [] })}
        onIssueCertificate={canMutate ? handleIssueCert : null}
        onRefund={canMutate ? handleRefundRosterFarmer : null}
      />

      <ScheduleExpertTalkModal
        isOpen={talkModal.open}
        initialData={talkModal.item}
        onClose={() => setTalkModal({ open: false, item: null })}
        onSave={handleSaveTalk}
      />

      <TriageQuestionsModal
        isOpen={triageModal.open}
        talk={triageModal.talk}
        onClose={() => setTriageModal({ open: false, talk: null })}
        onTriageQuestion={handleTriageQuestionAction}
      />

      <CreateEditVideoGuideModal
        isOpen={videoModal.open}
        initialData={videoModal.item}
        onClose={() => setVideoModal({ open: false, item: null })}
        onSave={handleSaveVideo}
      />

      <CreateEditBlogModal
        isOpen={blogModal.open}
        initialData={blogModal.item}
        onClose={() => setBlogModal({ open: false, item: null })}
        onSave={handleSaveBlog}
      />

      <ResetSeedModal
        isOpen={resetSeedModalOpen}
        onClose={() => setResetSeedModalOpen(false)}
        onConfirm={handleConfirmResetSeed}
      />

      <BatchActionModal
        isOpen={batchModal.open}
        title={batchModal.title}
        count={selectedIds.length}
        actionLabel={batchModal.actionLabel}
        onClose={() => setBatchModal({ open: false, newStatus: '', title: '', actionLabel: '' })}
        onConfirm={handleConfirmBatchAction}
      />

      <AuditReasonConfirmationModal
        isOpen={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        onClose={() => setConfirmDialog({ open: false })}
        onConfirm={confirmDialog.onConfirm || (() => {})}
      />

      <DualSignOffModal
        isOpen={dualSignOffDialog.open}
        title={dualSignOffDialog.title}
        amount={dualSignOffDialog.amount}
        details={dualSignOffDialog.details}
        onClose={() => setDualSignOffDialog({ open: false })}
        onConfirm={dualSignOffDialog.onConfirm || (() => {})}
      />
    </div>
  )
}
